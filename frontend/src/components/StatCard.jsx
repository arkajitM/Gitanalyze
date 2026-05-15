import { useEffect, useState } from "react";
import { formatNumber } from "../utils/format";

function useCountUp(target, delay = 0, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timeout;
    let start;
    let raf;

    timeout = setTimeout(() => {
      start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, delay, duration]);

  return count;
}

export default function StatCard({ icon: Icon, label, value, delay = 0 }) {
  const displayed = useCountUp(value, delay, 1000);

  return (
    <div
      className="animate-fade-up group rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700 hover:bg-zinc-900"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">
          {label}
        </span>
        <span className="text-zinc-500 transition group-hover:text-zinc-300">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-4">
        <span className="font-mono text-3xl font-medium tabular-nums text-zinc-100">
          {formatNumber(displayed)}
        </span>
      </div>
    </div>
  );
}
