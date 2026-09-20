import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { PlusCircle, Home, ClipboardCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdmin();

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, {user.email}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/add-property" className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all group">
            <PlusCircle className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <h2 className="font-bold text-lg">Add Official Property</h2>
            <p className="text-slate-400 text-xs mt-2">Upload listings with categorized photos, sketch plans and exact pinned locations.</p>
          </Link>

          <Link href="/admin/add-rental" className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all group">
            <ClipboardCheck className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <h2 className="font-bold text-lg">Publish Verified Rental</h2>
            <p className="text-slate-400 text-xs mt-2">Review a user&apos;s submitted details, then publish the verified rental listing.</p>
          </Link>

          <Link href="/" className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all group">
            <Home className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <h2 className="font-bold text-lg">View Live Site</h2>
            <p className="text-slate-400 text-xs mt-2">See how your properties look to the public.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}