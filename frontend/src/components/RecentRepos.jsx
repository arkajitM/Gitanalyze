export default function RecentRepos({ repos, onSelect }) {
  if (!repos || repos.length === 0) return null;

  // Deduplicate by creator+name, most recently added (highest id) first
  const seen = new Set();
  const unique = [...repos]
    .sort((a, b) => b.id - a.id)
    .filter(r => {
      const key = `${r.creator}/${r.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8);

  return (
    <div className="mt-6">
      <p className="mb-2.5 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
        Previously analyzed
      </p>
      <div className="flex flex-wrap gap-2">
        {unique.map(r => (
          <button
            key={r.id}
            onClick={() => onSelect(r.creator, r.name)}
            className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 font-mono text-xs text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-100"
          >
            {r.creator}/{r.name}
          </button>
        ))}
      </div>
    </div>
  );
}
