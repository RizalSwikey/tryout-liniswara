-- Skema inti. Semua tabel di schema public, RLS diaktifkan di migrasi berikutnya.
create extension if not exists pgcrypto;

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  created_at timestamptz not null default now()
);

create table redeem_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  duration_days integer not null check (duration_days > 0),
  max_uses integer not null default 1 check (max_uses > 0),
  used_count integer not null default 0 check (used_count >= 0),
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  code_id uuid not null references redeem_codes (id) on delete restrict,
  redeemed_at timestamptz not null default now(),
  unique (user_id, code_id)
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index subscriptions_user_ends_idx on subscriptions (user_id, ends_at desc);

create table materials (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  youtube_id text not null,
  position integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table tryouts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  tryout_id uuid not null references tryouts (id) on delete cascade,
  position integer not null,
  stimulus text not null,
  unique (tryout_id, position)
);

create table statements (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions (id) on delete cascade,
  position integer not null,
  text text not null,
  is_true boolean not null,
  explanation text not null,
  unique (question_id, position)
);

create table attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tryout_id uuid not null references tryouts (id) on delete cascade,
  started_at timestamptz not null default now(),
  deadline_at timestamptz not null,
  submitted_at timestamptz,
  score integer,
  created_at timestamptz not null default now()
);
create index attempts_user_idx on attempts (user_id, started_at desc);

create table attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references attempts (id) on delete cascade,
  statement_id uuid not null references statements (id) on delete cascade,
  answer boolean not null,
  answered_at timestamptz not null default now(),
  unique (attempt_id, statement_id)
);
