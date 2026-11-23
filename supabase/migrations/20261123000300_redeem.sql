-- RPC: redeem_code(text)
-- Satu transaksi: validasi kode, catat redemption, naikkan used_count, buat/perpanjang langganan.
-- Kunci baris redeem_codes dengan for update -> dua permintaan bersamaan diserialkan,
-- sehingga max_uses tidak bisa dilampaui.

create function public.redeem_code(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := (select auth.uid());
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g'));
  v_row redeem_codes%rowtype;
  v_ends timestamptz;
  v_base timestamptz;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if v_code = '' then
    raise exception 'CODE_NOT_FOUND';
  end if;

  select * into v_row
  from redeem_codes rc
  where rc.code = v_code
  for update;

  if not found then
    raise exception 'CODE_NOT_FOUND';
  end if;

  if not v_row.is_active then
    raise exception 'CODE_INACTIVE';
  end if;

  if v_row.expires_at is not null and v_row.expires_at <= now() then
    raise exception 'CODE_EXPIRED';
  end if;

  if exists (select 1 from redemptions r where r.user_id = v_user and r.code_id = v_row.id) then
    raise exception 'CODE_ALREADY_USED';
  end if;

  if v_row.used_count >= v_row.max_uses then
    raise exception 'CODE_EXHAUSTED';
  end if;

  insert into redemptions (user_id, code_id) values (v_user, v_row.id);

  update redeem_codes
  set used_count = used_count + 1
  where id = v_row.id;

  -- Perpanjang dari ends_at yang masih aktif, kalau tidak mulai dari sekarang.
  select max(s.ends_at) into v_base
  from subscriptions s
  where s.user_id = v_user and s.ends_at > now();

  v_base := coalesce(v_base, now());
  v_ends := v_base + make_interval(days => v_row.duration_days);

  insert into subscriptions (user_id, starts_at, ends_at)
  values (v_user, now(), v_ends);

  return jsonb_build_object(
    'ends_at', v_ends,
    'duration_days', v_row.duration_days
  );
end;
$$;

revoke all on function public.redeem_code(text) from public, anon;
grant execute on function public.redeem_code(text) to authenticated;

-- Profil otomatis saat signup (auth.users insert). Nama dari metadata full_name.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
