import HeroSearch from "@/components/HeroSearch";
import { MOCK_PROPERTIES } from "@/data/properties";
import PropertyCard from "@/components/PropertyCard";
import { CATEGORIES } from "@/data/categories";
import Link from "next/link";
import { HomeIcon, Building, Building2, MapPin, Briefcase, Warehouse, Trees } from "lucide-react";

const icons: Record<string, React.ElementType> = {
  houses: HomeIcon, // <-- Make sure this says HomeIcon, NOT Home
  apartments: Building,
  villas: Building2,
  plots: MapPin,
  commercial: Briefcase,
  warehouses: Warehouse,
  offices: Building2,
  land: Trees,
};

export default function Home() {
  const featured = MOCK_PROPERTIES.filter((p) => p.featured);

  return (
    <>
      <HeroSearch />

      <section className="max-w-6xl mx-auto px-6 pt-12 pb-4 space-y-4">
        <div>
          <h3 className="text-xs uppercase tracking-widest font-extrabold text-cyan-400">Explore Categories</h3>
          <p className="text-slate-400 text-xs">Filter listings by preferred property layout</p>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none pt-2">
          {CATEGORIES.map((cat) => {
            const Icon = icons[cat.id] || Home;
            return (
              <Link
                key={cat.id}
                href={`/buy?type=${cat.id}`}
                className="flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-xs font-bold transition-all duration-300 shrink-0 bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              >
                <div className="p-1.5 rounded-xl bg-slate-950 text-slate-400">
                  <Icon className="w-4 h-4" />
                </div>
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-12 space-y-6">
        <div className="flex justify-between items-end border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Featured Listings in <span className="text-cyan-400">Botswana</span></h2>
            <p className="text-xs text-slate-400 mt-1">Explore verified residential homes and developments.</p>
          </div>
          <Link href="/buy" className="text-xs text-cyan-400 font-bold hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="bg-slate-950 border-y border-slate-800 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-white font-bold text-xl mb-8 text-center">Why Choose Adam Blueprint</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Botswana Focused", desc: "We understand local land tenure, Land Board processes, and Botswana property law." },
              { title: "Verified Listings", desc: "Every property is checked for title deeds and ownership before listing." },
              { title: "WhatsApp Enquiries", desc: "Connect instantly via WhatsApp — the way Batswana prefer to communicate." },
            ].map((item) => (
              <div key={item.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-cyan-400 font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}