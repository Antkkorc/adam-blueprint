"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import PropertyCard from "@/components/PropertyCard";
import LocationPicker from "@/components/LocationPicker";
import { Search, ShieldCheck, Award, MessageSquare } from "lucide-react";
import type { Property } from "@/types/property";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [activeTab, setActiveTab] = useState<"buy" | "rent" | "sell" | "students">("buy");
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const metadata = user?.user_metadata as { full_name?: string; name?: string; first_name?: string } | undefined;
  const emailName = user?.email && !user.email.toLowerCase().endsWith("@supabase.co")
    ? user.email.split("@")[0]
    : undefined;
  const accountName = metadata?.first_name || metadata?.full_name || metadata?.name || emailName || "there";
  const firstName = accountName.trim().split(/\s+/)[0];
  useEffect(() => {
    let mounted = true;
    if (!user) {
      return () => { mounted = false; };
    }

    const key = `adam-blueprint-seen-user:${user.id}`;
    queueMicrotask(() => {
      if (mounted) setIsReturningUser(window.localStorage.getItem(key) === "true");
    });
    window.localStorage.setItem(key, "true");
    fetch("/api/admin-check")
      .then((response) => response.json())
      .then((data) => {
        if (mounted) setIsAdmin(!!data.isAdmin);
      })
      .catch(() => {
        if (mounted) setIsAdmin(false);
      })
      .finally(() => {
        if (mounted) setAuthChecked(true);
      });
    return () => { mounted = false; };
  }, [user]);

  useEffect(() => {
    async function loadFeaturedProperties() {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .order("id", { ascending: false })
          .limit(6);

        if (error) {
          console.error("Error fetching properties:", error.message);
        } else {
          setProperties(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedProperties();
  }, []);

  const handleSearch = () => {
    if (activeTab === "sell") {
      router.push("/sell");
      return;
    }
    const q = location ? `?location=${encodeURIComponent(location)}` : "";
    router.push(`/${activeTab}${q}`);
  };

  return (
    <main className="min-h-screen bg-[#070b15] text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          TRUSTED PROPERTY EXPERTS IN BOTSWANA
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          {authLoading ? (
            <span className="text-slate-400">Loading your account...</span>
          ) : user && authChecked ? (
            <>
              {isAdmin ? "Welcome Back Admin" : isReturningUser ? "Welcome back" : "Welcome to Adam Blueprint"}<br />
              <span className="text-cyan-400">{isAdmin ? "" : firstName}</span>
            </>
          ) : (
            <>
              Find Your Perfect <br />
              <span className="text-cyan-400">Property in Botswana</span>
            </>
          )}
        </h1>

        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          Premium homes, plots, and commercial spaces in Gaborone, Maun,
          Francistown & beyond. Verified listings by Segolame Adam.
        </p>

        {/* Location search widget */}
        <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-2xl space-y-4">
          <div className="flex items-center justify-center gap-6 pb-2">
            {(["buy", "rent", "sell", "students"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === "rent") router.push("/rent");
                  if (tab === "students") router.push("/students");
                }}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all capitalize ${
                  activeTab === tab
                    ? "bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {tab === "students" ? "Student Housing" : tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <LocationPicker value={location} onChange={setLocation} />

            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-8 py-2.5 rounded-xl text-xs transition-all"
            >
              <Search className="w-4 h-4" />
              {activeTab === "sell" ? "Valuate / Sell" : "Search"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="text-cyan-400">•</span> Verified Listings
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-cyan-400">•</span> Title Deed Ready
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-cyan-400">•</span> Instant WhatsApp
          </span>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Featured Properties</h2>
            <p className="text-slate-400 text-xs">
              Handpicked premium listings across Botswana
            </p>
          </div>
          <Link href="/buy" className="text-xs font-semibold text-cyan-400 hover:underline">
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm">No properties available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Value Props */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-3">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
          <h3 className="font-bold text-base text-white">Verified Listings</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Every property checked for title deeds and legal ownership verification.
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-3">
          <Award className="w-8 h-8 text-cyan-400" />
          <h3 className="font-bold text-base text-white">Market Expertise</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Deep knowledge of Botswana land tenure, valuations, and commercial spaces.
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl space-y-3">
          <MessageSquare className="w-8 h-8 text-cyan-400" />
          <h3 className="font-bold text-base text-white">WhatsApp First</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Instant inquiries and instant response direct via WhatsApp.
          </p>
        </div>
      </section>
    </main>
  );
}