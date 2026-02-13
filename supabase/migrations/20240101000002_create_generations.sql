-- Create generations table
create table public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  input_image_url text not null,
  output_image_url text,
  scene_type text not null
    check (scene_type in (
      'stadium_pitch', 'locker_room', 'celebration',
      'corner_flag', 'tunnel', 'press_conference', 'trophy'
    )),
  player_style text not null
    check (player_style in (
      'striker', 'playmaker', 'goalkeeper', 'defender', 'young_talent'
    )),
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

-- Index for user generation lookups
create index idx_generations_user_id on public.generations(user_id);
create index idx_generations_status on public.generations(status);
create index idx_generations_created_at on public.generations(created_at desc);
