-- Seed credit packages
insert into public.credit_packages (name, display_name, credits, price_usd, stripe_price_id)
values
  ('starter',   'Starter',   5,  2.99, 'price_starter_placeholder'),
  ('fan_pack',  'Fan Pack',  15, 6.99, 'price_fan_pack_placeholder'),
  ('super_fan', 'Super Fan', 50, 14.99, 'price_super_fan_placeholder');
