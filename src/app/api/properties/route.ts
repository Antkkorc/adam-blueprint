// File: C:\Users\anton\OneDrive\Documents\PROJECTS\adam-blueprint\src\app\api\properties\route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("id", { ascending: false }); // Changed created_at -> id

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json(
        { error: "Unable to load properties." },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("API Route Error:", err);
    return NextResponse.json(
      { error: "Unable to load properties." },
      { status: 500 }
    );
  }
}