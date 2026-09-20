import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { PlusCircle, Home, ClipboardCheck, List, Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdmin();
  const db = createAdminClient();
  const [
    { count: propertySubmissions },
    { count: rentalSubmissions },
    { count: unreadEnquiries },
  ] = await Promise.all([
    db.from("property_submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    db.from("rental_submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    db.from("enquiries").select("id", { count: "exact", head: true }).is("read_at", null),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, {user.email}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/inbox" className="relative bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all group">
            <DashboardBadge count={(propertySubmissions || 0) + (unreadEnquiries || 0)} />
            <Inbox className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <h2 className="font-bold text-lg">Submission inbox</h2>
            <p className="text-slate-400 text-xs mt-2">Review property listing requests and contact enquiries.</p>
          </Link>
          <Link href="/admin/listings" className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all group">
            <List className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <h2 className="font-bold text-lg">Manage Listings</h2>
            <p className="text-slate-400 text-xs mt-2">Update availability or remove official properties and published rentals.</p>
          </Link>
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

          <Link href="/admin/rentals" className="relative bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all group">
            <DashboardBadge count={rentalSubmissions || 0} />
            <ClipboardCheck className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <h2 className="font-bold text-lg">Review Rental Submissions</h2>
            <p className="text-slate-400 text-xs mt-2">Approve or reject pending community rental listings and their photos.</p>
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

function DashboardBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute right-5 top-5 inline-flex min-w-7 h-7 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-extrabold text-white shadow-lg shadow-red-950/50" aria-label={`${count} new notifications`}>
      {count > 99 ? "99+" : count}
    </span>
  );
}