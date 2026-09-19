import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const adminUserId = process.env.ADMIN_USER_ID?.trim();
  const userEmail = user?.email?.toLowerCase().trim();

  const isAdmin = !!user && (
    (!!adminEmail && userEmail === adminEmail) ||
    (!!adminUserId && user.id === adminUserId)
  );

  return NextResponse.json({ isAdmin });
}