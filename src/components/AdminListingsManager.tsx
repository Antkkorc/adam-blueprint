"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ListingType = "property" | "rental";
type Listing = { id: string; title?: string; location?: string; status?: string; price?: number };
type Archive = { id: string; listing_type: ListingType; listing_id: string; title?: string; location?: string; status?: string; deleted_at: string };

const statusOptions: Record<ListingType, string[]> = {
  property: ["Available", "Sold", "Rented"],
  rental: ["Available", "Rented"],
};

export default function AdminListingsManager({
  properties,
  rentals,
  archives,
}: {
  properties: Listing[];
  rentals: Listing[];
  archives: Archive[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [tab, setTab] = useState<"available" | "sold" | "rented" | "deleted">("available");
  const update = async (listingType: ListingType, id: string, status: string) => {
    setBusy(id);
    const response = await fetch("/api/admin/listings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingType, id, status }),
    });
    setBusy(null);
    if (!response.ok) alert((await response.json()).error || "Unable to update listing.");
    else router.refresh();
  };
  const remove = async (listingType: ListingType, id: string) => {
    const listing = [...properties, ...rentals].find((item) => item.id === id);
    if (!window.confirm(`Archive and delete "${listing?.title || "Untitled listing"}"? This removes it from public listings but keeps a history record.`)) return;
    setBusy(id);
    const response = await fetch("/api/admin/listings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingType, id }),
    });
    setBusy(null);
    if (!response.ok) alert((await response.json()).error || "Unable to delete listing.");
    else router.refresh();
  };
  const section = (heading: string, type: ListingType, items: Listing[]) => (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">{heading}</h2>
      {!items.length ? <p className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-400">No listings found.</p> : null}
      {items.map((listing) => (
        <div key={listing.id} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{listing.title || "Untitled listing"}</p>
            <p className="text-xs text-slate-400">{listing.location || "No location"} · {listing.status || "Unknown"}</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor={`${type}-${listing.id}-status`}>Status</label>
            <select id={`${type}-${listing.id}-status`} value={listing.status || statusOptions[type][0]} disabled={busy === listing.id}
              onChange={(event) => update(type, listing.id, event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-2 text-xs">
              {statusOptions[type].map((status) => <option key={status}>{status}</option>)}
            </select>
            <button type="button" disabled={busy === listing.id} onClick={() => remove(type, listing.id)}
              className="rounded-lg border border-red-500/40 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10 disabled:opacity-50">Delete</button>
          </div>
        </div>
      ))}
    </section>
  );
  const filtered = (items: Listing[]) => tab === "available" ? items.filter((item) => item.status === "Available") : tab === "sold" ? items.filter((item) => item.status === "Sold") : tab === "rented" ? items.filter((item) => item.status === "Rented") : [];
  return <div className="space-y-8">
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Listing status">
      {(["available", "sold", "rented", "deleted"] as const).map((value) => <button key={value} type="button" role="tab" aria-selected={tab === value} onClick={() => setTab(value)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${tab === value ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}>{value === "deleted" ? "Deleted/history" : value[0].toUpperCase() + value.slice(1)}</button>)}
    </div>
    {tab === "deleted" ? <section className="space-y-3"><h2 className="text-xl font-bold">Deleted/history</h2>{!archives.length ? <p className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-400">No archived listings.</p> : archives.map((archive) => <article key={archive.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4"><p className="font-semibold">{archive.title || "Untitled listing"}</p><p className="text-xs text-slate-400">{archive.listing_type} · {archive.location || "No location"} · {archive.status || "Unknown"} · deleted {new Date(archive.deleted_at).toLocaleString()}</p></article>)}</section> : <>{section("Properties", "property", filtered(properties))}{section("Tenant rentals", "rental", filtered(rentals))}</>}
  </div>;
}
