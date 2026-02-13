-- Create credit_packages table
create table public.credit_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_name text not null,
  credits integer not null,
  price_usd decimal(10, 2) not null,
  stripe_price_id text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
