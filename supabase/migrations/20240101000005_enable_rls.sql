-- Enable Row Level Security on all tables
alter table public.users enable row level security;
alter table public.generations enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.credit_packages enable row level security;

-- ============================================================
-- users: only own profile
-- ============================================================

create policy "users_select_own"
  on public.users for select
  using (auth.uid() = id);

create policy "users_update_own"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- generations: only own records
-- ============================================================

create policy "generations_select_own"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "generations_insert_own"
  on public.generations for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- credit_transactions: only own records (read-only for client)
-- ============================================================

create policy "credit_transactions_select_own"
  on public.credit_transactions for select
  using (auth.uid() = user_id);

-- ============================================================
-- credit_packages: everyone can read active packages
-- ============================================================

create policy "credit_packages_select_active"
  on public.credit_packages for select
  using (is_active = true);
