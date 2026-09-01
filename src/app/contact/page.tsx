import { BRAND } from "@/lib/brand";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-white font-bold text-3xl mb-6">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <p className="text-slate-400 text-sm">
            Have a question about a property? Want to list your home? Reach out
            to our team and we will respond as soon as possible.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Phone</p>
                <p className="text-slate-400 text-sm">{BRAND.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Email</p>
                <p className="text-slate-400 text-sm">{BRAND.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Our Locations</p>
                <p className="text-slate-400 text-sm">
                  Gaborone, Francistown, Maun
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <textarea
              rows={4}
              placeholder="Your Message"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}