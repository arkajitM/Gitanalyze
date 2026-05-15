function getToneColor(score) {
  if (score >= 75) return "#1383d4";
  if (score >= 60) return "#13d4c7";
  if (score >= 40) return "#c9c914";
  return "#f57c64";
}

function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + "k";
  return String(n);
}

function formatDate(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function HistoryLog({ logs, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/60" />
        ))}
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <p className="text-sm text-zinc-500">No history yet for this repository.</p>
    );
  }

  // Most recent first
  const sorted = [...logs].sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 text-left">
            {["Timestamp", "Health", "Stars", "Forks", "Issues", "Open PRs"].map(h => (
              <th key={h} className="px-4 py-3 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const color = getToneColor(row.healthScore);
            return (
              <tr
                key={row.id}
                className="border-b border-zinc-800/50 last:border-0 transition hover:bg-zinc-900/40"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                  {formatDate(row.time)}
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono font-semibold tabular-nums" style={{ color }}>
                    {row.healthScore}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-zinc-300">{formatNumber(row.stars)}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-zinc-300">{formatNumber(row.forks)}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-zinc-300">{formatNumber(row.issues)}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-zinc-300">{formatNumber(row.openPrs)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
