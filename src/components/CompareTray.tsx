"use client";

import Link from "next/link";
import { ArrowRight, GitCompare, X } from "lucide-react";
import { useCompare } from "@/context/CompareContext";

export default function CompareTray() {
  const { selectedIds, clear } = useCompare();
  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed inset-x-3 bottom-4 z-40 mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl border border-cyan-400/40 bg-slate-950/95 p-3 text-white shadow-2xl backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-2">
        <GitCompare className="h-5 w-5 shrink-0 text-cyan-300" />
        <span className="text-xs font-semibold">
          {selectedIds.length}/3 selected for comparison
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={clear} aria-label="Clear comparison" className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white">
          <X className="h-4 w-4" />
        </button>
        <Link href={`/compare?ids=${selectedIds.join(",")}`} className="inline-flex items-center gap-1 rounded-xl bg-cyan-400 px-3 py-2 text-xs font-extrabold text-slate-950 hover:bg-cyan-300">
          Compare <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
