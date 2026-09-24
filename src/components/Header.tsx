"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { useTheme, type Theme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import {
  Menu as MenuIcon, X, PhoneCall, User, Home, Building, Tag, Info, LogIn, Heart, LogOut, Shield, Settings, Sun, Moon,
} from "lucide-react";

function NotificationBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex min-w-6 h-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-extrabold text-white shadow-lg shadow-red-950/50" aria-label={`${count} new notifications`}>
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [notificationCounts, setNotificationCounts] = useState({
    propertySubmissions: 0,
    rentalSubmissions: 0,
    unreadEnquiries: 0,
    total: 0,
  });

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

    if (user) checkAdmin();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setIsAdmin(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    let mounted = true;
    const loadNotificationCounts = async () => {
      try {
        const response = await fetch("/api/admin/notifications", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (mounted) setNotificationCounts(data);
      } catch {
        // Notification badges are supplemental; navigation remains available if loading fails.
      }
    };

    void loadNotificationCounts();
    const interval = window.setInterval(loadNotificationCounts, 30000);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [isAdmin]);

  const whatsappNumber = BRAND.whatsapp || BRAND.phone?.replace(/[^0-9]/g, "") || "26774551429";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b15]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="glass-icon flex flex-col items-center justify-center rounded-xl px-2.5 py-1 text-slate-300 hover:text-cyan-300 transition-all focus:outline-none"
              aria-label="Open menu"
            >
              <MenuIcon className="w-5 h-5" />
              <span className="text-[8px] font-extrabold tracking-wider uppercase mt-0.5">Menu</span>
            </button>
            <Link href="/" className="font-extrabold text-xl text-cyan-400 tracking-wider uppercase">
              {BRAND.name}
            </Link>
          </div>
          <div className="hidden md:block" aria-hidden="true" />
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-icon flex items-center gap-2 rounded-full px-3 py-1.5 text-emerald-300 hover:text-emerald-100 transition-all text-xs font-semibold"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <Link
              href={user ? "/saved" : "/login"}
              className="glass-icon flex items-center justify-center rounded-full p-2 text-cyan-300 hover:text-white transition-all"
              aria-label={user ? "Saved properties" : "Login"}
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setIsMenuOpen(false)} />
      )}

      <aside
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0, width: "300px", maxWidth: "85vw",
          backgroundColor: "#050811", zIndex: 60,
          transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "none",
        }}
        className="border-r border-slate-800/80 flex flex-col p-6 overflow-hidden"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between pb-6 mb-2 border-b border-slate-800/80">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="font-extrabold text-2xl text-cyan-400 tracking-wider">
            {BRAND.name}
          </Link>
          <button onClick={() => setIsMenuOpen(false)} className="glass-icon flex items-center justify-center rounded-full p-2 text-cyan-300 hover:text-white transition-colors" aria-label="Close menu">
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
          <Link href="/students" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-3 py-2.5 rounded-xl text-slate-100 hover:text-cyan-400 hover:bg-slate-900/60 transition-all text-base font-semibold">
            <Building className="w-5 h-5 text-cyan-400 shrink-0" /> Student Housing
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
                <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between gap-4 px-3 py-2.5 rounded-xl text-slate-100 hover:text-cyan-400 hover:bg-slate-900/60 transition-all text-base font-semibold">
                  <span className="flex items-center gap-4"><Shield className="w-5 h-5 text-cyan-400 shrink-0" /> Admin Dashboard</span>
                  {notificationCounts.total > 0 && <NotificationBadge count={notificationCounts.total} />}
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
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-900/70 p-1">
              {([
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
            <p className="px-3 pt-2 text-[10px] text-slate-500">Light is the default theme.</p>
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