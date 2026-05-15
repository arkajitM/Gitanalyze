export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-7">
      <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">
        Couldn't analyze
      </div>
      <h3 className="mt-1 text-lg text-zinc-100">{message}</h3>
      <p className="mt-2 text-sm text-zinc-400">
        Double-check the owner and repository name, then try again.
      </p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-md border
                   border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-100
                   transition hover:border-zinc-600 hover:bg-zinc-800"
      >
        Try again
      </button>
    </div>
  );
}
