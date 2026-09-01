import { BRAND } from "./brand";
import { Property } from "@/types/property";

export const contactPropertyOnWhatsApp = (property: Property) => {
  const message = encodeURIComponent(
    `Hello ${BRAND.name}, I am interested in "${property.title}" in ${property.location}. Please send me more details.`
  );
  window.open(`https://wa.me/${BRAND.whatsapp}?text=${message}`, "_blank");
};

export const contactGeneralOnWhatsApp = () => {
  const message = encodeURIComponent(
    `Hello ${BRAND.name}, I would like to enquire about a property.`
  );
  window.open(`https://wa.me/${BRAND.whatsapp}?text=${message}`, "_blank");
};