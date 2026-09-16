// File: C:\Users\anton\OneDrive\Documents\PROJECTS\adam-blueprint\src\app\api\properties\route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Adjust import path if needed

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("id", { ascending: false }); // Changed created_at -> id

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json([]); // Return empty array on error instead of error object
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("API Route Error:", err);
    return NextResponse.json([]);
  }
}