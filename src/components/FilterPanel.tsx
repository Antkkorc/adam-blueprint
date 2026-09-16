"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Check, RotateCcw, ChevronDown } from "lucide-react";
import {
  AMENITY_OPTIONS,
  PROPERTY_TYPES,
  buildFilterQuery,
  type PropertyFiltersState,
} from "@/lib/filters";

interface Props {
  basePath: string;
  initialFilters: PropertyFiltersState;
}

export default function FilterPanel({ basePath, initialFilters }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<PropertyFiltersState>(initialFilters);

  const activeCount =
    (filters.location ? 1 : 0) +
    (filters.minPrice > 0 ? 1 : 0) +
    (filters.maxPrice > 0 ? 1 : 0) +
    (filters.type !== "All Types" ? 1 : 0) +
    filters.amenities.length;

  const update = (key: keyof PropertyFiltersState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const applyFilters = () => {
    router.push(`${basePath}${buildFilterQuery(filters)}`);
  };

  const resetFilters = () => {
    setFilters({
      location: "",
      minPrice: 0,
      maxPrice: 0,
      type: "All Types",
      amenities: [],
    });
    router.push(basePath);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Toggle bar */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors"
      >
        <span className="flex items-center gap-2 text-white font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          Filters
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-extrabold">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="p-4 pt-2 space-y-4 border-t border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Gaborone, Phakalane, Maun..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Min Price (BWP)</label>
              <input
                type="number"
                value={filters.minPrice || ""}
                onChange={(e) => update("minPrice", Number(e.target.value) || 0)}
                placeholder="e.g. 500000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Max Price (BWP)</label>
              <input
                type="number"
                value={filters.maxPrice || ""}
                onChange={(e) => update("maxPrice", Number(e.target.value) || 0)}
                placeholder="e.g. 2500000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-xs mb-1 block">Property Type</label>
            <select
              value={filters.type}
              onChange={(e) => update("type", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-500"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-extrabold text-cyan-400 block mb-2">
              Amenities — click to select / unselect
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => {
                const active = filters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`text-[10px] px-2.5 py-1.5 rounded-md border transition-colors flex items-center gap-1 ${
                      active
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {active && <Check className="w-2.5 h-2.5" />}
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={applyFilters}
              className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all btn-pop neon-glow-hover flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Apply Filters
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}