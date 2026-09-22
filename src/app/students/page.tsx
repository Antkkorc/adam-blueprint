import Link from "next/link";
import TenantRentalCard, { type TenantRental } from "@/components/TenantRentalCard";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tenant_rentals")
    .select("*")
    .eq("status", "Available")
    .eq("student_friendly", true)
    .gte("price", 0)
    .lte("price", 3000)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Student housing is temporarily unavailable</h1>
        <p className="mt-3 text-slate-400">Please try again shortly.</p>
      </main>
    );
  }

  const rentals = (data || []) as TenantRental[];
  return (
    <main className="min-h-screen px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-500">Student housing</p>
            <h1 className="mt-2 text-3xl font-extrabold">Affordable rooms from P0 to P3,000</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Listings are reviewed by our team. Student proof is kept private and is never shown publicly.
            </p>
          </div>
          <Link href="/list-my-rental" className="glass-icon rounded-xl px-4 py-3 text-center text-sm font-bold">
            List student housing
          </Link>
        </div>
        {rentals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
            <p className="font-semibold">No student listings are available yet.</p>
            <p className="mt-2 text-sm text-slate-500">Check back soon or submit a suitable room for review.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rentals.map((rental) => <TenantRentalCard key={rental.id} rental={rental} />)}
          </div>
        )}
      </div>
    </main>
  );
}
