"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Review { id: number; author_name: string; rating: number; comment: string; created_at: string }

export default function ReviewsSection() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/reviews").then((response) => response.json()).then((result: { reviews?: Review[] }) => setReviews(result.reviews || [])).catch(() => setReviews([]));
  }, []);

  async function submitReview(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating, comment }) });
      const result = await response.json() as { message?: string; error?: string };
      setMessage(result.message || result.error || "Unable to submit review.");
      if (response.ok) setComment("");
    } catch {
      setMessage("Unable to submit review right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="reviews" className="reviews-section mx-auto max-w-7xl space-y-6 px-4 py-12">
      <div className="flex items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">Community feedback</p><h2 className="mt-1 text-2xl font-bold text-white">What people say</h2></div>
        <Link href="/#reviews" className="text-xs font-semibold text-cyan-400 hover:underline">Leave a review</Link>
      </div>
      {reviews.length > 0 && <div className="grid gap-4 md:grid-cols-3">{reviews.map((review) => <article key={review.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />)}</div><p className="mt-3 text-sm leading-relaxed text-slate-300">{review.comment}</p><p className="mt-4 text-xs font-bold text-cyan-300">{review.author_name}</p></article>)}</div>}
      <div className="reviews-card rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:p-6">
        <h3 className="font-bold text-white">Share your experience</h3>
        {!user ? <p className="mt-2 text-sm text-slate-400">Please <Link href="/login?redirect=/#reviews" className="text-cyan-400 underline">sign in</Link> to leave a review.</p> : <form onSubmit={submitReview} className="mt-4 space-y-4">
          <div><p className="mb-2 text-xs font-semibold text-slate-400">Your rating</p><div className="flex gap-1">{Array.from({ length: 5 }, (_, index) => <button key={index} type="button" onClick={() => setRating(index + 1)} aria-label={`${index + 1} stars`} className="rounded p-1"><Star className={`h-6 w-6 ${index < rating ? "fill-amber-400 text-amber-400" : "text-slate-500"}`} /></button>)}</div></div>
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} minLength={10} maxLength={1000} required rows={4} placeholder="Tell us about your Adam Blueprint experience..." className="reviews-input w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400" />
          <button disabled={submitting} className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50">{submitting ? "Submitting..." : "Submit review"}</button>
          {message && <p className="text-sm text-cyan-300">{message}</p>}
        </form>}
      </div>
    </section>
  );
}
