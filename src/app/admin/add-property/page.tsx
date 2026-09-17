import AdminPropertyForm from "@/components/AdminPropertyForm";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminAddPropertyPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <AdminPropertyForm />
    </main>
  );
}