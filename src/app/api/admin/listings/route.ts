import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const propertyStatuses = ["Available", "Sold", "Rented"] as const;
const rentalStatuses = ["Available", "Rented"] as const;

export async function PATCH(request: Request) {
  await requireAdmin();
  try {
    const body = (await request.json()) as {
      listingType?: "property" | "rental";
      id?: string;
      status?: string;
    };
    if (!body.id || !body.listingType || !body.status || !["property", "rental"].includes(body.listingType)) {
      return NextResponse.json({ error: "Listing type, id, and status are required." }, { status: 400 });
    }
    const statuses = body.listingType === "property" ? propertyStatuses : rentalStatuses;
    if (!statuses.some((status) => status === body.status)) {
      return NextResponse.json({ error: "Invalid status for this listing type." }, { status: 400 });
    }
    const table = body.listingType === "property" ? "properties" : "tenant_rentals";
    const { error } = await createAdminClient().from(table).update({ status: body.status }).eq("id", body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update listing." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  await requireAdmin();
  try {
    const body = (await request.json()) as { listingType?: "property" | "rental"; id?: string };
    if (!body.id || !body.listingType || !["property", "rental"].includes(body.listingType)) {
      return NextResponse.json({ error: "Listing type and id are required." }, { status: 400 });
    }
    const table = body.listingType === "property" ? "properties" : "tenant_rentals";
    const { error } = await createAdminClient().from(table).delete().eq("id", body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete listing." }, { status: 400 });
  }
}
