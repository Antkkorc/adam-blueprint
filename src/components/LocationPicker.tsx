"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, ChevronRight, Check } from "lucide-react";
import { LOCATION_TREE } from "@/data/locations";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function LocationPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const activeWards =
    LOCATION_TREE.find((c) => c.city === activeCity)?.wards ?? [];

  return (
    <div className="relative flex-1" ref={ref}>
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus-within:border-cyan-500/50 transition-colors">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Browse Botswana locations"
          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-2 text-[10px] font-extrabold uppercase tracking-wide text-cyan-300 hover:bg-cyan-500/20"
        >
          <MapPin className="h-4 w-4" />
          <span>All locations</span>
        </button>
        <input
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search by city or suburb, e.g. Gaborone"
          aria-label="Search by city or suburb"
          className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-400 outline-none"
        />
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-full md:w-[440px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setActiveCity(null);
              setOpen(false);
            }}
            className="glass-icon btn-pop w-full rounded-none border-b border-slate-800 px-4 py-2.5 text-left text-xs font-bold text-cyan-300 hover:bg-slate-800"
          >
            All Locations (Botswana)
          </button>

          <div className="flex h-64">
            {/* Cities column */}
            <div className="w-1/2 overflow-y-auto border-r border-slate-800">
              {LOCATION_TREE.filter((c) =>
                !value || c.city.toLowerCase().includes(value.toLowerCase()) ||
                c.wards.some((ward) => ward.toLowerCase().includes(value.toLowerCase()))
              ).map((c) => (
                <button
                  key={c.city}
                  type="button"
                  onClick={() => {
                    if (c.wards.length > 0) {
                      setActiveCity(c.city);
                    } else {
                      onChange(c.city);
                      setOpen(false);
                    }
                  }}
                  className={`btn-pop flex w-full items-center justify-between px-4 py-2.5 text-xs ${
                    activeCity === c.city
                      ? "bg-cyan-500/15 text-cyan-300"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {c.city}
                  {c.wards.length > 0 && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>

            {/* Wards column */}
            <div className="w-1/2 overflow-y-auto">
              {activeCity ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(activeCity);
                      setOpen(false);
                    }}
                    className="glass-icon btn-pop w-full rounded-none px-4 py-2.5 text-left text-xs font-bold text-cyan-300 hover:bg-slate-800"
                  >
                    All {activeCity}
                  </button>
                  {activeWards.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => {
                        onChange(w);
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                    >
                      {value === w && <Check className="w-3 h-3 text-cyan-400 shrink-0" />}
                      {w}
                    </button>
                  ))}
                </>
              ) : (
                <p className="p-4 text-[11px] text-slate-500">
                  Select a city to see its wards / suburbs.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}