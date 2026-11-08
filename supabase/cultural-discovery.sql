-- Run in the Supabase SQL editor after the existing project schema.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'visitor' check (role in ('visitor','contributor','curator','admin')),
  display_name text,
  created_at timestamptz not null default now()
);
create table if not exists public.cultural_listings (
  id uuid primary key default gen_random_uuid(),
  contributor_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  location text not null,
  description text not null,
  date date,
  start_time time,
  end_time time,
  venue text,
  cultural_significance text,
  organiser text,
  source_url text not null,
  image_url text,
  contact text,
  status text not null default 'pending' check(status in ('pending','approved','rejected','needs_correction')),
  moderator_id uuid references auth.users(id),
  moderation_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.moderation_records (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.cultural_listings(id) on delete cascade,
  moderator_id uuid not null references auth.users(id),
  action text not null check(action in ('approved','rejected','needs_correction')),
  note text,
  created_at timestamptz not null default now()
);
create table if not exists public.visitor_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination text not null,
  travel_start date,
  duration_days integer not null default 1 check(duration_days between 1 and 60),
  interests jsonb not null default '[]'::jsonb,
  quiz_answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.saved_itineraries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination text not null,
  travel_start date,
  duration_days integer not null default 1,
  listing_ids uuid[] not null default '{}',
  schedule jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.cultural_gallery (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.cultural_listings(id) on delete set null,
  image_url text not null,
  caption text not null,
  location text,
  activity text,
  captured_on date,
  art_form text,
  contributor_credit text,
  source_url text not null,
  status text not null default 'pending' check(status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.cultural_listings enable row level security;
alter table public.moderation_records enable row level security;
alter table public.visitor_preferences enable row level security;
alter table public.saved_itineraries enable row level security;
alter table public.cultural_gallery enable row level security;
-- Public clients can only read curator-approved records. Service-role API routes enforce curator permissions.
drop policy if exists "Public can read approved cultural listings" on public.cultural_listings;
create policy "Public can read approved cultural listings" on public.cultural_listings for select using(status='approved');
drop policy if exists "Contributors can read own submissions" on public.cultural_listings;
create policy "Contributors can read own submissions" on public.cultural_listings for select using(auth.uid()=contributor_id);
drop policy if exists "Contributors can submit own pending listings" on public.cultural_listings;
create policy "Contributors can submit own pending listings" on public.cultural_listings
  for insert to authenticated with check(auth.uid()=contributor_id and status='pending');
drop policy if exists "Users manage own profile" on public.profiles;
create policy "Users manage own profile" on public.profiles for select using(auth.uid()=id);
drop policy if exists "Users manage own preferences" on public.visitor_preferences;
create policy "Users manage own preferences" on public.visitor_preferences for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
drop policy if exists "Users manage own itineraries" on public.saved_itineraries;
create policy "Users manage own itineraries" on public.saved_itineraries for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
drop policy if exists "Public can read approved gallery" on public.cultural_gallery;
create policy "Public can read approved gallery" on public.cultural_gallery for select using(status='approved');
-- Assign curator/admin roles only from a trusted SQL editor after confirming the account UUID:
-- update public.profiles set role='curator' where id='<AUTH_USER_UUID>';
-- Create a profile row for a new account (or add an auth.users trigger) before assigning a role.

-- Automatically provision a least-privilege visitor profile for each new account.
create or replace function public.handle_new_cultural_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, role) values(new.id, 'visitor') on conflict(id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created_cultural_profile on auth.users;
create trigger on_auth_user_created_cultural_profile
after insert on auth.users for each row execute procedure public.handle_new_cultural_user();

-- Safe upgrades when applying this migration to an earlier MVP schema.
alter table public.cultural_listings add column if not exists image_url text;

create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  state text not null,
  district text not null,
  city text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(state,district,city)
);
create table if not exists public.saved_experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.cultural_listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id,listing_id)
);
alter table public.destinations enable row level security;
alter table public.saved_experiences enable row level security;
drop policy if exists "Public can read active destinations" on public.destinations;
create policy "Public can read active destinations" on public.destinations for select using(is_active=true);
drop policy if exists "Users manage own saved experiences" on public.saved_experiences;
create policy "Users manage own saved experiences" on public.saved_experiences for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
