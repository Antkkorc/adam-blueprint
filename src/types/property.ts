export type PropertyIntent = "buy" | "rent";

export interface Property {
  id: number;
  created_at?: string;
  title: string;
  description: string;
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
  tenure: string;
  title_deed: boolean;
  beds: number;
  baths: number;
  parking: number;
  plot_size: number;
  year_built: number | null;
  images: string[];
  agent: string;
  agent_phone: string;
  amenities: string[];
}