import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { reviewPropertySubmission } from "@/lib/admin-property-submission";
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  try {
    const body = await request.json().catch(() => ({}));
    const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 1000) : undefined;
    const id = (await params).id;
    if (!id || id.length > 100) return NextResponse.json({ error: "Invalid submission id." }, { status: 400 });
    await reviewPropertySubmission(id, "reject", admin.id, reason);
    return NextResponse.json({ ok: true });
  }
  catch (e) { return NextResponse.json({ error: e instanceof Error ? e.message : "Unable to reject." }, { status: 400 }); }
}
