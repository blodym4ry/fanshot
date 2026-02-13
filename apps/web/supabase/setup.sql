-- ============================================================
-- FanShot — Complete Database Setup
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- 1. TABLES
-- ============================================================

-- Users table (extends Supabase Auth)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null,
  avatar_url text,
  free_credits integer not null default 1,
  paid_credits integer not null default 0,
  total_generations integer not null default 0,
  referred_by uuid references public.users(id) on delete set null,
  referral_code text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_users_referral_code on public.users(referral_code);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
  before update on public.users
  for each row
  execute function public.set_updated_at();

-- Generations table (scene_type is now free text for flexibility)
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  input_image_url text not null,
  output_image_url text,
  scene_type text not null,
  player_style text not null,
  team_color text,
  prompt_used text not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'failed')),
  quality text not null default 'standard'
    check (quality in ('standard', 'hd')),
  is_free boolean not null default false,
  processing_time_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists idx_generations_user_id on public.generations(user_id);
create index if not exists idx_generations_status on public.generations(status);
create index if not exists idx_generations_created_at on public.generations(created_at desc);

-- Credit transactions table
create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  amount integer not null,
  type text not null
    check (type in ('purchase', 'free_signup', 'referral_bonus', 'generation_spend')),
  stripe_payment_id text,
  package_name text,
  created_at timestamptz not null default now()
);

create index if not exists idx_credit_transactions_user_id on public.credit_transactions(user_id);
create index if not exists idx_credit_transactions_type on public.credit_transactions(type);

-- Credit packages table
create table if not exists public.credit_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_name text not null,
  credits integer not null,
  price_usd decimal(10, 2) not null,
  stripe_price_id text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================

alter table public.users enable row level security;
alter table public.generations enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.credit_packages enable row level security;

-- users: only own profile
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
  on public.users for select
  using (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- generations: only own records
drop policy if exists "generations_select_own" on public.generations;
create policy "generations_select_own"
  on public.generations for select
  using (auth.uid() = user_id);

drop policy if exists "generations_insert_own" on public.generations;
create policy "generations_insert_own"
  on public.generations for insert
  with check (auth.uid() = user_id);

-- credit_transactions: only own records (read-only for client)
drop policy if exists "credit_transactions_select_own" on public.credit_transactions;
create policy "credit_transactions_select_own"
  on public.credit_transactions for select
  using (auth.uid() = user_id);

-- credit_packages: everyone can read active packages
drop policy if exists "credit_packages_select_active" on public.credit_packages;
create policy "credit_packages_select_active"
  on public.credit_packages for select
  using (is_active = true);

-- ============================================================
-- 3. FUNCTIONS
-- ============================================================

-- Generate unique 8-char referral code
create or replace function public.generate_referral_code()
returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text := '';
  i integer;
begin
  for i in 1..8 loop
    code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return code;
end;
$$ language plpgsql;

-- Auto-create public.users row on auth signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_referral_code text;
  v_display_name text;
begin
  -- Generate unique referral code
  loop
    v_referral_code := public.generate_referral_code();
    exit when not exists (
      select 1 from public.users where referral_code = v_referral_code
    );
  end loop;

  v_display_name := coalesce(
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'full_name',
    split_part(new.email, '@', 1)
  );

  insert into public.users (id, email, display_name, avatar_url, referral_code)
  values (
    new.id,
    new.email,
    v_display_name,
    new.raw_user_meta_data ->> 'avatar_url',
    v_referral_code
  );

  -- Record free signup credit
  insert into public.credit_transactions (user_id, amount, type)
  values (new.id, 1, 'free_signup');

  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Spend 1 credit (free first, then paid)
create or replace function public.spend_credit(
  p_user_id uuid,
  p_generation_id uuid
)
returns void as $$
declare
  v_free integer;
  v_paid integer;
  v_is_free boolean;
begin
  select free_credits, paid_credits
    into v_free, v_paid
    from public.users
   where id = p_user_id
     for update;

  if v_free is null then
    raise exception 'User not found: %', p_user_id;
  end if;

  if v_free + v_paid < 1 then
    raise exception 'Insufficient credits for user: %', p_user_id;
  end if;

  if v_free > 0 then
    update public.users
       set free_credits = free_credits - 1,
           total_generations = total_generations + 1
     where id = p_user_id;
    v_is_free := true;
  else
    update public.users
       set paid_credits = paid_credits - 1,
           total_generations = total_generations + 1
     where id = p_user_id;
    v_is_free := false;
  end if;

  update public.generations
     set is_free = v_is_free
   where id = p_generation_id;

  insert into public.credit_transactions (user_id, amount, type)
  values (p_user_id, -1, 'generation_spend');
end;
$$ language plpgsql security definer;

-- Add referral bonus
create or replace function public.add_referral_bonus(
  p_referrer_id uuid
)
returns void as $$
begin
  update public.users
     set paid_credits = paid_credits + 1
   where id = p_referrer_id;

  if not found then
    raise exception 'Referrer not found: %', p_referrer_id;
  end if;

  insert into public.credit_transactions (user_id, amount, type)
  values (p_referrer_id, 1, 'referral_bonus');
end;
$$ language plpgsql security definer;

-- ============================================================
-- 4. SEED DATA
-- ============================================================

insert into public.credit_packages (name, display_name, credits, price_usd, stripe_price_id)
values
  ('starter',   'Starter',   5,  2.99, 'price_starter_placeholder'),
  ('fan_pack',  'Fan Pack',  15, 6.99, 'price_fan_pack_placeholder'),
  ('super_fan', 'Super Fan', 50, 14.99, 'price_super_fan_placeholder')
on conflict (name) do nothing;

-- ============================================================
-- 5. STORAGE BUCKETS
-- Run these one by one if the SQL above doesn't support
-- storage.create_bucket(). Otherwise, create buckets via
-- Supabase Dashboard > Storage.
--
-- Bucket 1: "selfies" (private)
--   - Max file size: 10MB
--   - Allowed MIME types: image/*
--   - RLS: only uploading user can access
--
-- Bucket 2: "generated" (public)
--   - Max file size: 10MB
--   - Allowed MIME types: image/*
--   - Public read access
-- ============================================================

-- Create selfies bucket (private)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('selfies', 'selfies', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/heic'])
on conflict (id) do nothing;

-- Create generated bucket (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('generated', 'generated', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Storage RLS policies for selfies bucket
drop policy if exists "selfies_insert_own" on storage.objects;
create policy "selfies_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'selfies'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "selfies_select_own" on storage.objects;
create policy "selfies_select_own"
  on storage.objects for select
  using (
    bucket_id = 'selfies'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "selfies_delete_own" on storage.objects;
create policy "selfies_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'selfies'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage RLS policies for generated bucket (public read)
drop policy if exists "generated_insert_own" on storage.objects;
create policy "generated_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'generated'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "generated_select_public" on storage.objects;
create policy "generated_select_public"
  on storage.objects for select
  using (bucket_id = 'generated');

-- ============================================================
-- DONE! Your FanShot database is ready.
-- ============================================================
