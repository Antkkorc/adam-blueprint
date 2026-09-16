// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successful authentication — redirect user to their destination or homepage
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If there's an error or missing code, redirect to an error page or login with a feedback query
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}