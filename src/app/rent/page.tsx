// File: C:\Users\anton\OneDrive\Documents\PROJECTS\adam-blueprint\src\app\rent\page.tsx
import { createClient } from "@/lib/supabase/server";
import TenantRentalCard, { TenantRental } from "@/components/TenantRentalCard";
import Link from "next/link";
import { getLocationSearch } from "@/lib/filters";

export const revalidate = 0; // Ensures fresh data on every request

interface RentPageProps {
  searchParams: Promise<{
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    minBeds?: string;
    minBaths?: string;
  }>;
}

export default async function RentPage({ searchParams }: RentPageProps) {
  const params = await searchParams;
  const location = getLocationSearch(params.location || "");
  const minPrice = Math.max(0, Number(params.minPrice) || 0);
  const maxPrice = Math.max(0, Number(params.maxPrice) || 0);
  const minBeds = Math.max(0, Number(params.minBeds) || 0);
  const minBaths = Math.max(0, Number(params.minBaths) || 0);
  const supabase = await createClient();
  let query = supabase.from("tenant_rentals").select("*");
  if (location) query = query.ilike("location", `%${location}%`);
  if (minPrice > 0) query = query.gte("price", minPrice);
  if (maxPrice > 0) query = query.lte("price", maxPrice);
  if (minBeds > 0) query = query.gte("bedrooms", minBeds);
  if (minBaths > 0) query = query.gte("bathrooms", minBaths);
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

          <form className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-5" role="search">
            <label htmlFor="rental-location" className="sr-only">Search rental location</label>
            <input id="rental-location" name="location" defaultValue={location} type="search"
              placeholder="Location, e.g. Gaborone"
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 lg:col-span-2" />
            <label htmlFor="rental-min-price" className="sr-only">Minimum monthly price</label>
            <input id="rental-min-price" name="minPrice" defaultValue={minPrice || ""} type="number" min="0"
              placeholder="Min price"
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
            <label htmlFor="rental-max-price" className="sr-only">Maximum monthly price</label>
            <input id="rental-max-price" name="maxPrice" defaultValue={maxPrice || ""} type="number" min="0"
              placeholder="Max price"
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
            <select name="minBeds" defaultValue={minBeds || ""} aria-label="Minimum bedrooms"
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500">
              <option value="">Any bedrooms</option>
              <option value="1">1+ bedroom</option>
              <option value="2">2+ bedrooms</option>
              <option value="3">3+ bedrooms</option>
              <option value="4">4+ bedrooms</option>
            </select>
            <select name="minBaths" defaultValue={minBaths || ""} aria-label="Minimum bathrooms"
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500">
              <option value="">Any bathrooms</option>
              <option value="1">1+ bathroom</option>
              <option value="2">2+ bathrooms</option>
              <option value="3">3+ bathrooms</option>
            </select>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-5">
              <button type="submit" className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-bold hover:bg-slate-700">Search rentals</button>
              {(location || minPrice || maxPrice || minBeds || minBaths) ? <Link href="/rent" className="rounded-xl px-4 py-3 text-sm text-slate-400 hover:text-white">Clear filters</Link> : null}
            </div>
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