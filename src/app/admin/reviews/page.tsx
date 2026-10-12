import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminReviews from "@/components/AdminReviews";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  await requireAdmin();
  const { data } = await createAdminClient().from("reviews").select("id,author_name,rating,comment,status,created_at").order("created_at", { ascending: false });
  return <main className="min-h-screen bg-slate-950 p-6 text-white md:p-12"><div className="mx-auto max-w-4xl space-y-6"><h1 className="text-3xl font-extrabold">Review moderation</h1><p className="text-sm text-slate-400">Approve reviews before they appear publicly.</p><AdminReviews initialReviews={data || []} /></div></main>;
}
