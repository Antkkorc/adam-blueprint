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
  const [overview, setOverview] = useState("");
  const [insideFeatures, setInsideFeatures] = useState("");
  const [outsideFeatures, setOutsideFeatures] = useState("");
  const [intent, setIntent] = useState<"buy" | "rent">("buy");
  const [type, setType] = useState("House");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [suburb, setSuburb] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [tenure, setTenure] = useState("Freehold");
  const [price, setPrice] = useState("");
  const [priceUnit, setPriceUnit] = useState<"total" | "month">("total");
  const [beds, setBeds] = useState("0");
  const [baths, setBaths] = useState("0");
  const [parking, setParking] = useState("0");
  const [buildingSqm, setBuildingSqm] = useState("");
  const [landSqm, setLandSqm] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [agentName, setAgentName] = useState(BRAND.owner);
  const [agentPhone, setAgentPhone] = useState(BRAND.phone);
  const [featured, setFeatured] = useState(false);
  const [verified, setVerified] = useState(true);
  const [titleDeed, setTitleDeed] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [sketchFiles, setSketchFiles] = useState<FileList | null>(null);

  const types = PROPERTY_TYPES.filter((item) => item !== "All Types");

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const uploadFiles = async (
    list: FileList,
    folder: string
  ): Promise<string[]> => {
    const urls: string[] = [];
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const filePath = `${folder}/${Date.now()}-${i}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("property-images")
        .getPublicUrl(filePath);

      urls.push(data.publicUrl);
    }
    return urls;
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
      const imageUrls = await uploadFiles(files, "properties");
      const sketchUrls =
        sketchFiles && sketchFiles.length > 0
          ? await uploadFiles(sketchFiles, "sketches")
          : [];

      const { error: insertError } = await supabase.from("properties").insert([
        {
          title,
          description,
          overview: overview || null,
          inside_features: insideFeatures || null,
          outside_features: outsideFeatures || null,
          intent,
          type,
          category: type.toLowerCase(),
          location,
          city,
          suburb,
          plot_number: plotNumber || null,
          tenure,
          price: Number(price),
          price_unit: intent === "rent" ? "month" : priceUnit,
          beds: Number(beds),
          baths: Number(baths),
          parking: Number(parking),
          building_sqm: buildingSqm ? Number(buildingSqm) : null,
          land_sqm: landSqm ? Number(landSqm) : null,
          plot_size: landSqm ? Number(landSqm) : 0,
          year_built: yearBuilt ? Number(yearBuilt) : null,
          latitude: latitude ? Number(latitude) : null,
          longitude: longitude ? Number(longitude) : null,
          featured,
          verified,
          title_deed: titleDeed,
          amenities,
          images: imageUrls,
          sketch_plan: sketchUrls,
          status: "Available",
          agent: agentName || BRAND.owner,
          agent_phone: agentPhone || BRAND.phone,
        },
      ]);

      if (insertError) throw insertError;

      alert("Property added successfully!");

      setTitle("");
      setDescription("");
      setOverview("");
      setInsideFeatures("");
      setOutsideFeatures("");
      setLocation("");
      setCity("");
      setSuburb("");
      setPlotNumber("");
      setPrice("");
      setBuildingSqm("");
      setLandSqm("");
      setYearBuilt("");
      setLatitude("");
      setLongitude("");
      setAmenities([]);
      setFiles(null);
      setSketchFiles(null);
      router.refresh();
    } catch (error: any) {
      alert("Error adding property:\n" + (error?.message || "Unknown error"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500 text-sm";

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full space-y-5 text-white"
    >
      <h2 className="text-xl font-bold">Add Official Property</h2>

      {/* Basics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Property Title *" required className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
        <select value={intent} onChange={(e) => setIntent(e.target.value as "buy" | "rent")} className={inputClass}>
          <option value="buy">For Sale (Buy)</option>
          <option value="rent">For Rent</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
          {types.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select value={tenure} onChange={(e) => setTenure(e.target.value)} className={inputClass}>
          <option value="Freehold">Freehold</option>
          <option value="Tribal Land">Tribal Land</option>
          <option value="State Land">State Land</option>
          <option value="Lease">Lease</option>
          <option value="Sectional Title">Sectional Title</option>
        </select>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Location (e.g. Phakalane, Gaborone) *" required className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} />
        <input type="text" placeholder="Plot Number (e.g. Plot 4521)" className={inputClass} value={plotNumber} onChange={(e) => setPlotNumber(e.target.value)} />
        <input type="text" placeholder="City" className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} />
        <input type="text" placeholder="Suburb / Ward" className={inputClass} value={suburb} onChange={(e) => setSuburb(e.target.value)} />
        <input type="text" placeholder="Latitude (e.g. -24.6282)" className={inputClass} value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        <input type="text" placeholder="Longitude (e.g. 25.9231)" className={inputClass} value={longitude} onChange={(e) => setLongitude(e.target.value)} />
      </div>
      <p className="text-[10px] text-slate-500 -mt-2">
        💡 Pinned location: open Google Maps → right-click the plot → copy the two numbers (latitude, longitude).
      </p>

      {/* Price + sizes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="number" placeholder="Price (BWP) *" required className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} />
        {intent === "buy" && (
          <select value={priceUnit} onChange={(e) => setPriceUnit(e.target.value as "total" | "month")} className={inputClass}>
            <option value="total">Total Price</option>
            <option value="month">Per Month</option>
          </select>
        )}
        <input type="number" placeholder="Building Size (m² / SQM)" className={inputClass} value={buildingSqm} onChange={(e) => setBuildingSqm(e.target.value)} />
        <input type="number" placeholder="Land Size (m² / SQM)" className={inputClass} value={landSqm} onChange={(e) => setLandSqm(e.target.value)} />
        <input type="number" placeholder="Beds" className={inputClass} value={beds} onChange={(e) => setBeds(e.target.value)} />
        <input type="number" placeholder="Baths" className={inputClass} value={baths} onChange={(e) => setBaths(e.target.value)} />
        <input type="number" placeholder="Parking Spaces" className={inputClass} value={parking} onChange={(e) => setParking(e.target.value)} />
        <input type="number" placeholder="Year Built (optional)" className={inputClass} value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} />
      </div>

      {/* Text sections */}
      <textarea placeholder="Short description (shown on cards) *" required rows={2} className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
      <textarea placeholder="Overview / Summary of the property (detail page)" rows={3} className={inputClass} value={overview} onChange={(e) => setOverview(e.target.value)} />
      <textarea placeholder="INSIDE features — e.g. open-plan kitchen, tiled floors, built-in cupboards, main en-suite..." rows={3} className={inputClass} value={insideFeatures} onChange={(e) => setInsideFeatures(e.target.value)} />
      <textarea placeholder="OUTSIDE features — e.g. double garage, paved yard, borehole, electric fence, mature garden..." rows={3} className={inputClass} value={outsideFeatures} onChange={(e) => setOutsideFeatures(e.target.value)} />

      {/* Amenities */}
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

      {/* Flags */}
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

      {/* Agent / owner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Agent / Owner Name" className={inputClass} value={agentName} onChange={(e) => setAgentName(e.target.value)} />
        <input type="text" placeholder="Agent / Owner Phone" className={inputClass} value={agentPhone} onChange={(e) => setAgentPhone(e.target.value)} />
      </div>

      {/* Uploads */}
      <div className="space-y-2">
        <p className="text-xs text-slate-400">Property Photos * (multiple)</p>
        <input type="file" multiple accept="image/*" required onChange={(e) => setFiles(e.target.files)} className="text-sm text-slate-400" />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-slate-400">Sketch Plan / Floor Plan (optional, multiple)</p>
        <input type="file" multiple accept="image/*" onChange={(e) => setSketchFiles(e.target.files)} className="text-sm text-slate-400" />
      </div>

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