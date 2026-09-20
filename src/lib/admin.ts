import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = await createClient();

  // FIXED: Use getUser() instead of getSession() for security
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const adminUserId = process.env.ADMIN_USER_ID?.trim();
  const userEmail = user.email?.toLowerCase().trim();

  const isAdmin = (!!adminEmail && !!userEmail && userEmail === adminEmail) ||
    (!!adminUserId && user.id === adminUserId);

  if (!isAdmin) {
    redirect("/");
  }

  return user;
}