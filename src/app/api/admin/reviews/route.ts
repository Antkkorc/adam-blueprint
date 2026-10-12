import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  await requireAdmin();
  const { data, error } = await createAdminClient().from("reviews").select("*").order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: "Unable to load reviews." }, { status: 500 });
  return NextResponse.json({ reviews: data || [] });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  const body = await request.json() as { id?: unknown; status?: unknown };
  if (!Number.isInteger(body.id) || !["approved", "rejected"].includes(String(body.status))) {
    return NextResponse.json({ error: "Invalid review update." }, { status: 400 });
  }
  const { error } = await createAdminClient().from("reviews").update({ status: body.status, reviewed_at: new Date().toISOString() }).eq("id", body.id);
  if (error) return NextResponse.json({ error: "Unable to update review." }, { status: 500 });
  return NextResponse.json({ ok: true, reviewer: admin.email });
}
