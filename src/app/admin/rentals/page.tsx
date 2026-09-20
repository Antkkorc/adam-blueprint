import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminRentalReview from "@/components/AdminRentalReview";

export const dynamic = "force-dynamic";

export default async function AdminRentalsPage() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: submissions, error } = await supabase
    .from("rental_submissions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold">Rental submissions</h1>
          <p className="mt-1 text-sm text-slate-400">Review pending community rental listings before publishing them.</p>
        </div>
        {error ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">Unable to load submissions: {error.message}</p> : null}
        {!error && !submissions?.length ? <p className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-400">No pending rental submissions.</p> : null}
        <div className="space-y-5">
          {submissions?.map((submission) => <AdminRentalReview key={submission.id} submission={submission} />)}
        </div>
      </div>
    </main>
  );
}
