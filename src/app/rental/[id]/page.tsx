import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, Bed, MapPin, MessageCircle, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BRAND } from "@/lib/brand";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

function toImageArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && item.length > 0);
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

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link href="/rent" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400">
          <ArrowLeft className="w-4 h-4" /> Back to Rentals
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <Image src={image} alt={rental.title} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(0, 8).map((src, index) => (
                  <div key={`${src}-${index}`} className="relative aspect-square overflow-hidden rounded-xl border border-slate-800">
                    <Image src={src} alt={`${rental.title} photo ${index + 1}`} fill sizes="25vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
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
