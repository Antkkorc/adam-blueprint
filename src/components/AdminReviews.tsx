"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Review { id: number; author_name: string; rating: number; comment: string; status: string; created_at: string }

export default function AdminReviews({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  async function update(id: number, status: "approved" | "rejected") {
    const response = await fetch("/api/admin/reviews", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (!response.ok) return;
    setReviews((current) => current.map((review) => review.id === id ? { ...review, status } : review));
  }
  return <div className="space-y-4">{reviews.length === 0 ? <p className="rounded-xl bg-slate-900 p-5 text-slate-400">No reviews yet.</p> : reviews.map((review) => <article key={review.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold">{review.author_name}</p><div className="mt-1 flex gap-1">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />)}</div></div><span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold uppercase">{review.status}</span></div><p className="mt-4 text-sm text-slate-300">{review.comment}</p>{review.status === "pending" && <div className="mt-4 flex gap-2"><button onClick={() => update(review.id, "approved")} className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-bold text-slate-950">Approve</button><button onClick={() => update(review.id, "rejected")} className="rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white">Reject</button></div>}</article>)}</div>;
}
