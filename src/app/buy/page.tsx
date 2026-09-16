import { createClient } from "@/lib/supabase/server";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";

export const revalidate = 0;

interface BuyPageProps {
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    tenure?: string;
    wifi?: string;
    pool?: string;
    garage?: string;
  }>;
}

export default async function BuyPage({ searchParams }: BuyPageProps) {
  const params = await searchParams;
  const minPrice = params.minPrice ? Number(params.minPrice) : 0;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : Infinity;
  const selectedTenure = params.tenure || "";
  const wifiType = params.wifi || "";
  const hasPool = params.pool === "true";
  const hasGarage = params.garage === "true";

  const supabase = await createClient();

  let query = supabase.from("properties").select("*");

  if (selectedTenure) query = query.eq("tenure_type", selectedTenure);
  if (minPrice > 0) query = query.gte("price", minPrice);
  if (maxPrice < Infinity && maxPrice > 0) query = query.lte("price", maxPrice);
  if (hasPool) query = query.eq("pool", true);
  if (hasGarage) query = query.eq("garage", true);
  if (wifiType) query = query.eq("wifi_type", wifiType);

  const { data: properties, error } = await query;

  if (error) {
    console.error("Error fetching filtered properties:", error.message);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold">Properties for Sale</h1>
          <p className="text-slate-400 text-sm mt-1">Filter listings across Botswana by budget, land tenure, and features.</p>
        </div>

        {/* Filter Bar */}
        <form className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Min Price (BWP)</label>
            <input
              type="number"
              name="minPrice"
              defaultValue={params.minPrice || ""}
              placeholder="e.g. 500000"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Max Price (BWP)</label>
            <input
              type="number"
              name="maxPrice"
              defaultValue={params.maxPrice || ""}
              placeholder="e.g. 2500000"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Land Tenure</label>
            <select
              name="tenure"
              defaultValue={selectedTenure}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="">All Tenures</option>
              <option value="Tribal">Tribal Land</option>
              <option value="State">State Land</option>
              <option value="Freehold">Freehold</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">WiFi Connectivity</label>
            <select
              name="wifi"
              defaultValue={wifiType}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="">Any Connectivity</option>
              <option value="fibre">Fibre WiFi</option>
              <option value="router">4G/5G Router WiFi</option>
            </select>
          </div>

          <div className="md:col-span-4 flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                <input type="checkbox" name="pool" value="true" defaultChecked={hasPool} className="rounded border-slate-800 bg-slate-950 text-cyan-500" />
                Swimming Pool
              </label>
              <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                <input type="checkbox" name="garage" value="true" defaultChecked={hasGarage} className="rounded border-slate-800 bg-slate-950 text-cyan-500" />
                Garage / Carport
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/buy" className="text-slate-400 hover:text-white px-3 py-2">Reset</Link>
              <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl transition-all">
                Apply Filters
              </button>
            </div>
          </div>
        </form>

        {/* Listings Display */}
        {!properties || properties.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm">No properties match your active filter setup.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}