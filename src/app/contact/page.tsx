"use client";

import { useState } from "react";
import { BRAND } from "@/lib/brand";
import { Phone, Mail, MapPin, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Insert contact enquiry into Supabase table 'enquiries'
    const { error: insertError } = await supabase.from("enquiries").insert([
      {
        name,
        email,
        message,
        type: "general_contact",
        created_at: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (insertError) {
      // Fallback message if table isn't set up yet
      console.error("Supabase error:", insertError.message);
      setError("Failed to send message. Please try calling or emailing us directly.");
    } else {
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }
  };

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
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {error}
            </div>
          )}

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-white font-bold text-lg">Message Sent!</h3>
              <p className="text-slate-400 text-xs">
                Thank you for reaching out. The {BRAND.name} team will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs text-emerald-400 hover:underline font-semibold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your Message"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}