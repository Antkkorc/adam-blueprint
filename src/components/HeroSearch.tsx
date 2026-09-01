"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Home, ChevronRight } from "lucide-react";
import { BOTSWANA_LOCATIONS } from "@/data/locations";
import { BRAND } from "@/lib/brand";

export default function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [intent, setIntent] = useState<"buy" | "rent">("buy");

  const handleSearch = () => {
    const q = location ? `?location=${encodeURIComponent(location)}` : "";
    router.push(`/${intent}${q}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1920&q=80"
          className="w-full h-full object-cover opacity-30"
          alt="Botswana"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/80 to-slate-950" />
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto px-4 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold tracking-widest uppercase neon-glow">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {BRAND.tagline}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
            Find Your Perfect <br />
            <span className="text-gradient">Property in Botswana</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Premium homes, plots, and commercial spaces in Gaborone, Maun, Francistown & beyond. Verified listings by Segolame Adam.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-3xl p-2 max-w-3xl mx-auto shadow-2xl"
        >
          <div className="flex p-1 gap-1 mb-3 justify-center">
            {(["buy", "rent"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setIntent(t)}
                className={`px-8 py-2 rounded-2xl text-xs font-bold transition-all btn-pop ${
                  intent === t
                    ? "bg-cyan-400 text-slate-950 neon-glow"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {t === "buy" ? "Buy" : "Rent"}
              </button>
            ))}
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 focus-within:border-cyan-500/50 transition-colors">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none appearance-none cursor-pointer"
              >
                {BOTSWANA_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc === "All Locations" ? "" : loc} className="bg-slate-900">
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all btn-pop neon-glow-hover"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 text-[11px] text-slate-500 font-medium"
        >
          {["Verified Listings", "Title Deed Ready", "Instant WhatsApp"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-cyan-400" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}