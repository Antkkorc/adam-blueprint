"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { BRAND } from "@/lib/brand";
import { AMENITY_OPTIONS, PROPERTY_TYPES } from "@/lib/filters";
import { PHOTO_CATEGORIES } from "@/lib/photos";

interface PhotoItem {
  id: string;
  file: File;
  preview: string;
  label: string;
}

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
  const [verified, setVerified] = useState(true); // FIXED TYPO HERE
  const [titleDeed, setTitleDeed] = useState(false);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [sketchFiles, setSketchFiles] = useState<FileList | null>(null);

  const types = PROPERTY_TYPES.filter((item) => item !== "All Types");

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]
    );
  };

  const addPhotos = (list: FileList | null) => {
    if (!list) return;
    const next: PhotoItem[] = Array.from(list).map((file, i) => ({
      id: `${Date.now()}-${i}-${file.name}`,
      file,
      preview: URL.createObjectURL(file),
      label: PHOTO_CATEGORIES[0],
    }));
    setPhotos((prev) => [...prev, ...next]);
  };

  const updatePhotoLabel = (id: string, label: string) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, label } : p)));
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const uploadFiles = async (list: FileList, folder: string): Promise<string[]> => {
    const urls: string[] = [];
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const filePath = `${folder}/${Date.now()}-${i}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("property-images").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("property-images").getPublicUrl(filePath);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length === 0) {
      alert("Please add at least one property photo.");
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert("You must be logged in to add properties.");
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const imageUrls: string[] = [];
      const imageLabels: string[] = [];
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const safeName = photo.file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const filePath = `properties/${Date.now()}-${i}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from("property-images").upload(filePath, photo.file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("property-images").getPublicUrl(filePath);
        imageUrls.push(data.publicUrl);
        imageLabels.push(photo.label);
      }
      const sketchUrls = sketchFiles && sketchFiles.length > 0 ? await uploadFiles(sketchFiles, "sketches") : [];
      
      const { error: insertError } = await supabase.from("properties").insert([{
        title, description,
        overview: overview || null,
        inside_features: insideFeatures || null,
        outside_features: outsideFeatures || null,
        intent, type, category: type.toLowerCase(),
        location, city, suburb,
        plot_number: plotNumber || null, tenure,
        price: Number(price), price_unit: intent === "rent" ? "month" : priceUnit,
        beds: Number(beds), baths: Number(baths), parking: Number(parking),
        building_sqm: buildingSqm ? Number(buildingSqm) : null,
        land_sqm: landSqm ? Number(landSqm) : null,
        plot_size: landSqm ? Number(landSqm) : 0,
        year_built: yearBuilt ? Number(yearBuilt) : null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        featured, verified, title_deed: titleDeed,
        amenities, images: imageUrls, image_labels: imageLabels, sketch_plan: sketchUrls,
        status: "Available",
        agent: agentName || BRAND.owner,
        agent_phone: agentPhone || BRAND.phone,
      }]);
      if (insertError) throw insertError;
      alert("Property added successfully!");
      setTitle(""); setDescription(""); setOverview(""); setInsideFeatures(""); setOutsideFeatures("");
      setLocation(""); setCity(""); setSuburb(""); setPlotNumber(""); setPrice("");
      setBuildingSqm(""); setLandSqm(""); setYearBuilt(""); setLatitude(""); setLongitude("");
      setAmenities([]); setPhotos([]); setSketchFiles(null);
      router.refresh();
    } catch (error: any) {
      alert("Error adding property:\n" + (error?.message || "Unknown error"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3 bg-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500 text-sm";

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full space-y-5 text-white">
      <h2 className="text-xl font-bold">Add Official Property</h2>
      <div className="space-y-3">
        <p className="text-xs text-slate-400 font-bold">Property Photos * — pick many at once, then tag each photo below</p>
        <label className="flex flex-col items-center gap-2 py-6 border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-xl cursor-pointer bg-slate-950 transition-colors">
          <Upload className="w-6 h-6 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-300">Click to add photos</span>
          <span className="text-[10px] text-slate-500 text-center px-4">Kitchen, bathroom, garage... select them all at once, then choose a category</span>
          <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} />
        </label>
        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-2 space-y-2">
                <img src={photo.preview} alt="preview" className="w-full h-28 object-cover rounded-lg" />
                <select value={photo.label} onChange={(e) => updatePhotoLabel(photo.id, e.target.value)} className="w-full text-[10px] bg-slate-800 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-cyan-500">
                  {PHOTO_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <button type="button" onClick={() => removePhoto(photo.id)} className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500/90 hover:bg-red-500 text-white"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Property Title *" required className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
        <select value={intent} onChange={(e) => setIntent(e.target.value as "buy" | "rent")} className={inputClass}><option value="buy">For Sale (Buy)</option><option value="rent">For Rent</option></select>
        <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>{types.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <select value={tenure} onChange={(e) => setTenure(e.target.value)} className={inputClass}><option value="Freehold">Freehold</option><option value="Tribal Land">Tribal Land</option><option value="State Land">State Land</option><option value="Lease">Lease</option><option value="Sectional Title">Sectional Title</option></select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Location *" required className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} />
        <input type="text" placeholder="Plot Number" className={inputClass} value={plotNumber} onChange={(e) => setPlotNumber(e.target.value)} />
        <input type="text" placeholder="City" className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} />
        <input type="text" placeholder="Suburb / Ward" className={inputClass} value={suburb} onChange={(e) => setSuburb(e.target.value)} />
        <input type="text" placeholder="Latitude" className={inputClass} value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        <input type="text" placeholder="Longitude" className={inputClass} value={longitude} onChange={(e) => setLongitude(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="number" placeholder="Price (BWP) *" required className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} />
        {intent === "buy" && <select value={priceUnit} onChange={(e) => setPriceUnit(e.target.value as "total" | "month")} className={inputClass}><option value="total">Total Price</option><option value="month">Per Month</option></select>}
        <input type="number" placeholder="Building Size (m²)" className={inputClass} value={buildingSqm} onChange={(e) => setBuildingSqm(e.target.value)} />
        <input type="number" placeholder="Land Size (m²)" className={inputClass} value={landSqm} onChange={(e) => setLandSqm(e.target.value)} />
        <input type="number" placeholder="Beds" className={inputClass} value={beds} onChange={(e) => setBeds(e.target.value)} />
        <input type="number" placeholder="Baths" className={inputClass} value={baths} onChange={(e) => setBaths(e.target.value)} />
        <input type="number" placeholder="Parking" className={inputClass} value={parking} onChange={(e) => setParking(e.target.value)} />
        <input type="number" placeholder="Year Built" className={inputClass} value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} />
      </div>
      <textarea placeholder="Short description *" required rows={2} className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
      <textarea placeholder="Overview" rows={3} className={inputClass} value={overview} onChange={(e) => setOverview(e.target.value)} />
      <textarea placeholder="INSIDE features" rows={3} className={inputClass} value={insideFeatures} onChange={(e) => setInsideFeatures(e.target.value)} />
      <textarea placeholder="OUTSIDE features" rows={3} className={inputClass} value={outsideFeatures} onChange={(e) => setOutsideFeatures(e.target.value)} />
      <div className="flex flex-wrap gap-2">{AMENITY_OPTIONS.map((amenity) => <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)} className={`text-xs px-3 py-2 rounded-xl border ${amenities.includes(amenity) ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" : "bg-slate-950 border-slate-800 text-slate-400"}`}>{amenity}</button>)}</div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Featured</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} /> Verified</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={titleDeed} onChange={(e) => setTitleDeed(e.target.checked)} /> Title Deed</label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Agent Name" className={inputClass} value={agentName} onChange={(e) => setAgentName(e.target.value)} />
        <input type="text" placeholder="Agent Phone" className={inputClass} value={agentPhone} onChange={(e) => setAgentPhone(e.target.value)} />
      </div>
      <input type="file" multiple accept="image/*" onChange={(e) => setSketchFiles(e.target.files)} className="text-sm text-slate-400" />
      <button type="submit" disabled={loading} className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 font-bold rounded-xl text-black disabled:opacity-50">{loading ? "Publishing..." : "Add Property"}</button>
    </form>
  );
}