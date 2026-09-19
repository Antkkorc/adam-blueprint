import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-slate-950 px-6 text-center text-white">
      <div className="max-w-md space-y-4">
        <p className="text-5xl font-black text-cyan-400">404</p>
        <h1 className="text-2xl font-extrabold">Property not found</h1>
        <p className="text-sm text-slate-400">This listing may have been removed or is no longer available.</p>
        <Link href="/buy" className="inline-block rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300">Browse properties</Link>
      </div>
    </main>
  );
}
