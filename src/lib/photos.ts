export const PHOTO_CATEGORIES = [
  "Front / Outside",
  "Backyard",
  "Living / Inside",
  "Kitchen",
  "Bathroom",
  "Bedroom",
  "Garage / Parking",
  "Other",
];

export interface PhotoLabel {
  category: string;
  description: string;
}

export function parsePhotoLabel(value: string): PhotoLabel {
  const separator = value.indexOf(" | ");
  if (separator === -1) return { category: value || "Other", description: "" };
  return {
    category: value.slice(0, separator),
    description: value.slice(separator + 3),
  };
}

export function formatPhotoLabel(category: string, description: string): string {
  const cleanDescription = description.trim();
  return cleanDescription ? `${category} | ${cleanDescription}` : category;
}