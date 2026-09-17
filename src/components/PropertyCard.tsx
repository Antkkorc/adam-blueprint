"use client";

import Link from "next/link";
import { MapPin, Bed, Bath, Car, MessageCircle, Ruler } from "lucide-react";
import { BRAND } from "@/lib/brand";
import SavePropertyButton from "@/components/SavePropertyButton";
import type { Property } from "@/types/property";

interface Props {
  property: Property;
  initialSaved?: boolean;
}

function toStringArray(value: any): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string") {
    const cleaned = value
      .replace(/^\{/, "")
      .replace(/\}$/, "")
      .replace(/^\[/, "")
      .replace(/\]$/, "");
    if (!cleaned.trim()) return [];
    return cleaned
      .split(",")
      .map((item) => item.replace(/^"/, "").replace(/"$/, "").trim())
      .filter(Boolean);
  }
  return [];
}

export default function PropertyCard({ property, initialSaved = false }: Props) {
  const images = toStringArray((property as any).images);
  const amenities = toStringArray((property as any).amenities);

  const image =
    images[0] ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

  const price = new Intl.NumberFormat("en-BW", {
    style: "currency",
    currency: "BWP",
    maximumFractionDigits: 0,
  }).format(Number(property.price || 0));

  const priceUnit = (property as any).price_unit ?? (property as any).priceUnit;
  const agentPhone = (property as any).agent_phone ?? (property as any).agentPhone;
  const buildingSqm = (property as any).building_sqm;
  const landSqm = (property as any).land_sqm ?? (property as any).plot_size;

  const whatsappPhone = (agentPhone || BRAND.phone).replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    `Hello ${BRAND.name}, I am interested in "${property.title}" in ${
      property.location || property.city || "Botswana"
    }. Please send me more details.`
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all group">
      <div className="relative h-52">
        <Link href={`/property/${property.id}`}>
          <img
            src={image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <SavePropertyButton propertyId={property.id} initialSaved={initialSaved} />

        {property.featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-extrabold uppercase">
            Featured
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <Link href={`/property/${property.id}`}>
            <h3 className="text-white font-bold text-sm line-clamp-1 hover:text-cyan-400 transition-colors">
              {property.title}
            </h3>
          </Link>
          <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-cyan-400" />
            {property.location || property.city || "Botswana"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-cyan-400 font-extrabold text-sm">{price}</p>
            {priceUnit === "month" && (
              <p className="text-[10px] text-slate-500">per month</p>
            )}
          </div>

          <div className="flex items-center gap-3 text-slate-300 text-xs">
            {property.beds > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-cyan-400" />
                {property.beds}
              </span>
            )}
            {property.baths > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-cyan-400" />
                {property.baths}
              </span>
            )}
            {property.parking > 0 && (
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-cyan-400" />
                {property.parking}
              </span>
            )}
          </div>
        </div>

        {(buildingSqm || landSqm) && (
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <Ruler className="w-3 h-3 text-cyan-400" />
            {buildingSqm ? `Building ${buildingSqm} m²` : ""}
            {buildingSqm && landSqm ? " • " : ""}
            {landSqm ? `Land ${landSqm} m²` : ""}
          </p>
        )}

        <p className="text-slate-400 text-xs line-clamp-2">{property.description}</p>

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-[9px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400"
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-500">
                +{amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <a
            href={`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>

          <Link
            href={`/property/${property.id}`}
            className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:border-cyan-400 hover:text-cyan-300 text-xs font-bold transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}