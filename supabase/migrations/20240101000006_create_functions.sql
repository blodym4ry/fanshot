-- ============================================================
-- generate_referral_code(): 8-char unique alphanumeric code
-- ============================================================

create or replace function public.generate_referral_code()
returns text as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- no I/O/0/1 to avoid confusion
  code text := '';
  i integer;
begin
  for i in 1..8 loop
    code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return code;
end;
$$ language plpgsql;

-- ============================================================
-- handle_new_user(): trigger on auth.users insert
-- Creates a public.users row with 1 free credit + referral code
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
declare
  v_referral_code text;
  v_display_name text;
begin
  -- Generate a unique referral code (retry on collision)
  loop
    v_referral_code := public.generate_referral_code();
    exit when not exists (
      select 1 from public.users where referral_code = v_referral_code
    );
  end loop;

  -- Use metadata display name or fall back to email prefix
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

  -- Record the free signup credit as a transaction
  insert into public.credit_transactions (user_id, amount, type)
  values (new.id, 1, 'free_signup');

  return new;
end;
$$ language plpgsql security definer;

-- Trigger: fire after a new auth user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================================
-- spend_credit(p_user_id, p_generation_id): deduct 1 credit
-- Prefers free credits first, then paid credits.
-- Records a credit_transaction and bumps total_generations.
-- Raises an exception if the user has no credits.
-- ============================================================

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
  -- Lock the user row to prevent race conditions
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

  -- Use free credit first
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

  -- Mark the generation
  update public.generations
     set is_free = v_is_free
   where id = p_generation_id;

  -- Record transaction
  insert into public.credit_transactions (user_id, amount, type)
  values (p_user_id, -1, 'generation_spend');
end;
$$ language plpgsql security definer;

-- ============================================================
-- add_referral_bonus(p_referrer_id): +1 paid credit to referrer
-- ============================================================

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
