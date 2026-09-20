"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function TenantRentalForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setError("You must be logged in to list a rental space.");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const imageUrls: string[] = [];

      if (files && files.length > 0) {
        if (files.length > 8) throw new Error("Please upload no more than 8 images.");
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
            throw new Error("Each image must be an image file smaller than 5 MB.");
          }
          const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
          const filePath = `rentals/${Date.now()}-${i}-${safeName}`;

          const { error: uploadError } = await supabase.storage
            .from("rental-images")
            .upload(filePath, file);

          if (uploadError) {
            throw uploadError;
          }

          const { data } = supabase.storage
            .from("rental-images")
            .getPublicUrl(filePath);

          imageUrls.push(data.publicUrl);
        }
      }

      const { error } = await supabase.from("tenant_rentals").insert([
        {
          title,
          location,
          price: Number(price),
          description,
          contact_name: contactName,
          contact_phone: contactPhone,
          images: imageUrls,
          user_id: session.user.id,
        },
      ]);

      if (error) {
        throw error;
      }

      setSubmitted(true);
      router.push("/rent");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit rental listing.";
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full space-y-4 text-white"
    >
      <h2 className="text-xl font-bold">List Your Rental Space</h2>
      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
      {submitted && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">Rental submitted successfully.</p>}

      <input
        type="text"
        placeholder="Title (e.g. 2 Bedroom Flat in Block 6)"
        required
        minLength={5}
        maxLength={120}
        aria-label="Rental title"
        className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Location"
        required
        maxLength={120}
        aria-label="Rental location"
        className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        type="number"
        placeholder="Monthly Price (BWP)"
        required
        min={1}
        aria-label="Monthly price"
        className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="text"
        placeholder="Your Name"
        required
        minLength={2}
        maxLength={80}
        aria-label="Contact name"
        className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
      />

      <input
        type="tel"
        placeholder="Your Phone Number"
        required
        maxLength={30}
        aria-label="Contact phone number"
        className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
        value={contactPhone}
        onChange={(e) => setContactPhone(e.target.value)}
      />

      <textarea
        placeholder="Describe the rental space..."
        required
        minLength={10}
        maxLength={2000}
        aria-label="Rental description"
        rows={4}
        className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        multiple
        accept="image/*"
        aria-label="Rental photos"
        onChange={(e) => setFiles(e.target.files)}
        className="text-sm text-slate-400"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 font-bold rounded-xl text-black disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Rental"}
      </button>
    </form>
  );
}