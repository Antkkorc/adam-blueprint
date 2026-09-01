"use client";
import Image from "next/image";
import { MapPin, Bed, Bath, Car, Maximize, BadgeCheck } from "lucide-react";
import { Property } from "@/types/property";
import { contactPropertyOnWhatsApp } from "@/lib/whatsapp";

interface Props { property: Property; }

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800";

export default function PropertyCard({ property }: Props) {
  const formatPrice = () => property.priceUnit === "month" ? `P${property.price?.toLocaleString() || 0}/mo` : `P${property.price?.toLocaleString() || 0}`;

  // Ensure image source is always a valid string
  const imageUrl = Array.isArray(property?.images) && property.images.length > 0 && property.images[0]
    ? property.images[0]
    : FALLBACK_IMAGE;

  return (
    <div className="bg-slate-900 border border-slate-800/90 rounded-2xl overflow-hidden hover:border-cyan-500/70 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between">
      <div>
        <div className="relative h-48">
          <Image 
            src={imageUrl} 
            alt={property.title || "Property Image"} 
            fill 
            className="object-cover" 
            unoptimized={imageUrl.startsWith("http")}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {property.featured && <span className="bg-cyan-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-md">FEATURED</span>}
            <span className="bg-slate-950/80 backdrop-blur-md text-cyan-400 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-cyan-500/30 uppercase">{property.intent}</span>
          </div>
          {property.verified && <div className="absolute top-3 right-3 bg-blue-500 text-white p-1 rounded-full"><BadgeCheck className="w-4 h-4" /></div>}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-slate-100 text-sm">{property.title}</h3>
          <p className="text-xl font-black text-cyan-400">{formatPrice()}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-cyan-500" /> {property.location}</p>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
            <div className="flex items-center gap-1 bg-slate-950/50 p-1.5 rounded-lg border border-slate-800"><Maximize className="w-3 h-3 text-cyan-400" /><span>{property.plotSize > 0 ? `${property.plotSize}m²` : "N/A"}</span></div>
            <div className="flex items-center gap-1 bg-slate-950/50 p-1.5 rounded-lg border border-slate-800"><Bed className="w-3 h-3 text-cyan-400" /><span>{property.beds > 0 ? `${property.beds} Beds` : "N/A"}</span></div>
            <div className="flex items-center gap-1 bg-slate-950/50 p-1.5 rounded-lg border border-slate-800"><Bath className="w-3 h-3 text-cyan-400" /><span>{property.baths > 0 ? `${property.baths} Baths` : "N/A"}</span></div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 flex justify-between items-center text-xs text-slate-400">
        <span className="text-[11px] truncate max-w-[140px]">{property.agent}</span>
        <button onClick={() => contactPropertyOnWhatsApp(property)} className="text-cyan-400 font-bold hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg transition-colors text-xs">
          WhatsApp
        </button>
      </div>
    </div>
  );
}