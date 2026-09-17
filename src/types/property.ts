export type PropertyIntent = "buy" | "rent";

export interface Property {
  id: number;
  created_at?: string;
  title: string;
  description: string;
  overview?: string | null;
  type: string;
  category: string;
  intent: PropertyIntent;
  status: string;
  verified: boolean;
  featured: boolean;
  price: number;
  price_unit: "total" | "month";
  location: string;
  city: string;
  suburb: string;
  plot_number?: string | null;
  tenure: string;
  title_deed: boolean;
  beds: number;
  baths: number;
  parking: number;
  plot_size: number;
  building_sqm?: number | null;
  land_sqm?: number | null;
  year_built: number | null;
  images: string[];
  sketch_plan?: string[] | null;
  latitude?: number | null;
  longitude?: number | null;
  inside_features?: string | null;
  outside_features?: string | null;
  agent: string;
  agent_phone: string;
  amenities: string[];
}