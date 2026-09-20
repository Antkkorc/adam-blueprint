import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await requireAdmin();
  try {
    const listing = await request.json();
    const supabase = createAdminClient();
    const { error } = await supabase.from("tenant_rentals").insert([{
      ...listing,
      user_id: listing.user_id || user.id,
    }]);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Admin authorization required." }, { status: 403 });
  }
}
