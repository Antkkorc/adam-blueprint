"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function RentContent() {
  const searchParams = useSearchParams();
  const propertyType = searchParams.get("type");

  return (
    <div>
      {/* Existing /rent page UI code */}
    </div>
  );
}

export default function RentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading rentals...</div>}>
      <RentContent />
    </Suspense>
  );
}