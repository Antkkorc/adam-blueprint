import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const userEmail = session.user.email?.toLowerCase().trim();

  if (adminEmail && userEmail !== adminEmail) {
    redirect("/");
  }

  return session.user;
}