import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { reviewPropertySubmission } from "@/lib/admin-property-submission";
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  try { await reviewPropertySubmission((await params).id, "approve", admin.id); return NextResponse.json({ ok: true }); }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to approve." }, { status: 400 }); }
}
