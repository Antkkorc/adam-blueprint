"use client";

import { Eye, GitCompare, MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";

export interface TenantRental {
  id: string;
  created_at?: string;
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  tenant_name: string;
  contact_number: string;
  info?: string;
  images: string[];
  user_id?: string;
  status?: string;
  student_friendly?: boolean;
}

export default function TenantRentalCard({
  rental,
  isStudentHousing = false,
}: {
  rental: TenantRental;
  isStudentHousing?: boolean;
}) {
  const { isSelected, toggle, selectedIds } = useCompare();
  const compareSelection = { kind: "rental" as const, id: String(rental.id) };
  const selected = isSelected(compareSelection);
  const studentListing = isStudentHousing || rental.student_friendly === true;
  const image =
    rental.images?.[0] ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

  const price = new Intl.NumberFormat("en-BW", {
    style: "currency",
    currency: "BWP",
    maximumFractionDigits: 0,
  }).format(Number(rental.price || 0));

  const phone = (rental.contact_number || "").replace(/\D/g, "");
  const message = encodeURIComponent(
    `Hello, I am interested in your rental listing "${rental.title}" in ${rental.location}. Is it still available?`
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all group">
      <div className="relative h-52">
        <Link href={`/rental/${rental.id}`} aria-label={`View details for ${rental.title}`}>
          <Image
            src={image}
            alt={rental.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-slate-950 text-[10px] font-extrabold uppercase ${studentListing ? "bg-cyan-300" : "bg-emerald-400"}`}>
          {studentListing ? "Student Housing" : "Community Listing"}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-bold text-sm line-clamp-1">
            <Link href={`/rental/${rental.id}`} className="hover:text-cyan-400 transition-colors">
              {rental.title}
            </Link>
          </h3>
          <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-cyan-400" />
            {rental.location}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-cyan-400 font-extrabold text-sm">{price}</p>
            <p className="text-[10px] text-slate-500">
              {rental.bedrooms} bedroom{rental.bedrooms === 1 ? "" : "s"} ·{" "}
              {rental.bathrooms} bathroom{rental.bathrooms === 1 ? "" : "s"} · per month
            </p>
          </div>
          <p className="text-[10px] text-slate-500">
            Listed by {rental.tenant_name || "Property owner"}
          </p>
        </div>

        <p className="text-slate-400 text-xs line-clamp-2">
          {rental.description || rental.info}
        </p>

        <Link
          href={`/rental/${rental.id}`}
          className="glass-icon btn-pop flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/40 py-2 text-xs font-bold text-cyan-300"
        >
          <Eye className="h-3.5 w-3.5" />
          Details
        </Link>

        <button
          type="button"
          onClick={() => toggle(compareSelection)}
          disabled={!selected && selectedIds.length >= 3}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-xs font-bold transition-colors ${selected ? "border-cyan-400 bg-cyan-400/15 text-cyan-300" : "border-slate-800 bg-slate-950 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"} disabled:cursor-not-allowed disabled:opacity-50`}
          title={selectedIds.length >= 3 && !selected ? "Compare up to three listings" : undefined}
        >
          <GitCompare className="h-3.5 w-3.5" />
          {selected ? "Selected for comparison" : "Compare listing"}
        </button>

        {phone && (
          <a
            href={`https://wa.me/${phone}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Contact via WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}