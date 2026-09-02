"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function BuyContent() {
  const searchParams = useSearchParams();
  const propertyType = searchParams.get("type");

  return (
    <div>
      {/* Existing page UI code */}
    </div>
  );
}

export default function BuyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading listings...</div>}>
      <BuyContent />
    </Suspense>
  );
}