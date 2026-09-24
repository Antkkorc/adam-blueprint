import Link from "next/link";
import TenantRentalCard, { type TenantRental } from "@/components/TenantRentalCard";
import { createClient } from "@/lib/supabase/server";
import { PUBLIC_RENTAL_COLUMNS } from "@/lib/supabase/public-columns";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tenant_rentals")
    .select(PUBLIC_RENTAL_COLUMNS)
    .eq("status", "Available")
    .eq("student_friendly", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Student housing query failed:", error.message);
    return (
      <main className="min-h-screen px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">No student housing is available yet</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-400">
          Student listings will appear here after an admin publishes a suitable rental.
          If you already published one, refresh this page and check its status is Available.
        </p>
        <Link href="/list-my-rental" className="glass-icon btn-pop mt-6 inline-flex rounded-xl px-4 py-3 text-sm font-bold">
          List student housing
        </Link>
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
            <h1 className="mt-2 text-3xl font-extrabold">Student-friendly rentals</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Find reviewed rooms and rentals that are suitable for student living. Student proof is kept private and is never shown publicly.
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
            {rentals.map((rental) => (
              <TenantRentalCard key={rental.id} rental={rental} isStudentHousing />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
