import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { reviewPropertySubmission } from "@/lib/admin-property-submission";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  try { const body = await request.json().catch(() => ({})); await reviewPropertySubmission((await params).id, "reject", admin.id, body.reason); return NextResponse.json({ ok: true }); }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to reject." }, { status: 400 }); }
}
