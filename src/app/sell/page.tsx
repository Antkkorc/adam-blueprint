"use client";

import { useState } from "react";
import { BRAND } from "@/lib/brand";
import { Phone, Mail, MapPin, Loader2, CheckCircle2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function SellPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState("I want to sell");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mapMessage, setMapMessage] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [plan, setPlan] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const imageUrls: string[] = [];
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const folder = `${user?.id || "guest"}/${Date.now()}`;
      for (const [index, file] of photos.entries()) {
        const path = `${folder}/${index}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { error } = await supabase.storage.from("property-submissions").upload(path, file);
        if (error) throw error;
        imageUrls.push(supabase.storage.from("property-submissions").getPublicUrl(path).data.publicUrl);
      }
      let planUrl: string | null = null;
      if (plan) {
        const path = `${folder}/house-plan-${plan.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const { error } = await supabase.storage.from("property-submissions").upload(path, plan);
        if (error) throw error;
        planUrl = supabase.storage.from("property-submissions").getPublicUrl(path).data.publicUrl;
      }
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const { error: insertError } = await supabase.from("property_submissions").insert({
        user_id: currentUser?.id || null, name, phone, email, title, location,
        price: price ? Number(price) : null, intent: intent.includes("rent") ? "rent" : "sell",
        description, images: imageUrls, house_plan_url: planUrl,
        latitude: latitude ? Number(latitude) : null, longitude: longitude ? Number(longitude) : null,
      });
      if (insertError) throw insertError;
    } catch (insertError) {
      setLoading(false);
      setError(insertError instanceof Error ? insertError.message : "Failed to submit listing request.");
      return;
    }

    setLoading(false);

    setSubmitted(true);
    setName(""); setPhone(""); setEmail(""); setDescription("");
    setTitle(""); setLocation(""); setPrice(""); setPhotos([]); setPlan(null);
    setLatitude(""); setLongitude(""); setMapMessage("");
  };

  const selectLocation = () => {
    if (!navigator.geolocation) {
      setMapMessage("Location services are not available in this browser.");
      return;
    }
    setMapMessage("Requesting your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(String(position.coords.latitude));
        setLongitude(String(position.coords.longitude));
        setMapMessage("Your location is pinned. Review it before submitting.");
      },
      () => setMapMessage("Location permission was not granted. You can still submit the address."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
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
            <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
              <label className="min-w-0 space-y-1 text-xs text-slate-400">
                Your name
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full min-w-0 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </label>
              <label className="min-w-0 space-y-1 text-xs text-slate-400">
                Phone number
                <input
                  type="tel"
                  required
                  maxLength={30}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full min-w-0 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </label>
              <label className="min-w-0 space-y-1 text-xs text-slate-400">
                Email address
                <input
                  type="email"
                  required
                  maxLength={160}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full min-w-0 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </label>
              <label className="min-w-0 space-y-1 text-xs text-slate-400">
                Listing type
                <select
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  className="w-full min-w-0 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="I want to sell">I want to sell</option>
                  <option value="I want to rent out">I want to rent out</option>
                </select>
              </label>
              <label className="min-w-0 space-y-1 text-xs text-slate-400">
                Property title (optional)
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Family home in Gaborone" className="w-full min-w-0 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600" />
              </label>
              <label className="min-w-0 space-y-1 text-xs text-slate-400">
                Location (optional)
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Town or neighbourhood" className="w-full min-w-0 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600" />
              </label>
              <label className="min-w-0 space-y-1 text-xs text-slate-400 md:col-span-2">
                Expected price in BWP (optional)
                <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Expected price" className="w-full min-w-0 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600" />
              </label>
            </div>
            <textarea
              rows={4}
              required
              minLength={10}
              maxLength={2000}
              aria-label="Property description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your property (location, features, desired price)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-cyan-500/40 bg-slate-950 px-4 py-5 text-center text-xs text-slate-400 transition-colors hover:border-cyan-400">
              <Upload className="h-7 w-7 text-cyan-400" />
              <span className="font-bold text-cyan-300">Click to upload property photos</span>
              <span>Up to 10 images</span>
              <input type="file" accept="image/*" multiple onChange={(e) => setPhotos(Array.from(e.target.files || []).slice(0, 10))} className="sr-only" />
            </label>
            {photos.length > 0 && <div className="flex gap-2 overflow-auto">{photos.map((file) => <img key={file.name} src={URL.createObjectURL(file)} alt={file.name} className="h-16 w-16 rounded object-cover" />)}</div>}
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-cyan-500/40 bg-slate-950 px-4 py-5 text-center text-xs text-slate-400 transition-colors hover:border-cyan-400">
              <Upload className="h-7 w-7 text-cyan-400" />
              <span className="font-bold text-cyan-300">Click to upload house or floor plan</span>
              <span>Optional image or PDF</span>
              <input type="file" accept="image/*,.pdf" onChange={(e) => setPlan(e.target.files?.[0] || null)} className="sr-only" />
            </label>
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs font-bold text-slate-400">Property location on map (optional)</p>
              <button type="button" onClick={selectLocation} className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300 hover:bg-emerald-500/20"><MapPin className="h-4 w-4" /> Select location from map</button>
              {latitude && longitude && <p className="text-xs text-slate-400">Pinned coordinates: {latitude}, {longitude}</p>}
              {mapMessage && <p className="text-xs text-slate-400">{mapMessage}</p>}
            </div>
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