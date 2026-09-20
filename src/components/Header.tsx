"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { BRAND } from "@/lib/brand";
import { useTheme, type Theme } from "@/context/ThemeContext";
import {
  Menu as MenuIcon, X, PhoneCall, User, Home, Building, Tag, Info, LogIn, Heart, LogOut, Shield, Settings, Sun, Moon, Sparkles,
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    let mounted = true;

    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/admin-check");
        const data = await res.json();
        if (mounted) setIsAdmin(!!data.isAdmin);
      } catch {
        if (mounted) setIsAdmin(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session) checkAdmin();
      else setIsAdmin(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session) checkAdmin();
      else setIsAdmin(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setIsMenuOpen(false);
    router.refresh();
  };

  const whatsappNumber = BRAND.whatsapp || BRAND.phone?.replace(/[^0-9]/g, "") || "26774551429";
  const metadata = user?.user_metadata as { full_name?: string; name?: string; first_name?: string } | undefined;
  const accountName = metadata?.first_name || metadata?.full_name || metadata?.name || user?.email?.split("@")[0] || "there";
  const firstName = accountName.trim().split(/\s+/)[0];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b15]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex flex-col items-center justify-center border border-slate-800 bg-slate-900/60 rounded-xl px-2.5 py-1 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all focus:outline-none"
              aria-label="Open menu"
            >
              <MenuIcon className="w-5 h-5" />
              <span className="text-[8px] font-extrabold tracking-wider uppercase mt-0.5">Menu</span>
            </button>
            <Link href="/" className="font-extrabold text-xl text-cyan-400 tracking-wider uppercase">
              {BRAND.name}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all text-xs font-semibold"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <Link
              href={user ? "/saved" : "/login"}
              className="p-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center justify-center"
              aria-label={user ? "Saved properties" : "Login"}
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>
      {user && (
        <div className="border-b border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-center text-sm font-semibold text-cyan-200">
          Welcome to Adam Blueprint, {firstName}
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsMenuOpen(false)} />
      )}

      <aside
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0, width: "300px", maxWidth: "85vw",
          backgroundColor: "#050811", zIndex: 60,
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "10px 0 25px rgba(0,0,0,0.6)",
        }}
        className="border-r border-slate-800/80 flex flex-col p-6 overflow-hidden"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between pb-6 mb-2 border-b border-slate-800/80">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-2xl text-cyan-400 tracking-wider">
            {BRAND.name}
          </Link>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition-colors" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="grow overflow-y-auto space-y-2 py-4">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-100 hover:text-cyan-400 hover:bg-slate-900/60 transition-all text-base font-semibold">
            <Home className="w-5 h-5 text-cyan-400 shrink-0" /> Home
          </Link>
          <Link href="/buy" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-100 hover:text-cyan-400 hover:bg-slate-900/60 transition-all text-base font-semibold">
            <Building className="w-5 h-5 text-cyan-400 shrink-0" /> Buy Property
          </Link>
          <Link href="/rent" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-100 hover:text-cyan-400 hover:bg-slate-900/60 transition-all text-base font-semibold">
            <Building className="w-5 h-5 text-cyan-400 shrink-0" /> Rent Property
          </Link>
          <Link href="/sell" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-100 hover:text-cyan-400 hover:bg-slate-900/60 transition-all text-base font-semibold">
            <Tag className="w-5 h-5 text-cyan-400 shrink-0" /> Sell / Valuation
          </Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-100 hover:text-cyan-400 hover:bg-slate-900/60 transition-all text-base font-semibold">
            <Info className="w-5 h-5 text-cyan-400 shrink-0" /> About Us
          </Link>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-100 hover:text-cyan-400 hover:bg-slate-900/60 transition-all text-base font-semibold">
            <PhoneCall className="w-5 h-5 text-cyan-400 shrink-0" /> Contact
          </Link>

          {user && (
            <>
              <Link href="/saved" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-100 hover:text-cyan-400 hover:bg-slate-900/60 transition-all text-base font-semibold">
                <Heart className="w-5 h-5 text-cyan-400 shrink-0" /> Saved Properties
              </Link>
              
              {/* 🔐 ADMIN LINK — ONLY SHOWS IF API CONFIRMS YOU ARE ADMIN */}
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-100 hover:text-cyan-400 hover:bg-slate-900/60 transition-all text-base font-semibold">
                  <Shield className="w-5 h-5 text-cyan-400 shrink-0" /> Admin
                </Link>
              )}

              <button onClick={handleSignOut} className="w-full text-left flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-100 hover:text-red-400 hover:bg-red-500/10 transition-all text-base font-semibold">
                <LogOut className="w-5 h-5 text-cyan-400 shrink-0" /> Logout
              </button>
            </>
          )}

          <div className="mt-4 border-t border-slate-800/80 pt-4">
            <div className="mb-2 flex items-center gap-2 px-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Settings className="h-4 w-4" /> Display
            </div>
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-900/70 p-1">
              {([
                ["neon", "Neon", Sparkles],
                ["light", "Light", Sun],
                ["dark", "Dark", Moon],
              ] as const).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value as Theme)}
                  aria-pressed={theme === value}
                  className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[10px] font-bold transition-colors ${
                    theme === value ? "bg-cyan-400 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
            <p className="px-3 pt-2 text-[10px] text-slate-500">Neon is the default theme.</p>
          </div>

          {user === null && (
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-100 hover:text-cyan-400 hover:bg-slate-900/60 transition-all text-base font-semibold">
              <LogIn className="w-5 h-5 text-cyan-400 shrink-0" /> Login / Sign Up
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
}