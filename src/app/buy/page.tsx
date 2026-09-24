import { createClient } from "@/lib/supabase/server";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";
import { getLocationSearch } from "@/lib/filters";
import { PUBLIC_PROPERTY_COLUMNS } from "@/lib/supabase/public-columns";

export const revalidate = 0;

interface BuyPageProps {
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    tenure?: string;
    wifi?: string;
    pool?: string;
    garage?: string;
    location?: string;
    type?: string;
    minBeds?: string;
    minBaths?: string;
    minParking?: string;
    minBuildingSqm?: string;
    minLandSqm?: string;
    amenity?: string | string[];
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
  const location = getLocationSearch(params.location || "");
  const propertyType = params.type || "";
  const minBeds = Math.max(0, Number(params.minBeds) || 0);
  const minBaths = Math.max(0, Number(params.minBaths) || 0);
  const minParking = Math.max(0, Number(params.minParking) || 0);
  const minBuildingSqm = Math.max(0, Number(params.minBuildingSqm) || 0);
  const minLandSqm = Math.max(0, Number(params.minLandSqm) || 0);
  const selectedAmenities = Array.isArray(params.amenity)
    ? params.amenity
    : params.amenity ? [params.amenity] : [];

  const supabase = await createClient();

  let query = supabase.from("properties").select(PUBLIC_PROPERTY_COLUMNS);

  query = query.eq("intent", "buy").in("status", ["active", "Available"]);
  if (location) {
    query = query.or(
      `location.ilike.%${location}%,city.ilike.%${location}%,suburb.ilike.%${location}%`
    );
  }
  if (propertyType && propertyType !== "All Types") query = query.eq("type", propertyType);
  if (selectedTenure) query = query.eq("tenure", selectedTenure);
  if (minPrice > 0) query = query.gte("price", minPrice);
  if (maxPrice < Infinity && maxPrice > 0) query = query.lte("price", maxPrice);
  if (hasPool) query = query.eq("pool", true);
  if (hasGarage) query = query.eq("garage", true);
  if (wifiType) query = query.eq("wifi_type", wifiType);
  if (minBeds > 0) query = minBeds >= 6 ? query.gte("beds", 6) : query.eq("beds", minBeds);
  if (minBaths > 0) query = minBaths >= 6 ? query.gte("baths", 6) : query.eq("baths", minBaths);
  if (minParking > 0) query = query.gte("parking", minParking);
  if (minBuildingSqm > 0) query = query.gte("building_sqm", minBuildingSqm);
  if (minLandSqm > 0) query = query.gte("land_sqm", minLandSqm);
  for (const amenity of selectedAmenities) {
    query = query.contains("amenities", [amenity]);
  }

  const { data: properties, error } = await query;

  if (error) {
    console.error("Error fetching filtered properties:", error.message);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold">Properties for Sale</h1>
          <p className="text-slate-400 text-sm mt-1">Filter active listings across Botswana by location, budget, land tenure, and features.</p>
        </div>

        {/* Filter Bar */}
        <details className="group bg-slate-900/90 border border-slate-800 rounded-2xl">
          <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-bold text-white">
            <span>Filters</span>
            <span className="text-xs font-normal text-slate-400 group-open:text-cyan-300">Refine results</span>
          </summary>
          <form className="border-t border-slate-800 p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Location</label>
            <input
              type="search"
              name="location"
              defaultValue={location}
              placeholder="Gaborone, Phakalane, Maun"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {[
            ["minParking", "Parking / Garage", "Any parking"],
            ["minBuildingSqm", "Floor Size (m²)", "Minimum floor size"],
            ["minLandSqm", "Erf Size (m²)", "Minimum erf size"],
          ].map(([name, label, placeholder]) => (
            <div key={name}>
              <label className="block text-slate-400 mb-1 font-semibold">{label}</label>
              <input type="number" min="0" name={name} defaultValue={params[name as keyof typeof params] || ""}
                placeholder={placeholder} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
            </div>
          ))}

          {[
            ["minBeds", "Bedrooms", "Any bedrooms", "bedroom"],
            ["minBaths", "Bathrooms", "Any bathrooms", "bathroom"],
          ].map(([name, label, placeholder, unit]) => (
            <div key={name}>
              <label className="block text-slate-400 mb-1 font-semibold">{label}</label>
              <select
                name={name}
                defaultValue={params[name as keyof typeof params] || ""}
                aria-label={label}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="">{placeholder}</option>
                <option value="1">1 {unit}</option>
                <option value="2">2 {unit}s</option>
                <option value="3">3 {unit}s</option>
                <option value="4">4 {unit}s</option>
                <option value="5">5 {unit}s</option>
                <option value="6">6+ {unit}s</option>
              </select>
            </div>
          ))}

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Property Type</label>
            <select
              name="type"
              defaultValue={propertyType}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="">All Types</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Land">Land</option>
              <option value="Office">Office</option>
              <option value="Commercial">Commercial</option>
              <option value="Warehouse">Warehouse</option>
            </select>
          </div>

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

          <div className="md:col-span-4 space-y-4 border-t border-slate-800 pt-4">
            <fieldset>
              <legend className="mb-2 font-bold text-slate-300">Features</legend>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {["Pet Friendly", "Garden", "Swimming Pool", "Flatlet"].map((feature) => (
                  <label key={feature} className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                    <input type="checkbox" name="amenity" value={feature} defaultChecked={selectedAmenities.includes(feature)}
                      className="rounded border-slate-800 bg-slate-950 text-cyan-500" />
                    {feature}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 font-bold text-slate-300">Other</legend>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {["Retirement", "Repossessed", "On Show", "Security Estate / Cluster", "On Auction"].map((feature) => (
                  <label key={feature} className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                    <input type="checkbox" name="amenity" value={feature} defaultChecked={selectedAmenities.includes(feature)}
                      className="rounded border-slate-800 bg-slate-950 text-cyan-500" />
                    {feature}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex items-center gap-3">
              <Link href="/buy" className="text-slate-400 hover:text-white px-3 py-2">Reset</Link>
              <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-xl transition-all">
                Apply Filters
              </button>
            </div>
          </div>
          </form>
        </details>

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