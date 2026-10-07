import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  PUBLIC_PROPERTY_COLUMNS,
  PUBLIC_PROPERTY_COLUMNS_BEFORE_WIFI,
  PUBLIC_PROPERTY_COLUMNS_LEGACY,
} from "@/lib/supabase/public-columns";
import type { Property } from "@/types/property";

interface ComparePageProps {
  searchParams: Promise<{ ids?: string }>;
}

function list(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value !== "string") return [];
  return value.replace(/^\{|\}$/g, "").split(",").map((item) => item.trim()).filter(Boolean);
}

function display(value: unknown) {
  if (value === null || value === undefined || value === "") return "Not specified";
  return String(value);
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const ids = [...new Set((params.ids || "").split(",").map(Number).filter((id) => Number.isInteger(id) && id > 0))].slice(0, 3);
  const supabase = await createClient();
  async function loadProperties(columns: string) {
    if (!ids.length) return { data: [] as unknown[] | null, error: null };
    const response = await supabase.from("properties").select(columns).in("id", ids);
    return { data: response.data as unknown[] | null, error: response.error };
  }

  let result = await loadProperties(PUBLIC_PROPERTY_COLUMNS);

  if (result.error?.message.includes("column") && result.error.message.includes("does not exist")) {
    result = await loadProperties(PUBLIC_PROPERTY_COLUMNS_BEFORE_WIFI);
  }
  if (result.error?.message.includes("column") && result.error.message.includes("does not exist")) {
    result = await loadProperties(PUBLIC_PROPERTY_COLUMNS_LEGACY);
  }
  if (result.error) {
    console.error("Error loading properties for comparison:", result.error.message);
  }

  const properties = ((result.data || []) as Property[]).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
  const rows: Array<{ label: string; values: (string | number)[] }> = [
    { label: "Price", values: properties.map((property) => `${display(property.price)} BWP${property.price_unit === "month" ? " / month" : ""}`) },
    { label: "Location", values: properties.map((property) => display(property.location || property.city)) },
    { label: "Type", values: properties.map((property) => display(property.type)) },
    { label: "Bedrooms", values: properties.map((property) => property.beds || 0) },
    { label: "Bathrooms", values: properties.map((property) => property.baths || 0) },
    { label: "Parking", values: properties.map((property) => property.parking || 0) },
    { label: "Building size", values: properties.map((property) => property.building_sqm ? `${property.building_sqm} m²` : "Not specified") },
    { label: "Land size", values: properties.map((property) => property.land_sqm || property.plot_size ? `${property.land_sqm || property.plot_size} m²` : "Not specified") },
    { label: "Tenure", values: properties.map((property) => display(property.tenure)) },
    { label: "WiFi", values: properties.map((property) => display(property.wifi_type)) },
    { label: "Amenities", values: properties.map((property) => list(property.amenities).join(", ") || "None listed") },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link href="/buy" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300">
          <ArrowLeft className="h-4 w-4" /> Back to properties
        </Link>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Decision helper</p>
          <h1 className="mt-1 text-3xl font-black">Compare properties</h1>
          <p className="mt-2 text-sm text-slate-400">See what each home offers and where one property differs from another.</p>
        </div>
        {properties.length < 2 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-slate-300">Select at least two properties to compare.</p>
            <Link href="/buy" className="mt-4 inline-block rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">Choose properties</Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="w-40 p-4 text-xs uppercase tracking-wider text-slate-500">Feature</th>
                  {properties.map((property) => (
                    <th key={property.id} className="p-4 align-top">
                      <Link href={`/property/${property.id}`} className="font-bold text-white hover:text-cyan-300">{property.title}</Link>
                      <p className="mt-1 text-xs font-normal text-slate-500">{property.city || property.location}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const values = row.values.map(String);
                  const differs = new Set(values).size > 1;
                  return (
                    <tr key={row.label} className={`border-b border-slate-800/70 ${differs ? "bg-cyan-400/[0.04]" : ""}`}>
                      <th className="p-4 align-top text-xs font-bold text-slate-400">{row.label}</th>
                      {row.values.map((value, index) => (
                        <td key={`${row.label}-${properties[index].id}`} className={`p-4 align-top ${differs ? "text-cyan-100" : "text-slate-300"}`}>
                          {value === "Not specified" || value === "None listed" ? <span className="inline-flex items-center gap-1 text-slate-500"><X className="h-3.5 w-3.5" />{value}</span> : <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" />{value}</span>}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
