-- Create users table (extends Supabase Auth)
create table public.users (
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

-- Index for referral lookups
create index idx_users_referral_code on public.users(referral_code);

-- Auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated_at
  before update on public.users
  for each row
  execute function public.set_updated_at();
