export const AMENITY_OPTIONS = [
  "Swimming Pool",
  "Fibre WiFi",
  "Router WiFi",
  "Garage",
  "Borehole",
  "Solar Backup",
  "Electric Fence / Security",
  "Boundary Wall",
  "Gated Community",
  "Air Conditioning",
];

export const PROPERTY_TYPES = [
  "All Types",
  "House",
  "Apartment",
  "Land",
  "Office",
  "Commercial",
  "Warehouse",
];

export interface PropertyFiltersState {
  location: string;
  minPrice: number;
  maxPrice: number;
  type: string;
  amenities: string[];
}

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function sanitizeLike(value: string): string {
  return value.replace(/[%_,()"'\\]/g, " ").trim();
}

export function parseFilters(
  searchParams: Record<string, string | string[] | undefined>
): PropertyFiltersState {
  const rawAmenities = searchParams.amenity;

  const amenities = Array.isArray(rawAmenities)
    ? rawAmenities
    : rawAmenities
      ? [rawAmenities]
      : [];

  return {
    location: firstParam(searchParams.location),
    minPrice: Math.max(0, Number(firstParam(searchParams.minPrice)) || 0),
    maxPrice: Math.max(0, Number(firstParam(searchParams.maxPrice)) || 0),
    type: firstParam(searchParams.type) || "All Types",
    amenities: amenities.filter((amenity) =>
      AMENITY_OPTIONS.includes(amenity)
    ),
  };
}

export function buildFilterQuery(filters: PropertyFiltersState): string {
  const params = new URLSearchParams();

  if (filters.location) {
    params.set("location", filters.location);
  }

  if (filters.minPrice > 0) {
    params.set("minPrice", String(filters.minPrice));
  }

  if (filters.maxPrice > 0) {
    params.set("maxPrice", String(filters.maxPrice));
  }

  if (filters.type && filters.type !== "All Types") {
    params.set("type", filters.type);
  }

  filters.amenities.forEach((amenity) => {
    params.append("amenity", amenity);
  });

  const query = params.toString();
  return query ? `?${query}` : "";
}