-- Uji policy + RPC di Postgres biasa (bukan Supabase CLI). Jalankan lewat scripts/db-test.sh.
-- Setiap pemeriksaan memakai data nyata; tidak ada asumsi.

create or replace function pg_temp.expect_error(stmt text, expected text)
returns void language plpgsql as $$
begin
  begin
    execute stmt;
  exception when others then
    if sqlerrm <> expected then
      raise exception 'GAGAL: ingin "%" tapi dapat "%" (%) untuk: %', expected, sqlerrm, sqlstate, stmt;
    end if;
    return;
  end;
  raise exception 'GAGAL: ingin error "%" tapi berhasil: %', expected, stmt;
end $$;

create or replace function pg_temp.expect_eq(actual anyelement, expected anyelement, label text)
returns void language plpgsql as $$
begin
  if actual is distinct from expected then
    raise exception 'GAGAL: % -> dapat %, harusnya %', label, actual, expected;
  end if;
  raise notice 'ok: %', label;
end $$;

-- ---------- data dasar (sebagai owner, bypass RLS) ----------
insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-1111-1111-111111111111', 'ani@example.com', '{"full_name":"Ani"}'),
  ('22222222-2222-2222-2222-222222222222', 'budi@example.com', '{"full_name":"Budi"}');

select pg_temp.expect_eq((select full_name from profiles where id = '11111111-1111-1111-1111-111111111111'), 'Ani', 'trigger signup membuat profil');

insert into redeem_codes (code, duration_days, max_uses, expires_at, is_active) values
  ('AKTIF30HARI1', 30, 100, null, true),
  ('SEKALIPAKAI1', 30, 1, null, true),
  ('KEDALUWARSA1', 30, 100, now() - interval '1 day', true),
  ('NONAKTIF1234', 30, 100, null, false),
  ('TAMBAH7HARI01', 7, 100, null, true);

insert into tryouts (id, title, duration_minutes, is_published)
values ('33333333-3333-3333-3333-333333333333', 'Tryout Uji', 15, true);

insert into questions (id, tryout_id, position, stimulus) values
  ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 1, 'Stimulus uji');

insert into statements (id, question_id, position, text, is_true, explanation) values
  ('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444444', 1, 'Pernyataan benar', true, 'Karena begitu.'),
  ('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444444', 2, 'Pernyataan salah', false, 'Karena tidak.'),
  ('55555555-5555-5555-5555-555555555553', '44444444-4444-4444-4444-444444444444', 3, 'Pernyataan benar dua', true, 'Karena iya.');

insert into materials (slug, title, description, youtube_id, position, is_published) values
  ('materi-uji', 'Materi Uji', 'Deskripsi', 'dQw4w9WgXcQ', 1, true),
  ('materi-draf', 'Materi Draf', 'Deskripsi', 'dQw4w9WgXcQ', 2, false);

-- ---------- ANON ----------
set role anon;
select pg_temp.expect_error('select count(*) from profiles', 'permission denied for table profiles');
select pg_temp.expect_error('select count(*) from redeem_codes', 'permission denied for table redeem_codes');
select pg_temp.expect_error('select count(*) from materials', 'permission denied for table materials');
reset role;

-- ---------- USER A, tanpa langganan ----------
set role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', false);

select pg_temp.expect_eq((select count(*) from profiles), 1::bigint, 'A lihat profil sendiri');
select pg_temp.expect_eq((select count(*) from profiles where id = '22222222-2222-2222-2222-222222222222'), 0::bigint, 'A tidak lihat profil B');
select pg_temp.expect_error('select count(*) from redeem_codes', 'permission denied for table redeem_codes');
select pg_temp.expect_error('select count(*) from statements', 'permission denied for table statements');
select pg_temp.expect_eq((select count(*) from materials), 0::bigint, 'tanpa langganan materi kosong');
select pg_temp.expect_eq((select count(*) from tryouts), 0::bigint, 'tanpa langganan tryout kosong');
select pg_temp.expect_error('select public.start_attempt(''33333333-3333-3333-3333-333333333333'')::text', 'SUBSCRIPTION_REQUIRED');
select pg_temp.expect_error('select public.redeem_code(''TIDAKADAKODE'')::text', 'CODE_NOT_FOUND');
select pg_temp.expect_error('select public.redeem_code(''KEDALUWARSA1'')::text', 'CODE_EXPIRED');
select pg_temp.expect_error('select public.redeem_code(''NONAKTIF1234'')::text', 'CODE_INACTIVE');

select public.redeem_code('AKTIF30HARI1');
select pg_temp.expect_eq((select count(*) from subscriptions where ends_at > now()), 1::bigint, 'A punya 1 langganan aktif');
select pg_temp.expect_eq((select count(*) from materials), 1::bigint, 'materi terbit terlihat setelah redeem');
select pg_temp.expect_eq((select count(*) from materials where is_published = false), 0::bigint, 'materi draf tetap tersembunyi');
select pg_temp.expect_eq((select count(*) from tryouts), 1::bigint, 'tryout terlihat setelah redeem');

