import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const db = await createClient();
  const { data, error } = await db.from("reviews").select("id,author_name,rating,comment,created_at").eq("status", "approved").order("created_at", { ascending: false }).limit(12);
  if (error) {
    console.error("Unable to load approved reviews:", error.message);
    if (error.code === "42P01") return NextResponse.json({ reviews: [] });
    return NextResponse.json({ error: "Unable to load reviews." }, { status: 500 });
  }
  return NextResponse.json({ reviews: data || [] });
}

export async function POST(request: Request) {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in to leave a review." }, { status: 401 });

  let body: { rating?: unknown; comment?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please submit valid review details." }, { status: 400 });
  }
  const rating = Number(body.rating);
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Choose a rating from 1 to 5 stars." }, { status: 400 });
  }
  if (comment.length < 10 || comment.length > 1000) {
    return NextResponse.json({ error: "Your review must be between 10 and 1,000 characters." }, { status: 400 });
  }
  const metadata = user.user_metadata as { full_name?: string; name?: string } | undefined;
  const authorName = metadata?.full_name || metadata?.name || user.email?.split("@")[0] || "Adam Blueprint user";
  const { error } = await db.from("reviews").insert({ user_id: user.id, author_name: authorName.slice(0, 120), rating, comment, status: "pending" });
  if (error) {
    console.error("Unable to submit review:", error.message);
    if (error.code === "42P01") return NextResponse.json({ error: "Reviews are temporarily unavailable while this feature is being set up." }, { status: 503 });
    return NextResponse.json({ error: "Your review could not be submitted." }, { status: 500 });
  }
  return NextResponse.json({ message: "Thanks. Your review is awaiting approval." }, { status: 201 });
}
