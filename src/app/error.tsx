"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-slate-950 px-6 text-center text-white">
      <div className="max-w-md space-y-4">
        <h1 className="text-2xl font-extrabold">Something went wrong</h1>
        <p className="text-sm text-slate-400">We could not load this page. Please try again.</p>
        <button onClick={() => reset()} className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300">
          Try again
        </button>
      </div>
    </main>
  );
}
