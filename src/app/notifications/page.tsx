import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function NotificationsPage() {
  const db = await createClient(); const { data: { user } } = await db.auth.getUser(); if (!user) redirect("/login");
  const { data } = await db.from("notifications").select("*").order("created_at", { ascending: false });
  return <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12"><div className="mx-auto max-w-2xl space-y-6"><h1 className="text-3xl font-extrabold">Notifications</h1>{!data?.length ? <p className="text-slate-400">You have no notifications.</p> : data.map((n) => <article key={n.id} className="rounded-xl border border-slate-800 bg-slate-900 p-4"><h2 className="font-bold">{n.title}</h2><p className="mt-1 text-sm text-slate-300">{n.message}</p><p className="mt-2 text-xs text-slate-500">{new Date(n.created_at).toLocaleString()}</p></article>)}</div></main>;
}
