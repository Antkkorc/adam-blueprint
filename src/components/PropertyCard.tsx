"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, MapPin, Bed, Bath, Car, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { BRAND } from "@/lib/brand";
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
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

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

  const whatsappPhone = (agentPhone || BRAND.phone).replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    `Hello ${BRAND.name}, I am interested in "${property.title}" in ${
      property.location || property.city || "Botswana"
    }. Please send me more details.`
  );

  async function toggleSaved() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    setSaving(true);

    try {
      if (saved) {
        await supabase
          .from("saved_properties")
          .delete()
          .eq("user_id", session.user.id)
          .eq("property_id", property.id);

        setSaved(false);
      } else {
        await supabase.from("saved_properties").upsert(
          {
            user_id: session.user.id,
            property_id: property.id,
          },
          { onConflict: "user_id,property_id" }
        );

        setSaved(true);
      }

      // Refresh server data so lists (like /saved) update instantly
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all group">
      <div className="relative h-52">
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <button
          type="button"
          onClick={toggleSaved}
          disabled={saving}
          className={`absolute top-3 right-3 p-2 rounded-full border backdrop-blur-md transition-all ${
            saved
              ? "bg-cyan-400 text-slate-950 border-cyan-300"
              : "bg-slate-950/70 text-white border-white/20 hover:border-cyan-300 hover:text-cyan-300"
          }`}
          aria-label={saved ? "Remove from saved properties" : "Save property"}
        >
          <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
        </button>

        {property.featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-extrabold uppercase">
            Featured
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-bold text-sm line-clamp-1">{property.title}</h3>
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

          <button
            type="button"
            onClick={toggleSaved}
            disabled={saving}
            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-colors ${
              saved
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                : "bg-slate-950 border-slate-800 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
            }`}
          >
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}