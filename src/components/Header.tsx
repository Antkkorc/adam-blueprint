"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, User, Phone, LogOut, Heart, Settings } from "lucide-react";
import { BRAND } from "@/lib/brand";

const links = [
  { href: "/", label: "Home" },
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/sell", label: "Sell" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const sideLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/buy", label: "Buy Property", icon: Home },
  { href: "/rent", label: "Rent Property", icon: Home },
  { href: "/sell", label: "Sell / Valuation", icon: Home },
  { href: "/about", label: "About Us", icon: Home },
  { href: "/contact", label: "Contact", icon: Home },
  { href: "/login", label: "Login / Sign Up", icon: User },
  { href: "#", label: "Saved Properties", icon: Heart },
  { href: "#", label: "Settings", icon: Settings },
  { href: "#", label: "Logout", icon: LogOut },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex flex-col items-center gap-0.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 transition-all btn-pop"
            >
              <Menu className="w-5 h-5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Menu</span>
            </button>
            <Link href="/" className="text-xl md:text-2xl font-black tracking-tight text-gradient">
              {BRAND.name.toUpperCase()}
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-5 py-2 rounded-full text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all btn-pop"
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp
            </a>
            <Link
              href="/login"
              className="p-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all btn-pop"
              title="Login / Sign Up"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-80 glass-strong border-r border-white/10 p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                <span className="text-xl font-black text-gradient">{BRAND.name}</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 flex-1">
                {sideLinks.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-white/5 transition-all"
                    >
                      <item.icon className="w-4 h-4 text-cyan-500/60" />
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="pt-4 border-t border-white/5 text-center">
                <p className="text-[10px] text-slate-600">
                  © {new Date().getFullYear()} {BRAND.legalName}
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}