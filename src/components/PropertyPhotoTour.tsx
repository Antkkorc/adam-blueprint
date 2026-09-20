"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { parsePhotoLabel, PHOTO_CATEGORIES } from "@/lib/photos";

interface Props {
  images: string[];
  labels: string[];
  title: string;
}

export default function PropertyPhotoTour({ images, labels, title }: Props) {
  const items = images.map((url, i) => ({
    url,
    ...parsePhotoLabel(labels[i] || "Other"),
  }));

  const knownTabs = PHOTO_CATEGORIES.filter((c) =>
    items.some((item) => item.category === c)
  );
  const extraTabs = Array.from(new Set(items.map((i) => i.category))).filter(
    (l) => !PHOTO_CATEGORIES.includes(l)
  );
  const tabs = ["All", ...knownTabs, ...extraTabs];

  const [activeTab, setActiveTab] = useState("All");
  const filtered =
    activeTab === "All" ? items : items.filter((i) => i.category === activeTab);
  const [activeUrl, setActiveUrl] = useState(filtered[0]?.url ?? "");
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const current = filtered.find((i) => i.url === activeUrl) ?? filtered[0];
  const currentIndex = current ? filtered.indexOf(current) : -1;

  const goPrev = () => {
    if (filtered.length === 0) return;
    const idx = (currentIndex - 1 + filtered.length) % filtered.length;
    setActiveUrl(filtered[idx].url);
  };

  const goNext = () => {
    if (filtered.length === 0) return;
    const idx = (currentIndex + 1) % filtered.length;
    setActiveUrl(filtered[idx].url);
  };

  const handleTouchEnd = (endX: number) => {
    if (touchStart === null || filtered.length < 2) return;
    const distance = endX - touchStart;
    if (Math.abs(distance) > 45) {
      if (distance < 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
  };

  if (items.length === 0) {
    return (
      <div className="h-72 rounded-2xl border border-slate-800 bg-slate-900 flex flex-col items-center justify-center gap-2 text-slate-500">
        <Camera className="w-8 h-8" />
        <p className="text-xs">No photos uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              const first =
                tab === "All" ? items[0]                 : items.find((i) => i.category === tab);
              if (first) setActiveUrl(first.url);
            }}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${
              activeTab === tab
                ? "bg-cyan-400 text-slate-950 border-cyan-400"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:border-cyan-400/50 hover:text-cyan-300"
            }`}
          >
            {tab} (
            {tab === "All"
              ? items.length
              : items.filter((i) => i.category === tab).length}
            )
          </button>
        ))}
      </div>

      {/* Main viewer */}
      <div
        className="relative h-[280px] sm:h-[360px] md:h-[420px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 touch-pan-y"
        onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        {current && (
          <>
            <Image
              src={current.url}
              alt={`${title} - ${current.category}${current.description ? ` - ${current.description}` : ""}`}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-extrabold uppercase backdrop-blur-md">
              {current.category}{current.description ? `: ${current.description}` : ""}
            </span>

            {filtered.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 border border-white/20 text-white hover:border-cyan-300 hover:text-cyan-300 backdrop-blur-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/70 border border-white/20 text-white hover:border-cyan-300 hover:text-cyan-300 backdrop-blur-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="absolute bottom-3 right-3 px-2 py-1 rounded-full bg-slate-950/80 text-slate-300 text-[10px] font-bold backdrop-blur-md">
                  {currentIndex + 1} / {filtered.length}
                </span>
              </>
            )}
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filtered.map((item) => (
          <button
            key={item.url}
            type="button"
            onClick={() => setActiveUrl(item.url)}
            className={`relative shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              item.url === activeUrl
                ? "border-cyan-400 opacity-100"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={item.url} alt={`${item.category}${item.description ? ` - ${item.description}` : ""}`} fill sizes="96px" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}