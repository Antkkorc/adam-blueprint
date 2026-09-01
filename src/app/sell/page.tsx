import { BRAND } from "@/lib/brand";
import { Phone, Mail, MapPin } from "lucide-react";

export default function SellPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-white font-bold text-2xl mb-4">List Your Property</h1>
        <p className="text-slate-400 text-sm mb-8">
          Ready to sell or rent out your property? Contact us and our team will
          help you list it and find the right buyer or tenant.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <Phone className="w-4 h-4 text-emerald-500" />
            {BRAND.phone}
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <Mail className="w-4 h-4 text-emerald-500" />
            {BRAND.email}
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <MapPin className="w-4 h-4 text-emerald-500" />
            Gaborone, Botswana
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
            <option>I want to sell</option>
            <option>I want to rent out</option>
          </select>
          <textarea
            rows={4}
            placeholder="Tell us about your property..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            Submit Listing Request
          </button>
        </form>
      </div>
    </div>
  );
}