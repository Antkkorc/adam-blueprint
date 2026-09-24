import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { reviewRentalSubmission } from "@/lib/admin-rental-review";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAdmin();
  try {
    const { id } = await params;
    if (!id || id.length > 100) {
      return NextResponse.json({ error: "Invalid submission id." }, { status: 400 });
    }
    await reviewRentalSubmission(id, "approve", user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to approve submission." },
      { status: 400 },
    );
  }
}
