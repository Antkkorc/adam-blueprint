"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
interface Submission { id: string; title?: string; intent: string; location?: string; created_at: string; name: string; phone: string; email: string; description: string; images?: string[]; house_plan_url?: string }
export default function AdminPropertySubmissionReview({ submission }: { submission: Submission }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const review = async (action: "approve" | "reject") => {
    setBusy(true); setError("");
    const response = await fetch(`/api/admin/property-submissions/${submission.id}/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason: "Reviewed by admin." }) });
    const result = await response.json(); if (!response.ok) setError(result.error || "Review failed."); else router.refresh(); setBusy(false);
  };
  return <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3">
    <div className="flex justify-between gap-4"><div><h2 className="font-bold">{submission.title || "Untitled property"} <span className="text-xs text-cyan-400 uppercase">{submission.intent}</span></h2><p className="text-sm text-slate-400">{submission.location || "Location not provided"} · submitted {new Date(submission.created_at).toLocaleString()}</p></div><div className="text-right text-sm">{submission.name}<br /><a className="text-cyan-400" href={`tel:${submission.phone}`}>{submission.phone}</a><br /><a className="text-cyan-400" href={`mailto:${submission.email}`}>{submission.email}</a></div></div>
    <p className="whitespace-pre-wrap text-sm text-slate-300">{submission.description}</p>
    {Array.isArray(submission.images) && <div className="flex flex-wrap gap-2">{submission.images.map((url: string, i: number) => <a className="text-xs text-cyan-400 underline" key={url} href={url} target="_blank" rel="noreferrer">Photo {i + 1}</a>)}</div>}
    {submission.house_plan_url && <a className="text-xs text-cyan-400 underline" href={submission.house_plan_url} target="_blank" rel="noreferrer">View house plan</a>}
    {error && <p className="text-sm text-red-300">{error}</p>}<div className="flex gap-3"><button disabled={busy} onClick={() => review("approve")} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50">Approve and publish</button><button disabled={busy} onClick={() => review("reject")} className="rounded-xl border border-red-500/50 px-4 py-2 text-sm font-bold text-red-300 disabled:opacity-50">Reject</button></div>
  </article>;
}
