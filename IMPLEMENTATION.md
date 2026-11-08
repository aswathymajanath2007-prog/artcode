# LOKA — implementation notes

This transformation keeps the existing Next.js 15 / React 19 / Supabase / Leaflet stack and reuses the original bold editorial layouts, navigation patterns, CSS typography and gallery assets while replacing the Onam invitation product with a cultural discovery experience.

## Routes
- `/` — new LOKA homepage
- `/discover` — dependent state/union territory and district selectors, destination-filtered directory, interest quiz, recommendations, saved selections, draft itinerary and schedule-overlap checks when complete event date/time data exists
- `/contribute` — authenticated community listing submission (new records are always `pending`)
- `/curator` — authenticated curator moderation dashboard
- `/gallery` — cultural field notes featuring 11 attributed photographs from Indian states across the north, south, east, west, central and northeastern regions
- `/login` — Supabase email magic-link sign-in, linked from Community / Contribute for contributor submissions

Legacy `/create`, `/admin`, and `/allotted/[id]` routes redirect into the new product flow.

## Setup
1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for sign-in and contributor submissions. The server-only `SUPABASE_SERVICE_ROLE_KEY` is required for curator moderation, not contributor submissions. Restart the Next.js server after changing environment variables.
3. Run `supabase/events.sql` only if the legacy event table is still needed; run `supabase/cultural-discovery.sql` in the Supabase SQL editor for the new schema and RLS policies. If the cultural discovery schema is already installed, run `supabase/contributor-submissions.sql` to enable authenticated users to insert their own pending contributions.
4. Existing auth users need a profile row if they predate the profile trigger. Create one using their auth UUID, then assign curator access from the SQL editor, e.g. `insert into public.profiles(id,role) values ('AUTH-USER-UUID','curator') on conflict(id) do update set role='curator';`. Never expose the service-role key in client code.
5. Configure Supabase Auth redirect URLs for the local and deployed origins.

## Demo data and verification
`lib/cultural-data.js` preserves the 15 illustrative Kozhikode sample records and provides a reusable fallback generator for selected districts with fewer than six existing demo samples. Generated records cover crafts, folk music, performance, food, heritage and community culture, are labeled `Illustrative Demo Sample – Not Verified`, and contain no fabricated dates, timings, organisers, addresses or verified events. Curator-approved database listings are loaded separately and shown with an approval label.

The destination selectors use the state and district data from [KTBsomen/Indian-state-district-json](https://github.com/KTBsomen/Indian-state-district-json); its MIT license is retained in `lib/india-state-districts-LICENSE.txt`. Existing destination listings are retained and checked for duplicates before fallback records are added.

`/gallery` uses locally stored Creative Commons and CC0 photographs under `public/culture-gallery/`. State, creator, source and license information is displayed with each image. The original Kerala/Onam photographs remain in `public/onam-gallery/` but are no longer the gallery's only examples.

## Current MVP boundaries
- The quiz ranks by explicit interest/category matches and puts visitor-selected experiences first; it is transparent rules-based logic, not AI.
- Schedule overlap checks require real date, start time and end time. Incomplete schedules are flagged as uncheckable rather than assigned invented times.
- Travel-time optimisation and map rendering are not yet connected to the itinerary; the original Leaflet component/dependency is retained for a future verified map layer.
- Itinerary drafts are stored in browser localStorage in this MVP. The database includes `saved_itineraries` and `visitor_preferences` tables for authenticated persistence to be wired in next.
- Gallery assets inherited from the old project are Kerala-focused. Broader regional imagery must be contributed with consent, attribution and licence checks.
- The contributor form requires a Supabase-authenticated session and source URL. Its insert uses the contributor's JWT and is restricted by row-level security to that user's own pending submissions. Curator endpoints enforce roles server-side using the `profiles.role` field and service-role access remains server-only.
