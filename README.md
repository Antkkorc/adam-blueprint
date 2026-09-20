# Adam Blueprint

Adam Blueprint is a Botswana-focused real-estate website for browsing property listings, finding community rentals, saving properties, and contacting the team through WhatsApp or enquiry forms.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Required environment variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ADMIN_EMAIL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`ADMIN_EMAIL` is required for admin routes to work. Admin access fails closed if it is missing or does not match the authenticated user's email.
Alternatively, set `ADMIN_USER_ID` to the authenticated Supabase user's UUID. Find it in Supabase under Authentication > Users. Do not use the secret API key in this file or in browser code.
`SUPABASE_SERVICE_ROLE_KEY` is required for the server-only rental review workflow. It bypasses RLS only after `requireAdmin()` has authenticated the administrator and must never be exposed to the browser.

## Supabase requirements

The application expects Supabase tables for `properties`, `tenant_rentals`, `rental_submissions`, `saved_properties`, and `enquiries`, plus the `property-images` and `rental-images` storage buckets. Public listing reads and authenticated writes must be covered by Row Level Security policies appropriate to your deployment.

If an existing `tenant_rentals` table was created with only some rental fields, run the complete schema SQL in `supabase/migrations/20260920133500_complete_tenant_rentals_schema.sql` in Supabase SQL Editor before submitting new rental listings. It supports the existing `tenant_name`/`contact_number` fields and maps the form description into both `description` and the legacy required `info` field. It is safe to run after the earlier migrations.

Run `supabase/migrations/20260920170000_add_rental_review_workflow.sql` after that schema migration. Authenticated users submit rental details and photos into `rental_submissions` for review; those submissions do not appear on `/rent`. Only an administrator can publish a verified listing through `/admin/add-rental`, which inserts the final record into `tenant_rentals`.
Pending submissions can be reviewed at `/admin/rentals`; approval publishes the listing and records review metadata, while rejection only records the review decision.
Administrators can manage published properties and tenant rentals at `/admin/listings`. Properties support `Available`, `Sold`, and `Rented`; tenant rentals support `Available` and `Rented`. Apply `20260920180000_add_rental_listing_status.sql` to add the rental status column and prevent regular users from mutating published rentals.

Public property results are expected to use `intent = 'buy'` or `intent = 'rent'` and `status = 'active'`. Review existing records before enabling the production site so older status values are migrated if necessary.

## Free map and image features

The admin property form uses OpenStreetMap's free Nominatim geocoder to turn a Botswana city/suburb/address into coordinates. The detail page displays the exact pin using OpenStreetMap embeds and links to the full map. This avoids a Google Maps API key and billing requirement. Nominatim is rate-limited, so use it for occasional admin lookups rather than bulk geocoding.

Each property photo can be assigned a category and a short description such as `Front / Outside — Main entrance` or `Backyard — Pool and garden`. These labels are stored with the existing `image_labels` field and shown in the property photo tour.

Location names are based on Botswana local-authority references and common real-estate area labels. Blocks and suburbs are useful search labels but are not always formal municipal wards; verify legal property details against the deed or municipal records.

## Validation

```bash
npm run lint
npm run build
```

## Main routes

- `/` - search and featured properties
- `/buy` - searchable sale listings
- `/rent` - searchable community rentals
- `/sell` - valuation and listing enquiry
- `/contact` - general contact form
- `/saved` - authenticated saved properties
- `/admin` - admin-only property management
- `/admin/listings` - admin-only listing status and deletion management
