import { Property } from "@/types/property";

export interface FilterState {
  locationQuery: string;
  selectedType: string;
  keywordQuery: string;
  selectedBeds: string;
  selectedBaths: string;
  minPrice: number;
  maxPrice: number;
  selectedAmenities: string[];
}

export const filterProperties = (
  properties: Property[],
  intent: "buy" | "rent",
  filters: FilterState
): Property[] => {
  return properties.filter((property) => {
    const matchesIntent = property.intent === intent;

    const matchesLocation =
      !filters.locationQuery ||
      filters.locationQuery === "All Locations" ||
      property.location
        .toLowerCase()
        .includes(filters.locationQuery.toLowerCase());

    const matchesType =
      filters.selectedType === "All Types" ||
      property.type.toLowerCase() === filters.selectedType.toLowerCase();

    const matchesKeyword =
      !filters.keywordQuery ||
      property.title.toLowerCase().includes(filters.keywordQuery.toLowerCase()) ||
      property.description
        .toLowerCase()
        .includes(filters.keywordQuery.toLowerCase()) ||
      property.amenities.some((amenity) =>
        amenity.toLowerCase().includes(filters.keywordQuery.toLowerCase())
      );

    const matchesBeds =
      filters.selectedBeds === "Any" ||
      property.beds >= Number(filters.selectedBeds.replace("+", ""));

    const matchesBaths =
      filters.selectedBaths === "Any" ||
      property.baths >= Number(filters.selectedBaths.replace("+", ""));

    const matchesPrice =
      property.price >= filters.minPrice && property.price <= filters.maxPrice;

    const matchesAmenities = filters.selectedAmenities.every((amenity) =>
      property.amenities.includes(amenity)
    );

    return (
      matchesIntent &&
      matchesLocation &&
      matchesType &&
      matchesKeyword &&
      matchesBeds &&
      matchesBaths &&
      matchesPrice &&
      matchesAmenities
    );
  });
};