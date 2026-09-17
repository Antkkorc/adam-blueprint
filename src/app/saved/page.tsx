import { createClient } from "@/lib/supabase/server";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function SavedPropertiesPage() {
  const supabase = await createClient();

  // FIXED: Use getUser() instead of getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: savedItems } = await supabase
    .from("saved_properties")
    .select("property_id, properties(*)")
    .eq("user_id", user.id); // FIXED: changed session.user.id to user.id

  const savedProperties = (savedItems ?? [])
    .flatMap((item: any) =>
      Array.isArray(item.properties) ? item.properties : item.properties ? [item.properties] : []
    )
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold">Saved Properties</h1>
          <p className="text-slate-400 text-sm mt-1">
            Properties you have favorited for future review.
          </p>
        </div>

        {savedProperties.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <p className="text-slate-400 text-sm">You haven&apos;t saved any properties yet.</p>
            <Link href="/buy" className="text-cyan-400 text-xs font-semibold underline">
              Browse Available Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property: any) => (
              <PropertyCard
                key={property.id}
                property={property}
                initialSaved={true}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}