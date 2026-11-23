-- RLS: setiap tabel punya policy eksplisit per operasi, atau sengaja tanpa policy
-- (akses hanya lewat fungsi security definer). auth.uid() bernilai null untuk anon,
-- jadi semua policy memakai syarat eksplisit auth.uid() is not null.

alter table profiles enable row level security;
alter table redeem_codes enable row level security;
alter table redemptions enable row level security;
alter table subscriptions enable row level security;
alter table materials enable row level security;
alter table tryouts enable row level security;
alter table questions enable row level security;
alter table statements enable row level security;
alter table attempts enable row level security;
alter table attempt_answers enable row level security;

-- profiles: pemilik baris saja.
create policy profiles_select_own on profiles
  for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = id);

create policy profiles_insert_own on profiles
  for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = id);

create policy profiles_update_own on profiles
  for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = id);

-- redeem_codes: TIDAK ada policy apa pun. Anggap tabel tidak ada bagi client.
-- Penukaran hanya lewat fungsi redeem_code() security definer.

-- redemptions: baca milik sendiri. Insert hanya lewat redeem_code().
create policy redemptions_select_own on redemptions
  for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

-- subscriptions: baca milik sendiri. Semua tulisan lewat redeem_code().
create policy subscriptions_select_own on subscriptions
  for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

-- Helper: langganan aktif untuk pemanggil. Security definer supaya policy lain
-- tidak perlu menembus RLS tabel subscriptions (menghindari rekursi evaluasi).
create function public.has_active_subscription()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from subscriptions s
    where s.user_id = (select auth.uid())
      and s.ends_at > now()
  );
$$;

revoke all on function public.has_active_subscription() from public, anon;
grant execute on function public.has_active_subscription() to authenticated;

-- materials: hanya yang terbit DAN pemanggil punya langganan aktif.
create policy materials_select_subscribed on materials
  for select to authenticated
  using (
    (select auth.uid()) is not null
    and is_published
    and public.has_active_subscription()
  );

-- tryouts: judul dan durasi boleh dibaca saat langganan aktif.
create policy tryouts_select_subscribed on tryouts
  for select to authenticated
  using (
    (select auth.uid()) is not null
    and is_published
    and public.has_active_subscription()
  );

-- questions: stimulus saja; is_true ada di tabel statements yang tertutup total.
create policy questions_select_subscribed on questions
  for select to authenticated
  using (
    (select auth.uid()) is not null
    and public.has_active_subscription()
    and exists (
      select 1 from tryouts t
      where t.id = questions.tryout_id and t.is_published
    )
  );

-- statements: TIDAK ada policy. Kunci (is_true) dan explanation tidak pernah
-- terkirim lewat PostgREST. Teks pernyataan diambil lewat get_attempt().

-- attempts & attempt_answers: baca milik sendiri (riwayat). Tulisan lewat RPC.
create policy attempts_select_own on attempts
  for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy attempt_answers_select_own on attempt_answers
  for select to authenticated
  using (
    (select auth.uid()) is not null
    and exists (
      select 1 from attempts a
      where a.id = attempt_answers.attempt_id and a.user_id = (select auth.uid())
    )
  );

-- Pengaman tambahan: anon tidak perlu akses tabel sama sekali.
revoke all on all tables in schema public from anon;
grant select, insert, update on profiles to authenticated;
grant select on redemptions, subscriptions, materials, tryouts, questions to authenticated;
grant select on attempts, attempt_answers to authenticated;
-- redeem_codes, statements: hanya lewat fungsi security definer.
revoke all on redeem_codes, statements from authenticated;
