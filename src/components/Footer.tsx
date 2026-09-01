import { BRAND } from "@/lib/brand";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 pt-12 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-400">
          <div className="space-y-3">
            <span className="text-lg font-black text-gradient">
              {BRAND.name.toUpperCase()}
            </span>
            <p className="text-slate-500 leading-relaxed">
              Premium real estate by Segolame Adam. Houses, plots, and commercial properties across Botswana.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/buy" className="hover:text-cyan-400 transition-colors">Buy Property</Link></li>
              <li><Link href="/rent" className="hover:text-cyan-400 transition-colors">Rent Property</Link></li>
              <li><Link href="/sell" className="hover:text-cyan-400 transition-colors">Sell / Valuation</Link></li>
              <li><Link href="/about" className="hover:text-cyan-400 transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-cyan-400" />{BRAND.phone}</li>
              <li className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-cyan-400" />{BRAND.email}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Locations</h4>
            <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-cyan-400" />Gaborone • Francistown • Maun</p>
          </div>
        </div>
        <div className="text-center text-[11px] text-slate-600 pt-4 border-t border-white/5">
          © {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}