import { getProperties } from "@/lib/supabase";
import PropertyList from "@/components/PropertyList";

export default async function RentPage() {
  const properties = await getProperties();

  return (
    <main suppressHydrationWarning>
      <PropertyList properties={properties} intent="rent" />
    </main>
  );
}