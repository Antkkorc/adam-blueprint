"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterState } from "@/lib/filters";
import { BOTSWANA_LOCATIONS } from "@/data/locations";
import { Search, SlidersHorizontal, Check } from "lucide-react";

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

const TYPES = ["All Types", "House", "Apartment", "Land", "Office", "Commercial", "Warehouse"];
const BEDS = ["Any", "1", "2", "3", "4", "5+"];
const BATHS = ["Any", "1", "2", "3+"];
const AMENITIES = [
  "Air Conditioning", "Borehole", "Solar Backup", "Electric Fence / Security",
  "Boundary Wall", "Garage & Parking", "Swimming Pool", "Fibre/Wi-Fi Ready", "Gated Community"
];

export default function FilterPanel({ filters, onChange }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const update = (k: keyof FilterState, v: any) => onChange({ ...filters, [k]: v });
  const toggleAmenity = (a: string) =>
    update("selectedAmenities", filters.selectedAmenities.includes(a)
      ? filters.selectedAmenities.filter((x) => x !== a)
      : [...filters.selectedAmenities, a]
    );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2">
        <Search className="w-4 h-4 text-cyan-400" /> Filters
      </div>

      <div>
        <label className="text-slate-400 text-xs mb-1 block">Location</label>
        <select
          value={filters.locationQuery}
          onChange={(e) => update("locationQuery", e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500"
        >
          {BOTSWANA_LOCATIONS.map((l) => (
            <option key={l} value={l === "All Locations" ? "" : l}>{l}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-slate-400 text-xs mb-1 block">Property Type</label>
        <select
          value={filters.selectedType}
          onChange={(e) => update("selectedType", e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500"
        >
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="text-slate-400 text-xs mb-1 block">Keyword</label>
        <input
          type="text"
          placeholder="e.g. pool, borehole..."
          value={filters.keywordQuery}
          onChange={(e) => update("keywordQuery", e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500"
        />
      </div>

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className={`w-full py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
          showAdvanced
            ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
            : "bg-slate-950 border-slate-800 text-slate-300"
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" /> Advanced Filters
      </button>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => update("minPrice", Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => update("maxPrice", Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Beds</label>
                <select
                  value={filters.selectedBeds}
                  onChange={(e) => update("selectedBeds", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-cyan-500"
                >
                  {BEDS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Baths</label>
                <select
                  value={filters.selectedBaths}
                  onChange={(e) => update("selectedBaths", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-cyan-500"
                >
                  {BATHS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-extrabold text-cyan-400 block mb-2">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map((a) => {
                  const checked = filters.selectedAmenities.includes(a);
                  return (
                    <button
                      key={a}
                      onClick={() => toggleAmenity(a)}
                      className={`text-[10px] px-2 py-1 rounded-md border transition-colors flex items-center gap-1 ${
                        checked
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      {checked && <Check className="w-2.5 h-2.5" />}
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}