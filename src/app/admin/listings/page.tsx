import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminListingsManager from "@/components/AdminListingsManager";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  await requireAdmin();
  const supabase = createAdminClient();
  const [{ data: properties, error: propertiesError }, { data: rentals, error: rentalsError }] = await Promise.all([
    supabase.from("properties").select("id,title,location,status,price").order("id", { ascending: false }),
    supabase.from("tenant_rentals").select("id,title,location,status,price").order("created_at", { ascending: false }),
  ]);
  const error = propertiesError || rentalsError;
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <div><h1 className="text-3xl font-extrabold">Manage listings</h1><p className="mt-1 text-sm text-slate-400">Set availability or permanently delete published listings.</p></div>
        {error ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">Unable to load listings: {error.message}</p> : null}
        <AdminListingsManager properties={properties || []} rentals={rentals || []} />
      </div>
    </main>
  );
}
