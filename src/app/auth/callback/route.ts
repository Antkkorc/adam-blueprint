// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const authMode = searchParams.get("auth_mode");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      const createdAt = user?.created_at ? Date.parse(user.created_at) : 0;
      const isNewAccount = createdAt > Date.now() - 10 * 60 * 1000;

      if (authMode === "login" && isNewAccount) {
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent("No account was found for this Google account. Choose Create Account first.")}`
        );
      }

      // Successful authentication — redirect user to their destination or homepage.
      const response = NextResponse.redirect(new URL(next, origin));
      response.headers.set("Cache-Control", "no-store");
      return response;
    }
  }

  // If there's an error or missing code, redirect to an error page or login with a feedback query
  const response = NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
  response.headers.set("Cache-Control", "no-store");
  return response;
}