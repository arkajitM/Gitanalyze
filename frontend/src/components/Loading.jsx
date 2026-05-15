export default function Loading() {
  return (
    <div className="space-y-5">
      <div className="h-[220px] animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/60" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-[112px] animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/60"
          />
        ))}
      </div>
    </div>
  );
}
