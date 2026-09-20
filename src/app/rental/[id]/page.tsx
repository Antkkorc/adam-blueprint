import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, Bed, MapPin, MessageCircle, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";
import RentalPhotoGallery from "@/components/RentalPhotoGallery";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

function toImageArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && item.length > 0);
  return [];
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  return [];
}

export default async function RentalDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: rental, error } = await supabase
    .from("tenant_rentals")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !rental) notFound();

  const images = toImageArray(rental.images);
  const imageLabels = toStringArray(rental.image_labels);
  const image = images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80";
  const price = new Intl.NumberFormat("en-BW", {
    style: "currency",
    currency: "BWP",
    maximumFractionDigits: 0,
  }).format(Number(rental.price || 0));
  const phone = String(rental.contact_number || "").replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in your rental listing "${rental.title}" in ${rental.location}. Is it still available?`
  );
  const hasCoords = rental.latitude != null && rental.longitude != null;
  const mapLink = hasCoords
    ? `https://www.openstreetmap.org/?mlat=${rental.latitude}&mlon=${rental.longitude}#map=17/${rental.latitude}/${rental.longitude}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${rental.location}, Botswana`)}`;
  const satelliteLink = hasCoords
    ? `https://www.google.com/maps/@?api=1&map_action=map&center=${rental.latitude},${rental.longitude}&zoom=18&basemap=satellite`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${rental.location}, Botswana`)}`;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/rent" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400">
          <ArrowLeft className="w-4 h-4" /> Back to Rentals
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <RentalPhotoGallery images={images.length > 0 ? images : [image]} labels={imageLabels} title={rental.title} />
          </div>

          <section className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-emerald-400 px-3 py-1 text-[10px] font-extrabold uppercase text-slate-950">
                Community Rental
              </span>
              <h1 className="text-3xl font-extrabold">{rental.title}</h1>
              <p className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4 text-cyan-400" /> {rental.location}
              </p>
              <p className="text-3xl font-black text-cyan-400">{price}<span className="text-sm text-slate-500"> / month</span></p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <Bed className="mb-2 h-5 w-5 text-cyan-400" />
                <p className="text-lg font-bold">{rental.bedrooms || 0}</p>
                <p className="text-xs uppercase tracking-wider text-slate-400">Bedrooms</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <Bath className="mb-2 h-5 w-5 text-cyan-400" />
                <p className="text-lg font-bold">{rental.bathrooms || 0}</p>
                <p className="text-xs uppercase tracking-wider text-slate-400">Bathrooms</p>
              </div>
            </div>

            <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-lg font-bold"><MapPin className="h-5 w-5 text-cyan-400" /> Location</h2>
                <div className="flex flex-wrap gap-3">
                  <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-cyan-400 hover:underline">
                    Open street map →
                  </a>
                  <a href={satelliteLink} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-emerald-400 hover:underline">
                    {hasCoords ? "Open satellite view →" : "Open satellite area view →"}
                  </a>
                </div>
              </div>
              {hasCoords ? (
                <>
                  <p className="text-sm text-slate-400">Approximate map location for {rental.location}.</p>
                  <iframe
                    title={`Map showing ${rental.title}`}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(rental.longitude) - 0.02},${Number(rental.latitude) - 0.02},${Number(rental.longitude) + 0.02},${Number(rental.latitude) + 0.02}&layer=mapnik&marker=${rental.latitude},${rental.longitude}`}
                    className="h-80 w-full rounded-xl border-0"
                    loading="lazy"
                  />
                  <p className="text-xs text-slate-500">The satellite view opens in Google Maps at the saved rental coordinates.</p>
                </>
              ) : (
                <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-700 p-4 text-center text-xs text-slate-500">
                  An exact pin was not saved for this rental. Open the area search above to view the approximate location.
                </div>
              )}
            </section>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3">
              <h2 className="text-lg font-bold">Rental Information</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
                {rental.description || rental.info || "No description provided."}
              </p>
              <p className="text-sm text-slate-400">Listed by {rental.tenant_name || "Owner"}</p>
            </div>

            <div className="flex flex-col gap-3">
              {phone && (
                <a href={`https://wa.me/${phone}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-bold text-slate-950 hover:bg-emerald-400">
                  <MessageCircle className="h-5 w-5" /> Contact via WhatsApp
                </a>
              )}
              <a href={`tel:${rental.contact_number || BRAND.phone}`} className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 py-3 font-bold text-cyan-400 hover:bg-cyan-500/10">
                <Phone className="h-5 w-5" /> Call about this rental
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
