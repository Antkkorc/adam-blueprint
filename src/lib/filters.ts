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
  "Pet Friendly",
  "Garden",
  "Flatlet",
  "Retirement",
  "Repossessed",
  "On Show",
  "Security Estate / Cluster",
  "On Auction",
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
  minBeds: number;
  minBaths: number;
  minParking: number;
  minBuildingSqm: number;
  minLandSqm: number;
  amenities: string[];
}

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function sanitizeLike(value: string): string {
  return value.replace(/[%_,()"'\\]/g, " ").trim();
}

export function getLocationSearch(value: string): string {
  return sanitizeLike(value).slice(0, 80);
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
    minBeds: Math.max(0, Number(firstParam(searchParams.minBeds)) || 0),
    minBaths: Math.max(0, Number(firstParam(searchParams.minBaths)) || 0),
    minParking: Math.max(0, Number(firstParam(searchParams.minParking)) || 0),
    minBuildingSqm: Math.max(0, Number(firstParam(searchParams.minBuildingSqm)) || 0),
    minLandSqm: Math.max(0, Number(firstParam(searchParams.minLandSqm)) || 0),
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

  if (filters.minBeds > 0) params.set("minBeds", String(filters.minBeds));
  if (filters.minBaths > 0) params.set("minBaths", String(filters.minBaths));
  if (filters.minParking > 0) params.set("minParking", String(filters.minParking));
  if (filters.minBuildingSqm > 0) params.set("minBuildingSqm", String(filters.minBuildingSqm));
  if (filters.minLandSqm > 0) params.set("minLandSqm", String(filters.minLandSqm));

  filters.amenities.forEach((amenity) => {
    params.append("amenity", amenity);
  });

  const query = params.toString();
  return query ? `?${query}` : "";
}