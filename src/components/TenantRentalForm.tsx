"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import { MapPin, Search, Upload, X } from "lucide-react";
import { formatPhotoLabel, PHOTO_CATEGORIES } from "@/lib/photos";

interface RentalPhoto {
  id: string;
  file: File;
  preview: string;
  category: string;
  description: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const value = error as {
      message?: unknown;
      error_description?: unknown;
      details?: unknown;
      hint?: unknown;
      code?: unknown;
    };
    const message = [value.message, value.error_description, value.details, value.hint]
      .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
      .join(" ");
    const code = typeof value.code === "string" ? ` (code: ${value.code})` : "";
    if (message) return `${message}${code}`;
  }
  return "Unable to submit rental listing. Please try again.";
}

export default function TenantRentalForm({ adminMode = false }: { adminMode?: boolean }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [photos, setPhotos] = useState<RentalPhoto[]>([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mapLoading, setMapLoading] = useState(false);
  const [mapMessage, setMapMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const addPhotos = (list: FileList | null) => {
    if (!list) return;
    setPhotos((current) => [
      ...current,
      ...Array.from(list).map((file, index) => ({
        id: `${Date.now()}-${index}-${file.name}`,
        file,
        preview: URL.createObjectURL(file),
        category: PHOTO_CATEGORIES[0],
        description: "",
      })),
    ]);
  };

  const updatePhoto = (id: string, changes: Partial<RentalPhoto>) => {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, ...changes } : photo));
  };

  const removePhoto = (id: string) => {
    setPhotos((current) => {
      const photo = current.find((item) => item.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return current.filter((item) => item.id !== id);
    });
  };

  const findCoordinates = async () => {
    if (!location.trim()) {
      setMapMessage("Enter a location first.");
      return;
    }
    setMapLoading(true);
    setMapMessage("");
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=bw&q=${encodeURIComponent(`${location}, Botswana`)}`
      );
      if (!response.ok) throw new Error("Location lookup failed.");
      const results = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>;
      if (!results[0]) {
        setMapMessage("No Botswana location found. Try a nearby city or suburb.");
      } else {
        setLatitude(results[0].lat);
        setLongitude(results[0].lon);
        setMapMessage(`Pinned: ${results[0].display_name}`);
      }
    } catch (error) {
      setMapMessage(error instanceof Error ? error.message : "Location lookup failed.");
    } finally {
      setMapLoading(false);
    }
  };

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
    const uploadedPaths: string[] = [];

    try {
      const imageUrls: string[] = [];
      const imageLabels: string[] = [];

      if (photos.length > 8) throw new Error("Please upload no more than 8 images.");
      for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];
          const file = photo.file;
          if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
            throw new Error("Each image must be an image file smaller than 5 MB.");
          }
          const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
          const filePath = `submissions/${session.user.id}/${Date.now()}-${i}-${safeName}`;

          const { error: uploadError } = await supabase.storage
            .from("rental-images")
            .upload(filePath, file);

          if (uploadError) {
            throw uploadError;
          }
          uploadedPaths.push(filePath);

          const { data } = supabase.storage
            .from("rental-images")
            .getPublicUrl(filePath);

          imageUrls.push(data.publicUrl);
          imageLabels.push(formatPhotoLabel(photo.category, photo.description));
      }

      const listing = {
        title,
        location,
        price: Number(price),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        description,
        info: description,
        image_labels: imageLabels,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        tenant_name: contactName,
        contact_number: contactPhone,
        images: imageUrls,
        user_id: session.user.id,
      };
      if (adminMode) {
        const response = await fetch("/api/admin/rentals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listing),
        });
        const result = await response.json() as { error?: string };
        if (!response.ok) throw new Error(result.error || "Unable to publish rental.");
      } else {
        const { error } = await supabase.from("rental_submissions").insert([{
          title, location, price: Number(price), bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms), description, image_labels: imageLabels,
          latitude: latitude ? Number(latitude) : null, longitude: longitude ? Number(longitude) : null,
          contact_name: contactName, contact_number: contactPhone,
          images: imageUrls, user_id: session.user.id,
        }]);
        if (error) throw error;
      }

      setSubmitted(true);
      if (adminMode) router.push("/rent");
      router.refresh();
    } catch (error) {
      if (uploadedPaths.length > 0) {
        const { error: cleanupError } = await supabase.storage
          .from("rental-images")
          .remove(uploadedPaths);
        if (cleanupError) {
          console.error("Unable to clean up rental uploads after submission failure:", cleanupError);
        }
      }
      setError(getErrorMessage(error));
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
      <h2 className="text-xl font-bold">{adminMode ? "Publish Verified Rental" : "Submit Rental for Review"}</h2>
      {!adminMode && <p className="text-xs text-slate-400">Your submission will be reviewed before it appears publicly. Do not submit sensitive documents or private information.</p>}
      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
      {submitted && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">{adminMode ? "Rental published successfully." : "Rental submitted for admin review."}</p>}

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
        type="number"
        placeholder="Number of Bedrooms"
        required
        min={1}
        max={100}
        aria-label="Number of bedrooms"
        className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
        value={bedrooms}
        onChange={(e) => setBedrooms(e.target.value)}
      />

      <input
        type="number"
        placeholder="Number of Bathrooms"
        required
        min={1}
        max={100}
        aria-label="Number of bathrooms"
        className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
        value={bathrooms}
        onChange={(e) => setBathrooms(e.target.value)}
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

      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-400">Rental Photos — preview and label each photo</p>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-cyan-500/40 bg-slate-950 py-5 hover:border-cyan-400">
          <Upload className="h-6 w-6 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-300">Click to add photos</span>
          <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} />
        </label>
        {photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="relative space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-2">
                <Image src={photo.preview} alt="Rental photo preview" width={320} height={180} unoptimized className="h-32 w-full rounded-lg object-cover" />
                <select value={photo.category} onChange={(e) => updatePhoto(photo.id, { category: e.target.value })} className="w-full rounded-lg bg-slate-800 px-2 py-1.5 text-xs">
                  {PHOTO_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                </select>
                <input value={photo.description} onChange={(e) => updatePhoto(photo.id, { description: e.target.value })} maxLength={120} placeholder="Label, e.g. Main entrance" className="w-full rounded-lg bg-slate-800 px-2 py-1.5 text-xs" />
                <button type="button" onClick={() => removePhoto(photo.id)} aria-label="Remove photo" className="absolute right-3 top-3 rounded-full bg-red-500 p-1 text-white"><X className="h-3 w-3" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-400">Rental Location on Map (optional)</p>
        <div className="flex gap-2">
          <input value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Latitude" aria-label="Rental latitude" className="w-full rounded-xl bg-slate-800 p-3 text-sm" />
          <input value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Longitude" aria-label="Rental longitude" className="w-full rounded-xl bg-slate-800 p-3 text-sm" />
        </div>
        <button type="button" onClick={findCoordinates} disabled={mapLoading} className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 px-3 py-2 text-xs font-bold text-cyan-300 disabled:opacity-50">
          {mapLoading ? <Search className="h-3.5 w-3.5 animate-pulse" /> : <MapPin className="h-3.5 w-3.5" />}
          {mapLoading ? "Finding location..." : "Find pin from address"}
        </button>
        {mapMessage && <p className="text-[11px] text-slate-400">{mapMessage}</p>}
      </div>

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