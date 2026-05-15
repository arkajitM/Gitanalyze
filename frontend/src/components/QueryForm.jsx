export default function QueryForm({ owner, repo, setOwner, setRepo, onSubmit, loading }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-2 transition focus-within:border-zinc-700 sm:p-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
          {/* Owner */}
          <div className="flex flex-1 items-center gap-2 px-3 py-2 sm:px-4">
            <span className="hidden select-none font-mono text-sm text-zinc-500 sm:inline">
              github.com /
            </span>
            <input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="owner"
              spellCheck="false"
              className="min-w-0 flex-1 bg-transparent font-mono text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
          </div>

          <div className="hidden items-center font-mono text-zinc-600 sm:flex">/</div>

          {/* Repo */}
          <div className="flex flex-1 items-center px-3 py-2 sm:px-4">
            <input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="repository"
              spellCheck="false"
              className="w-full bg-transparent font-mono text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl
                       bg-blue-400 px-5 py-2.5 text-sm font-medium text-zinc-950
                       transition hover:bg-blue-300 active:scale-[0.99]
                       disabled:cursor-not-allowed disabled:opacity-60 sm:py-2"
          >
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-950/30 border-t-zinc-950" />
                Analyzing
              </>
            ) : (
              "Analyze"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
