"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RentalSubmission {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  contact_name: string;
  contact_number: string;
  images: string[];
  image_labels: string[];
  created_at: string;
}

export default function AdminRentalReview({ submission }: { submission: RentalSubmission }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const review = async (action: "approve" | "reject") => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/rental-submissions/${submission.id}/${action}`, { method: "POST" });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Review failed.");
      router.refresh();
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : "Review failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{submission.title}</h2>
          <p className="text-sm text-slate-400">{submission.location} · BWP {Number(submission.price).toLocaleString()}</p>
          <p className="text-xs text-slate-500">{submission.bedrooms} bedrooms · {submission.bathrooms} bathrooms · submitted {new Date(submission.created_at).toLocaleString()}</p>
        </div>
        <div className="text-right text-sm">
          <p>{submission.contact_name}</p>
          <a className="text-cyan-400 hover:underline" href={`tel:${submission.contact_number}`}>{submission.contact_number}</a>
        </div>
      </div>
      <p className="whitespace-pre-wrap text-sm text-slate-300">{submission.description}</p>
      {submission.images?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {submission.images.map((image, index) => (
            <a key={image} href={image} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 underline">
              Photo {index + 1}{submission.image_labels?.[index] ? `: ${submission.image_labels[index]}` : ""}
            </a>
          ))}
        </div>
      )}
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <div className="flex gap-3">
        <button type="button" disabled={busy} onClick={() => review("approve")} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50">
          {busy ? "Saving..." : "Approve and publish"}
        </button>
        <button type="button" disabled={busy} onClick={() => review("reject")} className="rounded-xl border border-red-500/50 px-4 py-2 text-sm font-bold text-red-300 disabled:opacity-50">
          Reject
        </button>
      </div>
    </article>
  );
}
