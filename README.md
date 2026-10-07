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
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
GEMINI_API_KEY=...
```

**Supabase keys**
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Required for all Supabase client and server operations.
- `SUPABASE_SERVICE_ROLE_KEY`: Required for the server-only rental review workflow. It bypasses RLS only after `requireAdmin()` has authenticated the administrator and must never be exposed to the browser.

**Admin access**
- `ADMIN_EMAIL`: Required for admin routes to work. Admin access fails closed if it is missing or does not match the authenticated user's email. Alternatively, set `ADMIN_USER_ID` to the authenticated Supabase user's UUID. Find it in Supabase under Authentication > Users.

**Production features**
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: Enable the shared production API rate limiter. Add both to Vercel's Production environment so limits are shared across serverless instances. If they are unavailable, the middleware uses a per-instance fallback limiter and logs the degraded protection state.
- `GEMINI_API_KEY`: Enables the AI assistant floating widget. It is a server-only variable that the `/api/ai/chat` route uses to communicate with Google's Gemini API. Never expose this key in browser code or client bundles. Add the secret to both Vercel **Preview** and **Production** environments, then redeploy each environment after changing it. Obtain a free key from [Google AI Studio](https://aistudio.google.com). If it is not set, the assistant widget displays a "not configured" message.

## Supabase requirements

The application expects Supabase tables for `properties`, `tenant_rentals`, `rental_submissions`, `property_submissions`, `notifications`, `saved_properties`, and `enquiries`, plus the `property-images`, `rental-images`, and `property-submissions` storage buckets. Public listing reads and authenticated writes must be covered by Row Level Security policies appropriate to your deployment.

If an existing `tenant_rentals` table was created with only some rental fields, run the complete schema SQL in `supabase/migrations/20260920133500_complete_tenant_rentals_schema.sql` in Supabase SQL Editor before submitting new rental listings. It supports the existing `tenant_name`/`contact_number` fields and maps the form description into both `description` and the legacy required `info` field. It is safe to run after the earlier migrations.

Run `supabase/migrations/20260920170000_add_rental_review_workflow.sql` after that schema migration. Authenticated users submit rental details and photos into `rental_submissions` for review; those submissions do not appear on `/rent`. Only an administrator can publish a verified listing through `/admin/add-rental`, which inserts the final record into `tenant_rentals`.
Pending submissions can be reviewed at `/admin/rentals`; approval publishes the listing and records review metadata, while rejection only records the review decision.
Administrators can manage published properties and tenant rentals at `/admin/listings`. Properties support `Available`, `Sold`, and `Rented`; tenant rentals support `Available` and `Rented`. Apply `20260920180000_add_rental_listing_status.sql` to add the rental status column and prevent regular users from mutating published rentals.

Property owners can submit a sell or rent-out request at `/sell`. The form accepts optional property photos, an optional house/floor plan, and optional pinned coordinates. These requests remain private until an administrator reviews them at `/admin/inbox`; approval creates an `Available` property listing and rejection records the review decision. Authenticated submitters receive approval or rejection updates at `/notifications`. Apply `20260920195000_property_submission_workflow.sql` after the rental migrations, followed by `20260920211500_add_property_submission_coordinates.sql` if the property workflow migration was already applied.
Deleted listings are archived in `listing_archives` before removal, and the admin listing page exposes a Deleted/history tab. The deletion endpoint also attempts to remove image and floor-plan objects referenced by the listing.
Contact enquiries in `/admin/inbox` can be marked as read. Apply `20260920210000_add_enquiry_read_state.sql` before using that action.
Apply `20260922210000_harden_storage_policies.sql` to remove anonymous storage uploads and restrict submitted files to each authenticated user's own folder. The public read behavior is retained for listing media that the site intentionally displays.

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
- `/compare` - side-by-side property comparison (select up to 3 properties from any listing page)
- `/admin` - admin-only property management
- `/admin/listings` - admin-only listing status and deletion management

## Key features

**Listing visibility tiers**
When publishing a property, administrators can assign a **promotion tier**: Standard, Featured, or Premium.
- **Standard**: Regular visibility
- **Featured**: Cyan badge on property cards, higher ranking in search
- **Premium**: Amber badge on property cards, highest search ranking and homepage prominence

Tiers are stored in the `promotion_tier` column and map to the existing `featured` boolean for backward compatibility.

**Property comparison**
Users can select up to 3 properties from the homepage, `/buy`, or saved listings using the blue "Compare" button on each card. A floating tray appears at the bottom showing the count and a "Compare" link.

The `/compare` page displays a side-by-side table of core attributes:
- Price, location, type, bedrooms, bathrooms, parking
- Building and land sizes, tenure, WiFi connectivity, amenities
- Rows with differing values are highlighted in cyan to help users spot key differences
- Missing or unspecified attributes show a red X for clarity

**AI assistant (floating widget)**
A cyan bot icon appears in the bottom-right corner of every page. Click it to open an interactive chat window with fullscreen toggle.
The assistant:
- Helps users understand the Botswana real-estate market
- Offers guidance on comparing homes and finding property
- Turns supported property requests into filtered `/buy` links that open in a new tab, so users see only matching listings
- Provides separate links to live matching properties when available
- Operates over up to 8 prior messages for conversational context
- Validates input to prevent abuse (max 1200 chars per message)
- Returns a clear error if `GEMINI_API_KEY` is not configured

The server-only `/api/ai/chat` route ensures the API key never appears in client bundles or logs.
