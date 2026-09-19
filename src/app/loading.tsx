export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="mx-auto max-w-7xl space-y-6" aria-busy="true" aria-label="Loading">
        <div className="h-8 w-64 animate-pulse rounded bg-slate-900" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-80 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
          ))}
        </div>
      </div>
    </main>
  );
}
