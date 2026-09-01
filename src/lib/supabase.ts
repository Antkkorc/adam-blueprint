import { createClient } from "@supabase/supabase-js";
import { Property } from "@/types/property";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase environment variables are missing! Check your .env.local file.");
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");

export async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching properties:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    category: row.category,
    intent: row.intent,
    status: row.status,
    verified: row.verified,
    featured: row.featured,
    price: row.price,
    priceUnit: row.price_unit,
    location: row.location,
    city: row.city,
    suburb: row.suburb,
    tenure: row.tenure,
    titleDeed: row.title_deed,
    beds: row.beds,
    baths: row.baths,
    parking: row.parking,
    plotSize: row.plot_size,
    yearBuilt: row.year_built,
    images: row.images || [],
    agent: row.agent,
    agentPhone: row.agent_phone,
    amenities: row.amenities || [],
  }));
}