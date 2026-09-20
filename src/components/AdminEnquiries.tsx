"use client";

import { useState } from "react";
import { Check, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  read_at?: string | null;
};

export default function AdminEnquiries({ enquiries }: { enquiries: Enquiry[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const markRead = async (id: string) => {
    setBusy(id);
    const response = await fetch(`/api/admin/enquiries/${id}/read`, { method: "POST" });
    setBusy(null);
    if (response.ok) router.refresh();
  };

  return (
    <div className="space-y-3">
      {!enquiries.length ? <p className="rounded-xl bg-slate-900 p-5 text-slate-400">No contact enquiries.</p> : enquiries.map((enquiry) => (
        <article key={enquiry.id} className={`rounded-xl border p-4 ${enquiry.read_at ? "border-slate-800 bg-slate-900" : "border-cyan-500/40 bg-cyan-500/5"}`}>
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <div>
              <div className="font-semibold">{enquiry.name} · {enquiry.email}</div>
              {enquiry.phone && <a className="mt-1 inline-flex items-center gap-1 text-xs text-cyan-300" href={`tel:${enquiry.phone}`}><Phone className="h-3 w-3" />{enquiry.phone}</a>}
            </div>
            <button type="button" disabled={Boolean(enquiry.read_at) || busy === enquiry.id} onClick={() => markRead(enquiry.id)} className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-cyan-500/40 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/10 disabled:cursor-default disabled:opacity-60">
              <Check className="h-3.5 w-3.5" />{enquiry.read_at ? "Read" : "Mark as read"}
            </button>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{enquiry.message}</p>
          <a href={`mailto:${enquiry.email}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:underline"><Mail className="h-3 w-3" /> Reply by email</a>
        </article>
      ))}
    </div>
  );
}
