export interface Property {
  id: number;
  title: string;
  description: string;
  type: string;
  category: string;
  intent: "buy" | "rent";
  status: string;
  verified: boolean;
  featured: boolean;
  price: number;
  priceUnit: "total" | "month";
  location: string;
  city: string;
  suburb: string;
  tenure: string;
  titleDeed: boolean;
  beds: number;
  baths: number;
  parking: number;
  plotSize: number;
  yearBuilt: number;
  images: string[];
  agent: string;
  agentPhone: string;
  amenities: string[];
}