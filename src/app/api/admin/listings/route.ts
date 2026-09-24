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
    if (typeof body.id !== "string" || body.id.length > 100 || !body.listingType || !body.status || !["property", "rental"].includes(body.listingType)) {
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
  const admin = await requireAdmin();
  try {
    const body = (await request.json()) as { listingType?: "property" | "rental"; id?: string };
    if (typeof body.id !== "string" || body.id.length > 100 || !body.listingType || !["property", "rental"].includes(body.listingType)) {
      return NextResponse.json({ error: "Listing type and id are required." }, { status: 400 });
    }
    const db = createAdminClient();
    const table = body.listingType === "property" ? "properties" : "tenant_rentals";
    const { data: listing, error: fetchError } = await db.from(table).select("*").eq("id", body.id).single();
    if (fetchError || !listing) {
      return NextResponse.json({ error: fetchError?.message || "Listing not found." }, { status: 404 });
    }
    const { error: archiveError } = await db.from("listing_archives").insert({
      listing_type: body.listingType,
      listing_id: body.id,
      title: listing.title || "Untitled listing",
      location: listing.location || null,
      status: listing.status || null,
      payload: listing,
      deleted_by: admin.id,
    });
    if (archiveError) return NextResponse.json({ error: archiveError.message }, { status: 400 });
    const { error } = await db.from(table).delete().eq("id", body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const urls = [
      ...(Array.isArray(listing.images) ? listing.images : []),
      listing.house_plan_url,
    ].filter((value): value is string => typeof value === "string");
    const paths = urls.flatMap((url) => {
      const marker = "/storage/v1/object/public/";
      const index = url.indexOf(marker);
      if (index < 0) return [];
      const [bucket, ...parts] = url.slice(index + marker.length).split("/");
      return bucket && parts.length ? [{ bucket, path: parts.join("/") }] : [];
    });
    await Promise.all([...new Set(paths.map((item) => `${item.bucket}:${item.path}`))].map(async (key) => {
      const separator = key.indexOf(":");
      const bucket = key.slice(0, separator);
      const path = key.slice(separator + 1);
      await db.storage.from(bucket).remove([path]);
    }));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete listing." }, { status: 400 });
  }
}
