"use client";

import Image from "next/image";
import { useState } from "react";

interface RentalPhotoGalleryProps {
  images: string[];
  labels: string[];
  title: string;
}

export default function RentalPhotoGallery({ images, labels, title }: RentalPhotoGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active];
  if (!current) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <Image src={current} alt={`${title} - ${labels[active] || "Rental photo"}`} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
        {labels[active] && <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-bold text-white">{labels[active]}</span>}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((src, index) => (
            <button key={`${src}-${index}`} type="button" onClick={() => setActive(index)} className={`relative aspect-square overflow-hidden rounded-xl border-2 ${active === index ? "border-cyan-400" : "border-slate-800 opacity-70 hover:opacity-100"}`}>
              <Image src={src} alt={`${title} thumbnail ${index + 1}`} fill sizes="25vw" className="object-cover" />
              {labels[index] && <span className="absolute inset-x-0 bottom-0 truncate bg-slate-950/80 px-1 py-1 text-[9px] text-white">{labels[index]}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