select pg_temp.expect_error('select public.redeem_code(''AKTIF30HARI1'')::text', 'CODE_ALREADY_USED');

select public.redeem_code('TAMBAH7HARI01');
select pg_temp.expect_eq(
  (select round(extract(epoch from (max(ends_at) - now())) / 86400) from subscriptions),
  37::numeric,
  'langganan diperpanjang, bukan ditimpa');

-- ---------- USER B: max_uses ----------
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', false);
select public.redeem_code('SEKALIPAKAI1');
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', false);
select pg_temp.expect_error('select public.redeem_code(''SEKALIPAKAI1'')::text', 'CODE_EXHAUSTED');

-- ---------- tryout ----------
select public.start_attempt('33333333-3333-3333-3333-333333333333')::text as payload \gset

select pg_temp.expect_eq((:'payload'::jsonb ->> 'status'), 'active', 'attempt aktif');
select pg_temp.expect_eq(
  position('is_true' in :'payload'),
  0,
  'payload aktif tanpa is_true');
select pg_temp.expect_eq(
  position('explanation' in :'payload'),
  0,
  'payload aktif tanpa explanation');
select pg_temp.expect_eq(
  jsonb_array_length(:'payload'::jsonb -> 'questions'), 1, 'payload berisi soal');
select pg_temp.expect_eq(
  (select count(*) from jsonb_path_query(:'payload'::jsonb, '$.questions[0].statements[*].text')), 3::bigint, 'teks pernyataan tersedia');

select public.save_answer((:'payload'::jsonb ->> 'id')::uuid, '55555555-5555-5555-5555-555555555551', true);
select public.save_answer((:'payload'::jsonb ->> 'id')::uuid, '55555555-5555-5555-5555-555555555552', true);
select public.save_answer((:'payload'::jsonb ->> 'id')::uuid, '55555555-5555-5555-5555-555555555553', false);

select public.submit_attempt((:'payload'::jsonb ->> 'id')::uuid)::text as hasil \gset
select pg_temp.expect_eq((:'hasil'::jsonb ->> 'score')::int, 1, 'skor dihitung server = 1');
select pg_temp.expect_eq((:'hasil'::jsonb ->> 'total')::int, 3, 'total pernyataan = 3');

select pg_temp.expect_error(
  format('select public.save_answer(%L::uuid, %L::uuid, true)::text', :'payload'::jsonb ->> 'id', '55555555-5555-5555-5555-555555555551'),
  'ATTEMPT_SUBMITTED');
select pg_temp.expect_error(
  format('select public.submit_attempt(%L::uuid)::text', :'payload'::jsonb ->> 'id'),
  'ATTEMPT_SUBMITTED');

select pg_temp.expect_eq(
  (select count(*) from jsonb_array_elements(public.get_attempt((:'payload'::jsonb ->> 'id')::uuid) -> 'questions') q
     cross join jsonb_array_elements(q -> 'statements') s
     cross join jsonb_object_keys(s) k
     where k in ('is_true', 'explanation')),
  6::bigint,
  'setelah submit is_true + explanation tersedia');

-- User B tidak bisa membaca attempt A
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', false);
select pg_temp.expect_error(
  format('select public.get_attempt(%L::uuid)::text', :'payload'::jsonb ->> 'id'),
  'ATTEMPT_NOT_FOUND');

-- ---------- deadline ----------
reset role;
update attempts set deadline_at = now() - interval '1 minute' where id = (:'payload'::jsonb ->> 'id')::uuid;
set role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', false);

-- attempt baru, deadline dilewati -> auto-finalisasi saat diambil
reset role;
select public.start_attempt('33333333-3333-3333-3333-333333333333')::text as baru \gset
update attempts set deadline_at = now() - interval '1 minute' where id = (:'baru'::jsonb ->> 'id')::uuid;
set role authenticated;
select public.get_attempt((:'baru'::jsonb ->> 'id')::uuid)::text as lewat \gset
select pg_temp.expect_eq((:'lewat'::jsonb ->> 'status'), 'submitted', 'attempt lewat deadline auto-finalisasi');
select pg_temp.expect_eq((:'lewat'::jsonb ->> 'score')::int, 0, 'attempt lewat deadline skor 0');
select pg_temp.expect_error(
  format('select public.submit_attempt(%L::uuid)::text', :'baru'::jsonb ->> 'id'),
  'ATTEMPT_SUBMITTED');

reset role;
-- material pembaca anon tidak bisa menyentuh attempt sama sekali
set role anon;
select pg_temp.expect_error('select count(*) from attempts', 'permission denied for table attempts');
reset role;

select 'SEMUA UJI DATABASE LULUS' as hasil_akhir;
