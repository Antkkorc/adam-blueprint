"use client";

import { useState } from "react";
import { BRAND } from "@/lib/brand";
import { Phone, Mail, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function SellPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState("I want to sell");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Insert property listing request into Supabase table 'enquiries'
    const { error: insertError } = await supabase.from("enquiries").insert([
      {
        name,
        phone,
        email,
        message: `[Intent: ${intent}] ${description}`,
        type: "listing_request",
        created_at: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (insertError) {
      console.error("Supabase error:", insertError.message);
      setError("Failed to submit listing request. Please contact us directly via phone or email.");
    } else {
      setSubmitted(true);
      setName("");
      setPhone("");
      setEmail("");
      setDescription("");
    }
  };

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

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-white font-bold text-lg">Request Received!</h3>
            <p className="text-slate-400 text-xs">
              Thank you for submitting your property details. The {BRAND.name} team will reach out shortly.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-4 text-xs text-emerald-400 hover:underline font-semibold"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <select
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="I want to sell">I want to sell</option>
              <option value="I want to rent out">I want to rent out</option>
            </select>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your property (location, features, desired price)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Listing Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}