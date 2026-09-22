import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const requests = new Map<string, { count: number; resetAt: number }>();

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const now = Date.now();
    const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const current = requests.get(key);
    if (!current || current.resetAt <= now) {
      requests.set(key, { count: 1, resetAt: now + 60_000 });
    } else {
      current.count += 1;
      if (current.count > 120) {
        return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
      }
    }
  }
  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};