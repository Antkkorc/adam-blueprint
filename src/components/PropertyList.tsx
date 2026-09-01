"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Property } from "@/types/property";
import { filterProperties, FilterState } from "@/lib/filters";
import FilterPanel from "./FilterPanel";

// PropertyCard currently has no module export, so load its default export at runtime.
// This keeps the list usable without TypeScript treating the file as an ES module.
import PropertyCard from "./PropertyCard";

interface PropertyListProps {
  properties: Property[];
  intent: "buy" | "rent";
}

export default function PropertyList({ properties, intent }: PropertyListProps) {
  const searchParams = useSearchParams();
  const locationFromUrl = searchParams.get("location") || "";

  const [filters, setFilters] = useState<FilterState>({
    locationQuery: locationFromUrl,
    selectedType: "All Types",
    keywordQuery: "",
    selectedBeds: "Any",
    selectedBaths: "Any",
    minPrice: 0,
    maxPrice: 10000000,
    selectedAmenities: [],
  });

  const filtered = useMemo(
    () => filterProperties(properties, intent, filters),
    [properties, intent, filters]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <FilterPanel filters={filters} onChange={setFilters} />
        </aside>

        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg capitalize">
              Properties for {intent}
            </h2>
            <span className="text-xs text-slate-400">
              Showing {filtered.length} verified listings
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center">
              <p className="text-slate-400 text-sm">
                No properties match your filters. Try adjusting your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}