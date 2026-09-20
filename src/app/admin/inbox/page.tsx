import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminPropertySubmissionReview from "@/components/AdminPropertySubmissionReview";
import AdminEnquiries from "@/components/AdminEnquiries";
import BackToAdmin from "@/components/BackToAdmin";
export const dynamic = "force-dynamic";
export default async function AdminInboxPage() {
  await requireAdmin(); const db = createAdminClient();
  const [{ data: submissions, error: submissionsError }, { data: enquiries, error: enquiriesError }] = await Promise.all([
    db.from("property_submissions").select("*").eq("status", "pending").order("created_at", { ascending: true }),
    db.from("enquiries").select("*").order("created_at", { ascending: false }).limit(50),
  ]);
  const error = submissionsError || enquiriesError;
  return <main className="min-h-screen bg-slate-950 p-6 text-white md:p-12"><div className="mx-auto max-w-5xl space-y-8"><div><BackToAdmin /><h1 className="text-3xl font-extrabold">Admin inbox</h1><p className="text-sm text-slate-400">Review listing requests and contact enquiries.</p></div>{error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">Unable to load all inbox items: {error.message}</p>}<section className="space-y-4"><h2 className="text-xl font-bold">Property listing requests</h2>{!submissions?.length ? <p className="rounded-xl bg-slate-900 p-5 text-slate-400">No pending requests.</p> : submissions.map((s) => <AdminPropertySubmissionReview key={s.id} submission={s} />)}</section><section className="space-y-3"><h2 className="text-xl font-bold">Contact enquiries</h2><AdminEnquiries enquiries={enquiries || []} /></section></div></main>;
}
