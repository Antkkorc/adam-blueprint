"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { BRAND } from "@/lib/brand";
import { AMENITY_OPTIONS, PROPERTY_TYPES } from "@/lib/filters";

export default function AdminPropertyForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [intent, setIntent] = useState<"buy" | "rent">("buy");
  const [type, setType] = useState("House");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [suburb, setSuburb] = useState("");
  const [tenure, setTenure] = useState("Freehold");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState<"total" | "month">("total");
  const [beds, setBeds] = useState("0");
  const [baths, setBaths] = useState("0");
  const [parking, setParking] = useState("0");
  const [plotSize, setPlotSize] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [featured, setFeatured] = useState(false);
  const [verified, setVerified] = useState(true);
  const [titleDeed, setTitleDeed] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);

  const types = PROPERTY_TYPES.filter((item) => item !== "All Types");

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      alert("Please select at least one property image.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("You must be logged in to add properties.");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const imageUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const filePath = `properties/${Date.now()}-${i}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("property-images")
          .getPublicUrl(filePath);

        imageUrls.push(data.publicUrl);
      }

      const { error: insertError } = await supabase.from("properties").insert([
        {
          title,
          description,
          intent,
          type,
          category: type.toLowerCase(),
          location,
          city,
          suburb,
          tenure,
          price: Number(price),
          price_unit: intent === "rent" ? "month" : priceUnit,
          beds: Number(beds),
          baths: Number(baths),
          parking: Number(parking),
          plot_size: plotSize ? Number(plotSize) : 0,
          year_built: yearBuilt ? Number(yearBuilt) : null,
          featured,
          verified,
          title_deed: titleDeed,
          amenities,
          images: imageUrls,
          status: "Available",
          agent: BRAND.owner,
          agent_phone: BRAND.phone,
        },
      ]);

      if (insertError) throw insertError;

      alert("Property added successfully!");

      setTitle("");
      setDescription("");
      setLocation("");
      setCity("");
      setSuburb("");
      setPrice("");
      setPlotSize("");
      setYearBuilt("");
      setAmenities([]);
      setFiles(null);
      router.refresh();
    } catch (error: any) {
      const msg = error?.message || "Unknown error";
      alert(
        "Error adding property:\n" +
          msg +
          "\n\nIf this mentions a bucket or row-level security, run the storage SQL I sent you in chat."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full space-y-4 text-white"
    >
      <h2 className="text-xl font-bold">Add Official Property</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Property Title (e.g. Executive 3 Bedroom Villa)"
          required
          className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          value={intent}
          onChange={(e) => setIntent(e.target.value as "buy" | "rent")}
          className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
        >
          <option value="buy">For Sale (Buy)</option>
          <option value="rent">For Rent</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
        >
          {types.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
          className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
        >
          <option value="Freehold">Freehold</option>
          <option value="Tribal Land">Tribal Land</option>
          <option value="State Land">State Land</option>
          <option value="Lease">Lease</option>
          <option value="Sectional Title">Sectional Title</option>
        </select>
        <input
          type="text"
          placeholder="Location (e.g. Phakalane, Gaborone)"
          required
          className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Suburb"
          className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price (BWP)"
          required
          className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {intent === "buy" && (
          <select
            value={priceUnit}
            onChange={(e) => setPriceUnit(e.target.value as "total" | "month")}
            className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="total">Total Price</option>
            <option value="month">Per Month</option>
          </select>
        )}
        <input
          type="number"
          placeholder="Beds"
          className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
          value={beds}
          onChange={(e) => setBeds(e.target.value)}
        />
        <input
          type="number"
          placeholder="Baths"
          className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
          value={baths}
          onChange={(e) => setBaths(e.target.value)}
        />
        <input
          type="number"
          placeholder="Parking Spaces"
          className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
          value={parking}
          onChange={(e) => setParking(e.target.value)}
        />
        <input
          type="number"
          placeholder="Plot Size (sqm)"
          className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
          value={plotSize}
          onChange={(e) => setPlotSize(e.target.value)}
        />
        <input
          type="number"
          placeholder="Year Built (optional)"
          className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
          value={yearBuilt}
          onChange={(e) => setYearBuilt(e.target.value)}
        />
      </div>

      <textarea
        placeholder="Property description..."
        required
        rows={4}
        className="w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div>
        <p className="text-xs text-slate-400 mb-2">Amenities</p>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((amenity) => {
            const active = amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`text-xs px-3 py-2 rounded-xl border transition-colors ${
                  active
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
          Verified
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={titleDeed} onChange={(e) => setTitleDeed(e.target.checked)} />
          Title Deed
        </label>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        required
        onChange={(e) => setFiles(e.target.files)}
        className="text-sm text-slate-400"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 font-bold rounded-xl text-black disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Add Property"}
      </button>
    </form>
  );
}