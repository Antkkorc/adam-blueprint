import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const user = await requireAdmin();
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "A listing object is required." }, { status: 400 });
    }
    const text = (value: unknown, field: string, max: number) => {
      if (typeof value !== "string" || !value.trim() || value.length > max) {
        throw new Error(`${field} is invalid.`);
      }
      return value.trim();
    };
    const number = (value: unknown, field: string, max: number) => {
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > max) {
        throw new Error(`${field} is invalid.`);
      }
      return value;
    };
    const listing = {
      title: text(body.title, "Title", 120),
      location: text(body.location, "Location", 200),
      price: number(body.price, "Price", 100_000_000),
      bedrooms: number(body.bedrooms, "Bedrooms", 100),
      bathrooms: number(body.bathrooms, "Bathrooms", 100),
      description: text(body.description, "Description", 5000),
      info: text(body.info || body.description, "Info", 5000),
      image_labels: Array.isArray(body.image_labels) ? body.image_labels.filter((item: unknown): item is string => typeof item === "string").slice(0, 50) : [],
      latitude: body.latitude == null ? null : number(body.latitude, "Latitude", 90),
      longitude: body.longitude == null ? null : number(body.longitude, "Longitude", 180),
      tenant_name: text(body.tenant_name, "Contact name", 120),
      contact_number: text(body.contact_number, "Contact number", 40),
      images: Array.isArray(body.images) ? body.images.filter((item: unknown): item is string => typeof item === "string").slice(0, 20) : [],
      student_friendly: body.student_friendly === true,
      user_id: user.id,
      status: "Available",
    };
    const supabase = createAdminClient();
    const { error } = await supabase.from("tenant_rentals").insert([listing]);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Admin authorization required." }, { status: 403 });
  }
}
