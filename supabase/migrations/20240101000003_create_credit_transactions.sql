-- Create credit_transactions table
create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  amount integer not null,
  type text not null
    check (type in ('purchase', 'free_signup', 'referral_bonus', 'generation_spend')),
  stripe_payment_id text,
  package_name text,
  created_at timestamptz not null default now()
);

-- Index for user transaction history
create index idx_credit_transactions_user_id on public.credit_transactions(user_id);
create index idx_credit_transactions_type on public.credit_transactions(type);
