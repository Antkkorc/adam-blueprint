import { getProperties } from "@/lib/supabase";
import PropertyList from "@/components/PropertyList";

export default async function BuyPage() {
  const properties = await getProperties();
  return <PropertyList properties={properties} intent="buy" />;
}