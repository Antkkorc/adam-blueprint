import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    const db = createAdminClient();
    const [
      { count: propertySubmissions, error: propertyError },
      { count: rentalSubmissions, error: rentalError },
      { count: unreadEnquiries, error: enquiryError },
    ] = await Promise.all([
      db.from("property_submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
      db.from("rental_submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
      db.from("enquiries").select("id", { count: "exact", head: true }).is("read_at", null),
    ]);

    const error = propertyError || rentalError || enquiryError;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const counts = {
      propertySubmissions: propertySubmissions || 0,
      rentalSubmissions: rentalSubmissions || 0,
      unreadEnquiries: unreadEnquiries || 0,
    };

    return NextResponse.json({ ...counts, total: counts.propertySubmissions + counts.rentalSubmissions + counts.unreadEnquiries });
  } catch {
    return NextResponse.json({ error: "Unable to load admin notifications." }, { status: 401 });
  }
}
