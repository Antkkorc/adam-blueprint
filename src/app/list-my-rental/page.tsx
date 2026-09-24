// File: C:\Users\anton\OneDrive\Documents\PROJECTS\src\app\list-my-rental\page.tsx
import TenantRentalForm from "@/components/TenantRentalForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ListMyRentalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/list-my-rental");
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <TenantRentalForm />
    </main>
  );
}