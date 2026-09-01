"use client";

import { useState, useRef, useEffect } from "react";
import HeroSearch from "@/components/HeroSearch";
import { Property } from "@/types/property";
import PropertyCard from "@/components/PropertyCard";
import { CATEGORIES } from "@/data/categories";
import Link from "next/link";
import {
  Home as HomeIcon,
  Building,
  Building2,
  MapPin,
  Briefcase,
  Warehouse,
  TreePine,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Shield,
  MessageCircle,
} from "lucide-react";

const icons: Record<string, React.ElementType> = {
  houses: HomeIcon,
  apartments: Building,
  villas: Building2,
  plots: MapPin,
  commercial: Briefcase,
  warehouses: Warehouse,
  offices: Building2,
  land: TreePine,
};

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [showLeft, setShowLeft] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.error("Failed to load properties:", err));
  }, []);

  const featured = properties.filter((p) => p.featured);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 250 : -250, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeft(scrollRef.current.scrollLeft > 20);
    }
  };

  return (
    <div suppressHydrationWarning>
      <HeroSearch />

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white">Browse by Category</h2>
          <p className="text-xs text-slate-400">Find exactly what you are looking for</p>
        </div>

        <div className="relative flex items-center">
          {isMounted && showLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-cyan-400 hover:text-white hover:border-cyan-400/50 transition-all btn-pop shadow-xl"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto pb-4 pt-2 w-full scroll-smooth scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {CATEGORIES.map((cat) => {
              const Icon = icons[cat.id] || HomeIcon;
              return (
                <Link
                  key={cat.id}
                  href={`/buy?type=${cat.id}`}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-2xl glass text-xs font-bold text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-all btn-pop shrink-0"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  {cat.label}
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 w-10 h-10 rounded-full glass flex items-center justify-center text-cyan-400 hover:text-white hover:border-cyan-400/50 transition-all btn-pop shadow-xl"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              Featured <span className="text-gradient">Properties</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Handpicked premium listings</p>
          </div>
          <Link
            href="/buy"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-all hover:gap-2"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Verified Listings", desc: "Every property checked for title deeds and ownership." },
              { icon: TrendingUp, title: "Market Expertise", desc: "Deep knowledge of Botswana land tenure and valuations." },
              { icon: MessageCircle, title: "WhatsApp First", desc: "Instant enquiries via WhatsApp with Segolame Adam." },
            ].map((item) => (
              <div key={item.title} className="glass rounded-2xl p-6 space-y-3 hover:border-cyan-500/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-bold text-sm text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}