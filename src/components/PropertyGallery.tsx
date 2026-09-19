"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);

  const safeImages =
    images && images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
        ];

  const current = safeImages[Math.min(active, safeImages.length - 1)];

  return (
    <div className="space-y-3">
      <div className="relative h-[320px] md:h-[460px] rounded-2xl overflow-hidden border border-slate-800">
        <Image
          src={current}
          alt={`${title} - photo ${active + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 66vw"
          className="w-full h-full object-cover"
        />
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === active
                  ? "border-cyan-400 opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`${title} thumbnail ${i + 1}`} fill sizes="96px" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}