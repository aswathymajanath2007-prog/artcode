-- Allow authenticated contributors to submit their own listings as pending.
alter table public.cultural_listings enable row level security;

drop policy if exists "Contributors can submit own pending listings" on public.cultural_listings;
create policy "Contributors can submit own pending listings"
on public.cultural_listings
for insert
to authenticated
with check (auth.uid() = contributor_id and status = 'pending');
