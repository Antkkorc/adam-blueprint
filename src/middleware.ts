import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { updateSession } from "@/lib/supabase/middleware";

const requests = new Map<string, { count: number; resetAt: number }>();
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const distributedLimiter =
  upstashUrl && upstashToken
    ? new Ratelimit({
        redis: new Redis({ url: upstashUrl, token: upstashToken }),
        limiter: Ratelimit.slidingWindow(120, "60 s"),
        analytics: true,
        prefix: "adam-blueprint:api",
      })
    : null;

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (distributedLimiter) {
      try {
        const { success } = await distributedLimiter.limit(key);
        if (!success) {
          return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
        }
      } catch (error) {
        console.error("Distributed API rate limiter unavailable; using local fallback.", error);
        if (isLocalLimitExceeded(key)) {
          return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
        }
      }
    } else {
      if (isLocalLimitExceeded(key)) {
        return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
      }
    }
  }
  return await updateSession(request);
}

function isLocalLimitExceeded(key: string) {
  const now = Date.now();
  const current = requests.get(key);
  if (!current || current.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  current.count += 1;
  return current.count > 120;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};