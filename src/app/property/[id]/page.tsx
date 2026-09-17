import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, MapPin, Bed, Bath, Car, Ruler, Hash, Calendar, FileBadge,
  Phone, MessageCircle, Compass, Home as HomeIcon, TreePine, DraftingCompass,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";
import PropertyPhotoTour from "@/components/PropertyPhotoTour";
import SavePropertyButton from "@/components/SavePropertyButton";

export const dynamic = "force-dynamic";

interface PageProps { params: Promise<{ id: string }> }

function toStringArray(value: any): string[] {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string") {
    const cleaned = value.replace(/^\{/, "").replace(/\}$/, "").replace(/^\[/, "").replace(/\]$/, "");
    if (!cleaned.trim()) return [];
    return cleaned.split(",").map((item) => item.replace(/^"/, "").replace(/"$/, "").trim()).filter(Boolean);
  }
  return [];
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: property } = await supabase.from("properties").select("*").eq("id", id).single();
  if (!property) notFound();

  const { data: { user } } = await supabase.auth.getUser();
  let saved = false;
  if (user) {
    const { data } = await supabase.from("saved_properties").select("property_id").eq("user_id", user.id).eq("property_id", property.id).maybeSingle();
    saved = !!data;
  }

  const images = toStringArray(property.images);
  const imageLabels = toStringArray(property.image_labels);
  const amenities = toStringArray(property.amenities);
  const sketchPlan = toStringArray(property.sketch_plan);

  const price = new Intl.NumberFormat("en-BW", { style: "currency", currency: "BWP", maximumFractionDigits: 0 }).format(Number(property.price || 0));

  const agentName = property.agent || BRAND.owner;
  const agentPhone = property.agent_phone || BRAND.phone;
  const whatsappPhone = agentPhone.replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(`Hello ${BRAND.name}, I am interested in "${property.title}" in ${property.location || property.city || "Botswana"} (Plot ${property.plot_number || "N/A"}).`);

  // EXACT PIN MAP LOGIC (OpenStreetMap - 100% free, no API key needed)
  const hasCoords = property.latitude != null && property.longitude != null;
  let mapEmbed = "";
  let mapLink = "";
  
  if (hasCoords) {
    const lat = property.latitude;
    const lon = property.longitude;
    // bbox creates a zoomed-in box around the exact pin
    const bbox = `${lon - 0.003},${lat - 0.003},${lon + 0.003},${lat + 0.003}`;
    mapEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
    mapLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`;
  } else {
    const query = `${property.location || property.city || "Gaborone"}, Botswana`;
    mapLink = `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
  }

  const stats = [
    { icon: Bed, label: "Bedrooms", value: property.beds || 0 },
    { icon: Bath, label: "Bathrooms", value: property.baths || 0 },
    { icon: Car, label: "Parking", value: property.parking || 0 },
    { icon: Ruler, label: "Building Size", value: property.building_sqm ? `${property.building_sqm} m²` : "—" },
    { icon: Compass, label: "Land Size", value: property.land_sqm || property.plot_size ? `${property.land_sqm || property.plot_size} m²` : "—" },
    { icon: Hash, label: "Plot Number", value: property.plot_number || "—" },
    { icon: FileBadge, label: "Tenure", value: property.tenure || "—" },
    { icon: Calendar, label: "Year Built", value: property.year_built || "—" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link href={`/${property.intent === "rent" ? "rent" : "buy"}`} className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to {property.intent === "rent" ? "Rentals" : "Properties for Sale"}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* CATEGORIZED PHOTO TOUR */}
            <PropertyPhotoTour images={images} labels={imageLabels} title={property.title} />

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {property.featured && <span className="px-2.5 py-1 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-extrabold uppercase">Featured</span>}
                {property.verified && <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-extrabold uppercase">Verified</span>}
                {property.title_deed && <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-extrabold uppercase">Title Deed</span>}
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold">{property.title}</h1>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {property.location || property.city || "Botswana"}
                {property.plot_number ? ` • Plot ${property.plot_number}` : ""}
              </p>
              <p className="text-cyan-400 text-2xl md:text-3xl font-black">
                {price}
                {property.price_unit === "month" && <span className="text-sm text-slate-500 font-semibold"> / month</span>}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
                  <stat.icon className="w-4 h-4 text-cyan-400" />
                  <p className="text-white text-sm font-bold">{stat.value}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <h2 className="text-lg font-bold flex items-center gap-2"><HomeIcon className="w-5 h-5 text-cyan-400" /> Overview</h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{property.overview || property.description || "No overview provided."}</p>
              {property.overview && property.description && <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{property.description}</p>}
            </section>

            {(property.inside_features || property.outside_features) && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.inside_features && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                    <h2 className="text-base font-bold flex items-center gap-2"><HomeIcon className="w-5 h-5 text-cyan-400" /> Inside</h2>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{property.inside_features}</p>
                  </div>
                )}
                {property.outside_features && (
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                    <h2 className="text-base font-bold flex items-center gap-2"><TreePine className="w-5 h-5 text-emerald-400" /> Outside</h2>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{property.outside_features}</p>
                  </div>
                )}
              </section>
            )}

            {amenities.length > 0 && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <h2 className="text-lg font-bold">Amenities & Features</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <span key={amenity} className="text-xs px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-slate-300">{amenity}</span>
                  ))}
                </div>
              </section>
            )}

            {sketchPlan.length > 0 && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><DraftingCompass className="w-5 h-5 text-cyan-400" /> Sketch Plan / Floor Plan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sketchPlan.map((img, i) => (
                    <img key={i} src={img} alt={`Sketch plan ${i + 1}`} className="w-full h-64 object-contain bg-white rounded-xl border border-slate-800 p-2" />
                  ))}
                </div>
              </section>
            )}

            {/* EXACT PIN MAP */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h2 className="text-lg font-bold flex items-center gap-2"><MapPin className="w-5 h-5 text-cyan-400" /> Pinned Location</h2>
                {mapLink && (
                  <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline font-semibold">
                    Open in Full Map →
                  </a>
                )}
              </div>
              
              {hasCoords ? (
                <div className="h-80 rounded-xl overflow-hidden border border-slate-800">
                  <iframe title="Property exact location map" src={mapEmbed} className="w-full h-full" loading="lazy" />
                </div>
              ) : (
                <div className="h-40 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs text-center p-4">
                  Exact pin not available. Add Latitude & Longitude in the Admin panel to see the exact map pin.
                </div>
              )}
              <p className="text-slate-400 text-xs">
                {hasCoords ? `Pinned exactly at ${property.latitude}, ${property.longitude}` : `Approximate area: ${property.location || property.city}`}
              </p>
            </section>
          </div>

          <div className="space-y-4 lg:sticky lg:top-24 self-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold">Listed By</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-lg">
                  {agentName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{agentName}</p>
                  <p className="text-slate-500 text-xs">{property.intent === "rent" ? "Rental Agent" : "Property Agent / Owner"}</p>
                </div>
              </div>
              <a href={`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
              <a href={`tel:${agentPhone.replace(/\s/g, "")}`} className="w-full py-3 rounded-xl border border-slate-700 bg-slate-950 hover:border-cyan-400 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                <Phone className="w-4 h-4 text-cyan-400" /> {agentPhone}
              </a>
              <SavePropertyButton propertyId={property.id} initialSaved={saved} size="lg" />
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-[11px] text-slate-500 space-y-1">
              <p>• Always verify title deeds before paying.</p>
              <p>• {BRAND.name} verifies every official listing.</p>
              <p>• Reference: Property ID #{property.id}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}