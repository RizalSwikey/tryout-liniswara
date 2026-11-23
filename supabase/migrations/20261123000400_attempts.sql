-- RPC tryout. statements tidak punya policy select, jadi teks pernyataan dan kunci
-- hanya keluar lewat fungsi ini. Kunci (is_true) dan explanation hanya disertakan
-- setelah attempt berstatus submitted.

create or replace function public.assert_active_subscription()
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from subscriptions s
    where s.user_id = (select auth.uid()) and s.ends_at > now()
  ) then
    raise exception 'SUBSCRIPTION_REQUIRED';
  end if;
end;
$$;

revoke all on function public.assert_active_subscription() from public, anon;
grant execute on function public.assert_active_subscription() to authenticated;

-- 5 detik toleransi jaringan untuk submit.
create or replace function public.deadline_tolerance()
returns interval language sql immutable as $$ select interval '5 seconds'; $$;

-- Finalisasi attempt yang lewat deadline: kunci jawaban yang tersimpan saat deadline.
create or replace function public.finalize_attempt(p_attempt uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt attempts%rowtype;
  v_score integer;
begin
  select * into v_attempt from attempts a where a.id = p_attempt for update;
  if not found or v_attempt.submitted_at is not null then
    return;
  end if;
  if now() <= v_attempt.deadline_at + public.deadline_tolerance() then
    return;
  end if;

  select count(*) into v_score
  from attempt_answers aa
  join statements st on st.id = aa.statement_id
  join questions q on q.id = st.question_id
  where aa.attempt_id = p_attempt
    and aa.answered_at <= v_attempt.deadline_at + public.deadline_tolerance()
    and aa.answer = st.is_true;

  update attempts
  set submitted_at = v_attempt.deadline_at, score = v_score
  where id = p_attempt and submitted_at is null;
end;
$$;

revoke all on function public.finalize_attempt(uuid) from public, anon;
grant execute on function public.finalize_attempt(uuid) to authenticated;

create or replace function public.attempt_payload(p_attempt uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user uuid := (select auth.uid());
  v_attempt attempts%rowtype;
  v_result jsonb;
begin
  select * into v_attempt from attempts a where a.id = p_attempt and a.user_id = v_user;
  if not found then
    raise exception 'ATTEMPT_NOT_FOUND';
  end if;

  if v_attempt.submitted_at is not null then
    v_result := jsonb_build_object(
      'id', v_attempt.id,
      'status', 'submitted',
      'score', v_attempt.score,
      'started_at', v_attempt.started_at,
      'deadline_at', v_attempt.deadline_at,
      'submitted_at', v_attempt.submitted_at,
      'tryout', (select jsonb_build_object('id', t.id, 'title', t.title, 'duration_minutes', t.duration_minutes)
                 from tryouts t where t.id = v_attempt.tryout_id),
      'questions', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', q.id,
          'position', q.position,
          'stimulus', q.stimulus,
          'statements', coalesce((
            select jsonb_agg(jsonb_build_object(
              'id', st.id,
              'position', st.position,
              'text', st.text,
              'is_true', st.is_true,
              'explanation', st.explanation,
              'answer', (select aa.answer from attempt_answers aa
                         where aa.attempt_id = v_attempt.id and aa.statement_id = st.id)
            ) order by st.position)
            from statements st where st.question_id = q.id
          ), '[]'::jsonb)
        ) order by q.position)
        from questions q where q.tryout_id = v_attempt.tryout_id
      ), '[]'::jsonb)
    );
    return v_result;
  end if;

  return jsonb_build_object(
    'id', v_attempt.id,
    'status', 'active',
    'score', null,
    'started_at', v_attempt.started_at,
    'deadline_at', v_attempt.deadline_at,
    'submitted_at', null,
    'tryout', (select jsonb_build_object('id', t.id, 'title', t.title, 'duration_minutes', t.duration_minutes)
               from tryouts t where t.id = v_attempt.tryout_id),
    'questions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', q.id,
        'position', q.position,
        'stimulus', q.stimulus,
        'statements', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', st.id,
            'position', st.position,
            'text', st.text,
            'answer', (select aa.answer from attempt_answers aa
                       where aa.attempt_id = v_attempt.id and aa.statement_id = st.id)
          ) order by st.position)
          from statements st where st.question_id = q.id
        ), '[]'::jsonb)
      ) order by q.position)
      from questions q where q.tryout_id = v_attempt.tryout_id
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.attempt_payload(uuid) from public, anon;
grant execute on function public.attempt_payload(uuid) to authenticated;

