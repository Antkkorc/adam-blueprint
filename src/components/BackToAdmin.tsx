import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackToAdmin() {
  return (
    <Link
      href="/admin"
      className="mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-500/60 hover:text-cyan-300"
    >
      <ArrowLeft className="h-4 w-4" />
      Admin Dashboard
    </Link>
  );
}
