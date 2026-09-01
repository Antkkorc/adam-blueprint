"use client";
import { Phone } from "lucide-react";
import { BRAND } from "@/lib/brand";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${BRAND.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
      aria-label="Contact us on WhatsApp"
    >
      <Phone className="w-6 h-6" />
    </a>
  );
}