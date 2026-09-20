// File: C:\Users\anton\OneDrive\Documents\PROJECTS\adam-blueprint\src\app\rent\page.tsx
import { createClient } from "@/lib/supabase/server";
import TenantRentalCard, { TenantRental } from "@/components/TenantRentalCard";
import Link from "next/link";
import { getLocationSearch } from "@/lib/filters";

export const revalidate = 0; // Ensures fresh data on every request

interface RentPageProps {
  searchParams: Promise<{ location?: string }>;
}

export default async function RentPage({ searchParams }: RentPageProps) {
  const params = await searchParams;
  const location = getLocationSearch(params.location || "");
  const supabase = await createClient();
  let query = supabase.from("tenant_rentals").select("*");
  if (location) query = query.ilike("location", `%${location}%`);
  const { data: rentals, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rentals:", error.message);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Community Rentals</h1>
            <p className="text-slate-400 text-sm mt-1">
              Browse available rental spaces directly posted by tenants and owners.
            </p>
          </div>

          <form className="flex flex-col sm:flex-row gap-3" role="search">
            <label htmlFor="rental-location" className="sr-only">Search rental location</label>
            <input id="rental-location" name="location" defaultValue={location} type="search"
              placeholder="Search by location, e.g. Gaborone"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
            <button type="submit" className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-bold hover:bg-slate-700">Search rentals</button>
            {location && <Link href="/rent" className="rounded-xl px-4 py-3 text-sm text-slate-400 hover:text-white">Clear</Link>}
          </form>
          <Link
            href="/list-my-rental"
            className="py-3 px-5 bg-cyan-500 hover:bg-cyan-400 font-bold text-black rounded-xl text-sm transition"
          >
            + List Your Rental Space
          </Link>
        </div>

        {/* Listings Grid */}
        {!rentals || rentals.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-slate-400">No rental listings available right now.</p>
            <Link href="/list-my-rental" className="text-cyan-400 text-sm underline mt-2 inline-block">
              Be the first to list a space!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((rental: TenantRental) => (
              <TenantRentalCard key={rental.id} rental={rental} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}