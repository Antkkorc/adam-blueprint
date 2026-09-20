import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminPropertySubmissionReview from "@/components/AdminPropertySubmissionReview";
export const dynamic = "force-dynamic";
export default async function AdminInboxPage() {
  await requireAdmin(); const db = createAdminClient();
  const [{ data: submissions }, { data: enquiries }] = await Promise.all([
    db.from("property_submissions").select("*").eq("status", "pending").order("created_at", { ascending: true }),
    db.from("enquiries").select("*").order("created_at", { ascending: false }).limit(50),
  ]);
  return <main className="min-h-screen bg-slate-950 p-6 text-white md:p-12"><div className="mx-auto max-w-5xl space-y-8"><div><h1 className="text-3xl font-extrabold">Admin inbox</h1><p className="text-sm text-slate-400">Review listing requests and contact enquiries.</p></div><section className="space-y-4"><h2 className="text-xl font-bold">Property listing requests</h2>{!submissions?.length ? <p className="rounded-xl bg-slate-900 p-5 text-slate-400">No pending requests.</p> : submissions.map((s) => <AdminPropertySubmissionReview key={s.id} submission={s} />)}</section><section className="space-y-3"><h2 className="text-xl font-bold">Contact enquiries</h2>{enquiries?.map((e) => <article key={e.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4"><div className="font-semibold">{e.name} · {e.email}</div><p className="text-sm text-slate-300 whitespace-pre-wrap">{e.message}</p></article>)}</section></div></main>;
}
