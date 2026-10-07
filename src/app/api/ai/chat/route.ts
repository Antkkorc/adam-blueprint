import { NextResponse } from "next/server";

const MAX_MESSAGE_LENGTH = 1200;

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "The assistant is not configured yet." }, { status: 503 });
  }
  let body: { message?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please send a valid message." }, { status: 400 });
  }
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: `Your message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.` }, { status: 400 });
  }
  const history = Array.isArray(body.history)
    ? body.history.filter((item): item is { role: string; text: string } => !!item && typeof item === "object" && "role" in item && "text" in item && typeof item.role === "string" && typeof item.text === "string").slice(-8)
      .map((item) => ({ role: item.role === "assistant" ? "model" : "user", parts: [{ text: item.text.slice(0, MAX_MESSAGE_LENGTH) }] }))
    : [];
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: "You are Adam Blueprint's helpful Botswana real-estate assistant. Give concise, practical guidance about finding, comparing, renting, and buying property in Botswana. Never invent listing availability, prices, legal advice, or property facts. Tell the user to contact the listed agent for current details." }] },
      contents: [...history, { role: "user", parts: [{ text: message }] }],
    }),
  });
  if (!response.ok) {
    console.error("Gemini request failed:", response.status);
    return NextResponse.json({ error: "The assistant could not respond right now. Please try again." }, { status: 502 });
  }
  const result = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = result.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
  if (!text) return NextResponse.json({ error: "The assistant returned an empty response." }, { status: 502 });
  return NextResponse.json({ text });
}
