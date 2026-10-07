import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  PUBLIC_PROPERTY_COLUMNS,
  PUBLIC_PROPERTY_COLUMNS_BEFORE_WIFI,
  PUBLIC_PROPERTY_COLUMNS_LEGACY,
} from "@/lib/supabase/public-columns";
import type { Property } from "@/types/property";
import type { TenantRental } from "@/components/TenantRentalCard";

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

function normalizeFeature(value: string) {
  return value.trim().toLocaleLowerCase();
}

function formatFeature(value: string) {
  return value
    .split(/\s+/)
    .map((word) => word ? `${word[0].toLocaleUpperCase()}${word.slice(1)}` : word)
    .join(" ");
}

interface ComparisonListing {
  key: string;
  kind: "property" | "rental";
  id: string;
  title: string;
  location: string;
  type: string;
  price: number;
  priceUnit: string;
  beds: number;
  baths: number;
  parking: number | null;
  buildingSize: string;
  landSize: string;
  tenure: string;
  wifi: string;
  features: string[];
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const selections = [...new Set((params.ids || "").split(",").map((token) => {
    const [prefix, ...rawId] = token.split(":");
    if ((prefix === "p" || prefix === "r") && rawId.length > 0) return `${prefix}:${decodeURIComponent(rawId.join(":"))}`;
    const id = Number(token);
    return Number.isInteger(id) && id > 0 ? `p:${id}` : "";
  }).filter(Boolean))].slice(0, 3);
  const propertyIds = selections.filter((key) => key.startsWith("p:")).map((key) => Number(key.slice(2)));
  const rentalIds = selections.filter((key) => key.startsWith("r:")).map((key) => key.slice(2));
  const supabase = await createClient();
  async function loadProperties(columns: string) {
    if (!propertyIds.length) return { data: [] as unknown[] | null, error: null };
    const response = await supabase.from("properties").select(columns).in("id", propertyIds);
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

  const rentalsResult = rentalIds.length
    ? await supabase.from("tenant_rentals").select("id,title,location,price,bedrooms,bathrooms,description,info,student_friendly,status").in("id", rentalIds)
    : { data: [], error: null };
  if (rentalsResult.error) console.error("Error loading rentals for comparison:", rentalsResult.error.message);

  const propertyListings: ComparisonListing[] = ((result.data || []) as Property[]).map((property) => ({
    key: `p:${property.id}`,
    kind: "property",
    id: String(property.id),
    title: property.title,
    location: property.location || property.city || "Botswana",
    type: property.type,
    price: property.price,
    priceUnit: property.price_unit,
    beds: property.beds || 0,
    baths: property.baths || 0,
    parking: property.parking || 0,
    buildingSize: property.building_sqm ? `${property.building_sqm} m²` : "Not specified",
    landSize: property.land_sqm || property.plot_size ? `${property.land_sqm || property.plot_size} m²` : "Not specified",
    tenure: property.tenure || "Not specified",
    wifi: property.wifi_type || "Not specified",
    features: list(property.amenities).concat(property.wifi_type ? [property.wifi_type === "fibre" ? "Fibre WiFi" : "4G/5G Router WiFi"] : []),
  }));
  const rentalListings: ComparisonListing[] = (rentalsResult.data as TenantRental[]).map((rental) => ({
    key: `r:${rental.id}`,
    kind: "rental",
    id: String(rental.id),
    title: rental.title,
    location: rental.location,
    type: rental.student_friendly ? "Student housing" : "Rental listing",
    price: rental.price,
    priceUnit: "month",
    beds: rental.bedrooms || 0,
    baths: rental.bathrooms || 0,
    parking: null,
    buildingSize: "Not specified",
    landSize: "Not specified",
    tenure: "Not specified",
    wifi: "Not specified",
    features: rental.student_friendly ? ["Student friendly"] : [],
  }));
  const listings = selections.map((key) => [...propertyListings, ...rentalListings].find((listing) => listing.key === key)).filter((listing): listing is ComparisonListing => Boolean(listing));
  const amenitySets = listings.map((listing) => {
    return new Map(listing.features.map((feature) => [normalizeFeature(feature), formatFeature(feature)]));
  });
  const allFeatures = [...new Set(amenitySets.flatMap((amenities) => [...amenities.keys()]))]
    .sort((a, b) => a.localeCompare(b));
  const rows: Array<{ label: string; values: (string | number)[] }> = [
    { label: "Price", values: listings.map((listing) => `${display(listing.price)} BWP${listing.priceUnit === "month" ? " / month" : ""}`) },
    { label: "Location", values: listings.map((listing) => display(listing.location)) },
    { label: "Type", values: listings.map((listing) => display(listing.type)) },
    { label: "Bedrooms", values: listings.map((listing) => listing.beds) },
    { label: "Bathrooms", values: listings.map((listing) => listing.baths) },
    { label: "Parking", values: listings.map((listing) => listing.parking ?? "Not specified") },
    { label: "Building size", values: listings.map((listing) => listing.buildingSize) },
    { label: "Land size", values: listings.map((listing) => listing.landSize) },
    { label: "Tenure", values: listings.map((listing) => listing.tenure) },
    { label: "WiFi", values: listings.map((listing) => listing.wifi) },
  ];

  return (
    <main className="compare-page min-h-screen bg-slate-950 px-4 py-8 text-white md:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link href="/buy" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300">
          <ArrowLeft className="h-4 w-4" /> Back to properties
        </Link>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Decision helper</p>
          <h1 className="mt-1 text-3xl font-black">Compare properties</h1>
          <p className="mt-2 text-sm text-slate-400">See what each home offers and where one property differs from another.</p>
        </div>
        {listings.length < 2 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <p className="text-slate-300">Select at least two properties to compare.</p>
            <Link href="/buy" className="mt-4 inline-block rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">Choose properties</Link>
          </div>
        ) : (
          <div className="compare-table-wrap overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="w-40 p-4 text-xs uppercase tracking-wider text-slate-500">Feature</th>
                  {listings.map((listing) => (
                    <th key={listing.key} className="p-4 align-top">
                      <Link href={`/${listing.kind === "property" ? "property" : "rental"}/${listing.id}`} className="font-bold text-white hover:text-cyan-300">{listing.title}</Link>
                      <p className="mt-1 text-xs font-normal text-slate-500">{listing.location}</p>
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
                        <td key={`${row.label}-${listings[index].key}`} className={`compare-value p-4 align-top ${differs ? "compare-value-different" : ""}`}>
                          {value === "Not specified" || value === "None listed" ? <span className="inline-flex items-center gap-1 text-slate-500"><X className="h-3.5 w-3.5" />{value}</span> : <span className="inline-flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" />{value}</span>}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                {allFeatures.length > 0 && (
                  <tr className="border-b border-slate-800/70 bg-cyan-400/[0.04]">
                    <th className="p-4 align-top text-xs font-bold text-slate-400">Features</th>
                    {listings.map((listing, index) => (
                      <td key={`features-${listing.key}`} className="p-4 align-top">
                        <div className="space-y-2">
                          {allFeatures.map((feature) => (
                            <div key={`${listing.key}-${feature}`} className="flex items-center gap-2 text-xs">
                              {amenitySets[index].has(feature) ? (
                                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                              ) : (
                                <X className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                              )}
                              <span className={`compare-feature-label ${amenitySets[index].has(feature) ? "compare-feature-present" : "compare-feature-missing"}`}>
                                {formatFeature(feature)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {listings.length >= 2 && allFeatures.length > 0 && (
          <section className="compare-summary rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6">
            <h2 className="text-lg font-bold">Feature summary</h2>
            <p className="mt-1 text-xs text-slate-400">
              This summary is based on features listed in each property advert. “Not listed” means the advert did not mention it.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {listings.map((listing, index) => {
                const hasFeatures = [...amenitySets[index].values()];
                const otherFeatures = new Set(
                  amenitySets
                    .filter((_, otherIndex) => otherIndex !== index)
                    .flatMap((amenities) => [...amenities.keys()]),
                );
                const missingFeatures = [...otherFeatures]
                  .filter((feature) => !amenitySets[index].has(feature))
                  .map((feature) => formatFeature(feature));

                return (
                  <div key={`summary-${listing.key}`} className="compare-summary-card rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <h3 className="compare-summary-title font-bold">{listing.title}</h3>
                    <div className="mt-3 space-y-2 text-sm">
                      <p className="compare-summary-present flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0" />
                        <span><strong>{listing.title} has:</strong> {hasFeatures.length > 0 ? hasFeatures.join(", ") : "No features listed"}</span>
                      </p>
                      <p className="compare-summary-missing flex items-start gap-2">
                        <X className="mt-0.5 h-4 w-4 shrink-0" />
                        <span><strong>{listing.title} does not have listed:</strong> {missingFeatures.length > 0 ? missingFeatures.join(", ") : "No features unique to the other selected properties"}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
