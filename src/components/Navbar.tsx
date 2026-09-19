"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { supabase } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  Menu as MenuIcon,
  X,
  PhoneCall,
  User,
  Home,
  LogIn,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsMenuOpen(false);
    router.refresh();
  };

  const whatsappNumber = BRAND.phone?.replace(/[^0-9]/g, "") || "26770000000";

  return (
    <>
      {/* Navigation Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b15]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex flex-col items-center justify-center border border-slate-800 bg-slate-900/60 rounded-xl px-2.5 py-1 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all focus:outline-none"
              aria-label="Open menu"
            >
              <MenuIcon className="w-5 h-5" />
              <span className="text-[8px] font-extrabold tracking-wider uppercase mt-0.5">MENU</span>
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
              href={user ? "/admin" : "/login"}
              className="p-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center justify-center"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Dark Overlay Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sideways Drawer Panel */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "320px",
          maxWidth: "85vw",
          backgroundColor: "#070b15",
          zIndex: 60,
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "10px 0 25px rgba(0,0,0,0.5)",
        }}
        className="border-r border-slate-800 flex flex-col p-6 overflow-hidden"
      >
        <div className="flex items-center justify-between pb-6 mb-2 border-b border-slate-800/80">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-xl text-cyan-400 tracking-wider">
            {BRAND.name}
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-grow overflow-y-auto space-y-1 py-4">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-200 hover:text-cyan-400 hover:bg-slate-900 transition-all text-sm font-medium"
          >
            <Home className="w-5 h-5 text-cyan-400" />
            Home
          </Link>

          <Link
            href="/buy"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-200 hover:text-cyan-400 hover:bg-slate-900 transition-all text-sm font-medium"
          >
            <Home className="w-5 h-5 text-cyan-400" />
            Buy Property
          </Link>

          <Link
            href="/rent"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-200 hover:text-cyan-400 hover:bg-slate-900 transition-all text-sm font-medium"
          >
            <Home className="w-5 h-5 text-cyan-400" />
            Rent Property
          </Link>

          <Link
            href="/sell"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-200 hover:text-cyan-400 hover:bg-slate-900 transition-all text-sm font-medium"
          >
            <Home className="w-5 h-5 text-cyan-400" />
            Sell / Valuation
          </Link>

          <Link
            href="/about"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-200 hover:text-cyan-400 hover:bg-slate-900 transition-all text-sm font-medium"
          >
            <Home className="w-5 h-5 text-cyan-400" />
            About Us
          </Link>

          <Link
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-200 hover:text-cyan-400 hover:bg-slate-900 transition-all text-sm font-medium"
          >
            <Home className="w-5 h-5 text-cyan-400" />
            Contact
          </Link>

          {/* Dynamic Menu Auth Items */}
          {!user ? (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-200 hover:text-cyan-400 hover:bg-slate-900 transition-all text-sm font-medium"
            >
              <LogIn className="w-5 h-5 text-cyan-400" />
              Login / Sign Up
            </Link>
          ) : (
            <>
              <Link
                href="/saved"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-200 hover:text-cyan-400 hover:bg-slate-900 transition-all text-sm font-medium"
              >
                <Heart className="w-5 h-5 text-cyan-400" />
                Saved Properties
              </Link>

              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 px-3 py-3 rounded-xl text-slate-200 hover:text-cyan-400 hover:bg-slate-900 transition-all text-sm font-medium"
              >
                <Settings className="w-5 h-5 text-cyan-400" />
                Settings
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full text-left flex items-center gap-4 px-3 py-3 rounded-xl text-slate-200 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
              >
                <LogOut className="w-5 h-5 text-cyan-400" />
                Logout
              </button>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}