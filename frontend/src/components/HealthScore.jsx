import { useEffect, useState } from "react";

function getTone(score) {
  if (score >= 75) return { label: "Excellent", color: "#1383d4" };
  if (score >= 60) return { label: "Healthy",   color: "#13d4c7" };
  if (score >= 40) return { label: "Fair",       color: "#c9c914" };
  return            { label: "At risk",    color: "#f57c64" };
}

export default function HealthScore({ score }) {
  const tone = getTone(score);
  const R = 70;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - score / 100);

  // Start fully hidden, animate to real offset on mount
  const [currentOffset, setCurrentOffset] = useState(C);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCurrentOffset(offset));
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/60 p-6 sm:p-7">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        {/* Ring — centered on mobile, left-aligned on sm+ */}
        <div className="relative mx-auto h-[168px] w-[168px] shrink-0 sm:mx-0 sm:h-[148px] sm:w-[148px]">

          {/* Static track */}
          <svg width="100%" height="100%" viewBox="0 0 148 148"
            style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx="74" cy="74" r={R} stroke="#27272a" strokeWidth="8" fill="none" />
          </svg>

          {/* Animated glowing arc */}
          <svg width="100%" height="100%" viewBox="0 0 148 148"
            style={{
              position: "absolute",
              inset: 0,
              transform: "rotate(-90deg)",
              filter: `drop-shadow(0 0 3px ${tone.color}) drop-shadow(0 0 8px ${tone.color}66)`,
            }}
          >
            <circle
              cx="74" cy="74" r={R}
              stroke={tone.color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={currentOffset}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
          </svg>

          {/* Score text — stays still */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-5xl font-medium leading-none tabular-nums text-zinc-100">
              {score}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "rgb(209, 209, 220)" }}>
              out of 100
            </span>
          </div>
        </div>

        {/* Label */}
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">
            Health score
          </div>
          <h3 className="mt-2 text-2xl font-medium text-zinc-100 sm:text-3xl">
            {tone.label}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-300">
            A composite of activity, issue triage, PR throughput and community
            signals. Higher is better.
          </p>
        </div>
      </div>
    </div>
  );
}
