create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  host_name text not null,
  title text not null,
  address text,
  location_name text not null,
  latitude double precision not null,
  longitude double precision not null,
  crowd integer not null check (crowd > 0),
  details text,
  cluster_index integer,
  allotted_latitude double precision,
  allotted_longitude double precision,
  allotted_time text,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "Users can view their own events" on public.events;
create policy "Users can view their own events" on public.events
  for select using (auth.uid() = user_id);

-- Safe to run for an existing events table created before host/location fields existed.
alter table public.events add column if not exists host_name text;
alter table public.events add column if not exists location_name text;
