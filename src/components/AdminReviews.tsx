"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Review { id: number; author_name: string; rating: number; comment: string; status: string; created_at: string }

export default function AdminReviews({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [error, setError] = useState("");
  async function update(id: number, status: "approved" | "rejected") {
    const response = await fetch("/api/admin/reviews", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (!response.ok) {
      setError("Unable to update review. Please try again.");
      return;
    }
    setError("");
    setReviews((current) => current.map((review) => review.id === id ? { ...review, status } : review));
  }
  async function remove(id: number) {
    if (!window.confirm("Delete this review permanently?")) return;
    const response = await fetch("/api/admin/reviews", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (!response.ok) {
      setError("Unable to delete review. Please try again.");
      return;
    }
    setError("");
    setReviews((current) => current.filter((review) => review.id !== id));
  }
  return <div className="space-y-4">{error && <p role="alert" className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">{error}</p>}{reviews.length === 0 ? <p className="rounded-xl bg-slate-900 p-5 text-slate-400">No reviews yet.</p> : reviews.map((review) => <article key={review.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-bold">{review.author_name}</p><div className="mt-1 flex gap-1">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />)}</div></div><span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold uppercase">{review.status}</span></div><p className="mt-4 text-sm text-slate-300">{review.comment}</p><div className="mt-4 flex gap-2">{review.status === "pending" && <><button onClick={() => update(review.id, "approved")} className="rounded-lg bg-emerald-400 px-3 py-2 text-xs font-bold text-slate-950">Approve</button><button onClick={() => update(review.id, "rejected")} className="rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white">Reject</button></>}<button onClick={() => remove(review.id)} className="rounded-lg border border-red-500/60 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10">Delete</button></div></article>)}</div>;
}