-- Mulai attempt: pakai lagi attempt yang masih aktif (belum lewat deadline), atau buat baru.
create or replace function public.start_attempt(p_tryout uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := (select auth.uid());
  v_duration integer;
  v_published boolean;
  v_attempt attempts%rowtype;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;
  perform public.assert_active_subscription();

  select duration_minutes, is_published into v_duration, v_published
  from tryouts where id = p_tryout;

  if v_duration is null or not v_published then
    raise exception 'TRYOUT_NOT_FOUND';
  end if;

  select * into v_attempt
  from attempts a
  where a.user_id = v_user
    and a.tryout_id = p_tryout
    and a.submitted_at is null
    and a.deadline_at + public.deadline_tolerance() > now()
  order by a.started_at desc
  limit 1;

  if found then
    return public.attempt_payload(v_attempt.id);
  end if;

  insert into attempts (user_id, tryout_id, deadline_at)
  values (v_user, p_tryout, now() + make_interval(mins => v_duration))
  returning * into v_attempt;

  return public.attempt_payload(v_attempt.id);
end;
$$;

revoke all on function public.start_attempt(uuid) from public, anon;
grant execute on function public.start_attempt(uuid) to authenticated;

-- Simpan satu jawaban. Menolak attempt yang sudah submit atau sudah lewat deadline.
create or replace function public.save_answer(p_attempt uuid, p_statement uuid, p_answer boolean)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := (select auth.uid());
  v_attempt attempts%rowtype;
  v_statement statements%rowtype;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select * into v_attempt from attempts a where a.id = p_attempt and a.user_id = v_user for update;
  if not found then
    raise exception 'ATTEMPT_NOT_FOUND';
  end if;
  if v_attempt.submitted_at is not null then
    raise exception 'ATTEMPT_SUBMITTED';
  end if;
  if now() > v_attempt.deadline_at + public.deadline_tolerance() then
    perform public.finalize_attempt(v_attempt.id);
    raise exception 'DEADLINE_PASSED';
  end if;

  select st.* into v_statement
  from statements st
  join questions q on q.id = st.question_id
  where st.id = p_statement and q.tryout_id = v_attempt.tryout_id;

  if not found then
    raise exception 'STATEMENT_NOT_FOUND';
  end if;

  insert into attempt_answers (attempt_id, statement_id, answer, answered_at)
  values (v_attempt.id, v_statement.id, p_answer, now())
  on conflict (attempt_id, statement_id) do update
    set answer = excluded.answer, answered_at = excluded.answered_at;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.save_answer(uuid, uuid, boolean) from public, anon;
grant execute on function public.save_answer(uuid, uuid, boolean) to authenticated;

-- Submit: hitung skor di server dari attempt_answers.
create or replace function public.submit_attempt(p_attempt uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := (select auth.uid());
  v_attempt attempts%rowtype;
  v_score integer;
  v_total integer;
  v_full_questions integer;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select * into v_attempt from attempts a where a.id = p_attempt and a.user_id = v_user for update;
  if not found then
    raise exception 'ATTEMPT_NOT_FOUND';
  end if;
  if v_attempt.submitted_at is not null then
    raise exception 'ATTEMPT_SUBMITTED';
  end if;
  if now() > v_attempt.deadline_at + public.deadline_tolerance() then
    perform public.finalize_attempt(v_attempt.id);
    raise exception 'DEADLINE_PASSED';
  end if;

  select count(*) into v_score
  from attempt_answers aa
  join statements st on st.id = aa.statement_id
  join questions q on q.id = st.question_id
  where aa.attempt_id = v_attempt.id
    and q.tryout_id = v_attempt.tryout_id
    and aa.answer = st.is_true;

  select count(*) into v_total
  from statements st
  join questions q on q.id = st.question_id
  where q.tryout_id = v_attempt.tryout_id;

  select count(*) into v_full_questions
  from questions q
  where q.tryout_id = v_attempt.tryout_id
    and (select count(*) from statements st where st.question_id = q.id) > 0
    and (select count(*) from statements st
         join attempt_answers aa on aa.statement_id = st.id and aa.attempt_id = v_attempt.id
         where st.question_id = q.id and aa.answer = st.is_true)
        = (select count(*) from statements st where st.question_id = q.id);

  update attempts
  set submitted_at = now(), score = v_score
  where id = v_attempt.id;

  return jsonb_build_object('score', v_score, 'total', v_total, 'full_questions', v_full_questions);
end;
$$;

revoke all on function public.submit_attempt(uuid) from public, anon;
grant execute on function public.submit_attempt(uuid) to authenticated;

-- Ambil attempt: auto-finalisasi kalau sudah lewat deadline, lalu kirim payload.
create or replace function public.get_attempt(p_attempt uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := (select auth.uid());
  v_attempt attempts%rowtype;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;
  select * into v_attempt from attempts a where a.id = p_attempt and a.user_id = v_user;
  if not found then
    raise exception 'ATTEMPT_NOT_FOUND';
  end if;
  perform public.finalize_attempt(v_attempt.id);
  return public.attempt_payload(v_attempt.id);
end;
$$;

revoke all on function public.get_attempt(uuid) from public, anon;
grant execute on function public.get_attempt(uuid) to authenticated;
