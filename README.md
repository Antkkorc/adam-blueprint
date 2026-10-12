# Adam Blueprint

Adam Blueprint is a Botswana real-estate platform for discovering homes, land, rentals, and commercial property. It brings public listings, community rental submissions, property enquiries, saved listings, and direct WhatsApp contact into one simple experience.

The site is designed around how people search for property locally: browse by purpose and location, compare suitable listings, view photos and house plans, and contact an agent quickly.

## What the platform provides

- Browse verified properties for sale and available rentals.
- Search and filter listings by location, property type, price, and key features.
- View listing galleries, photo descriptions, amenities, coordinates, and house plans where available.
- Compare up to three properties side by side.
- Save properties for later when signed in.
- Contact the team through enquiry forms or WhatsApp.
- Submit a rental or property listing for administrative review.
- Leave a review as a signed-in customer; approved reviews appear at the bottom of the homepage.
- Manage listings, submissions, enquiries, reviews, and publication status from the protected admin area.
- Use the optional property assistant for Botswana-focused search guidance.

## Technology

- Next.js and React
- TypeScript
- Tailwind CSS
- Supabase for authentication, database, storage, and row-level security
- Upstash Redis for shared production rate limiting
- Google Gemini for the optional property assistant
- OpenStreetMap and Nominatim for map display and occasional geocoding

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful validation commands:

```bash
npm run lint
npm run build
```

## Environment variables

Create a `.env.local` file with the values for your Supabase and production services:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_EMAIL=...
ADMIN_USER_ID=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
GEMINI_API_KEY=...
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for the application to connect to Supabase. The service-role key is server-only and must never be exposed to browser code.

Admin access is granted through the authenticated Supabase account matching `ADMIN_EMAIL` or `ADMIN_USER_ID`. Set at least one of these values in the deployment environment. The application fails closed when administrator configuration is missing or does not match.

Upstash credentials enable a shared rate limiter across production instances. The Gemini key enables the optional assistant; the rest of the site remains usable when that feature is not configured.

## Supabase setup

The application uses Supabase tables for:

- `properties`
- `tenant_rentals`
- `rental_submissions`
- `property_submissions`
- `reviews`
- `notifications`
- `saved_properties`
- `enquiries`

It also uses the `property-images`, `rental-images`, and `property-submissions` storage buckets. Apply the migrations in `supabase/migrations` to the target Supabase project and review the associated row-level security and storage policies before opening the site to users.

The review workflow requires:

```text
supabase/migrations/20261007220000_add_reviews.sql
```

Rental and property submission workflows use the migrations documented in the `supabase/migrations` directory. Run them in timestamp order when setting up a new environment.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage with search, featured listings, rentals, and approved reviews |
| `/buy` | Search properties for sale |
| `/rent` | Browse available rentals |
| `/students` | Browse student-friendly rentals |
| `/sell` | Submit a property or rental listing for review |
| `/contact` | Contact the Adam Blueprint team |
| `/saved` | View saved properties when signed in |
| `/compare` | Compare selected properties |
| `/notifications` | View submission decisions when signed in |
| `/admin` | Protected administration dashboard |
| `/admin/inbox` | Review property submissions and enquiries |
| `/admin/rentals` | Review community rental submissions |
| `/admin/listings` | Manage published listings and listing history |
| `/admin/reviews` | Approve, reject, or delete customer reviews |

## Listing and review workflows

Property owners can submit a listing with optional photos, a house plan, and a pinned location. Submissions remain private until an administrator approves them. Approved listings become available through the public search experience, while submitters receive the decision in their notifications.

Community rental submissions follow the same review process. Administrators can publish verified rentals, update availability, and remove listings when necessary.

Reviews are limited to regular signed-in users. Every review starts as pending, and administrators can approve, reject, or permanently delete it. Only approved reviews are displayed publicly, and they are shown only at the end of the homepage.

## Production deployment

The repository is connected to Vercel for production deployment. Changes pushed to `main` trigger a new deployment. Before promoting a change:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Confirm production environment variables and Supabase migrations are up to date.
4. Verify the Vercel deployment is marked **Ready**.
5. Test the main public and admin workflows on the live site.

## Project structure

```text
src/app/             Next.js pages and API routes
src/components/      Shared UI and workflow components
src/lib/             Supabase, admin, branding, and utility helpers
src/context/         Authentication, theme, and comparison state
supabase/migrations/ Database schema, policies, and workflow changes
public/              Static assets
```

## Contact

Adam Blueprint is a Botswana-focused property service. For live-site enquiries, use the contact details and WhatsApp links provided on the website.
