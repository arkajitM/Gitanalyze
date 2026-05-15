import { useState, useEffect } from "react";
import { fetchRepoStats, saveHistory, fetchHistory, saveRepo, fetchAllRepos } from "../services/api";

import QueryForm    from "../components/QueryForm";
import Loading      from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import StatCard     from "../components/StatCard";
import HealthScore  from "../components/HealthScore";
import HistoryLog   from "../components/HistoryLog";
import RecentRepos  from "../components/RecentRepos";
import { StarIcon, ForkIcon, EyeIcon, IssueIcon, PrIcon } from "../components/icons";

export default function Dashboard() {
  const [owner, setOwner] = useState("facebook");
  const [repo,  setRepo]  = useState("react");

  const [status, setStatus] = useState("idle");
  const [data,   setData]   = useState(null);
  const [error,  setError]  = useState("");

  const [history,       setHistory]       = useState([]);
  const [historyStatus, setHistoryStatus] = useState("idle"); // idle | loading | done
  const [allRepos,      setAllRepos]      = useState([]);

  // Load previously analyzed repos on mount
  useEffect(() => {
    fetchAllRepos().then(setAllRepos).catch(() => {});
  }, []);

  async function analyze() {
    setStatus("loading");
    setHistoryStatus("idle");
    setHistory([]);
    setError("");
    try {
      const result = await fetchRepoStats(owner, repo);
      setData(result);
      setStatus("success");
      // Save + load history in background after results are shown
      runHistoryFlow(owner.trim(), repo.trim());
    } catch (e) {
      setError(e.message || "Something went wrong.");
      setStatus("error");
    }
  }

  async function runHistoryFlow(o, r) {
    setHistoryStatus("loading");
    try {
      // Save snapshot and register repo in parallel
      await Promise.all([saveHistory(o, r), saveRepo(o, r)]);
      // Refresh the recent repos list
      fetchAllRepos().then(setAllRepos).catch(() => {});
      // Fetch updated history log
      const logs = await fetchHistory(o, r);
      setHistory(logs);
    } catch {
      // silently ignore — main results are already shown
    } finally {
      setHistoryStatus("done");
    }
  }

  function handleRecentSelect(creator, name) {
    setOwner(creator);
    setRepo(name);
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
      {/* Brand */}
      <header className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
          <div className="h-2.5 w-2.5 rounded-sm bg-blue-300" />
        </div>
        <span className="font-mono text-xl tracking-tight text-zinc-200">
          Gitanalyze
        </span>
      </header>

      {/* Hero */}
      <section className="mt-12 max-w-2xl sm:mt-16">
        <h1 className="text-4xl font-medium tracking-tight text-zinc-100 sm:text-5xl">
          Repository health,
          <br />
          <span className="text-zinc-400">at a glance.</span>
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          A lightweight inspector for any public GitHub repository. Drop in an
          owner and repo name to pull stars, forks, open issues, PRs and a
          composite health score.
        </p>
      </section>

      {/* Form */}
      <section className="mt-8 sm:mt-10">
        <QueryForm
          owner={owner}
          repo={repo}
          setOwner={setOwner}
          setRepo={setRepo}
          onSubmit={analyze}
          loading={status === "loading"}
        />
        {/* Previously analyzed repos — shown on idle */}
        {status === "idle" && (
          <RecentRepos repos={allRepos} onSelect={handleRecentSelect} />
        )}
      </section>

      {/* Output */}
      <section className="mt-10 sm:mt-12">
        {status === "loading" && <Loading />}

        {status === "error" && (
          <ErrorMessage message={error} onRetry={analyze} />
        )}

        {status === "success" && data && (
          <div className="space-y-5">
            {/* Repo header */}
            <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
              <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                Repository
              </div>
              <a
                href={`https://github.com/${data.owner}/${data.repo}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-baseline gap-1 break-all font-mono text-xl text-zinc-100 transition hover:text-blue-300 sm:text-2xl"
              >
                <span className="text-zinc-400">{data.owner}</span>
                <span className="text-zinc-600">/</span>
                <span>{data.repo}</span>
              </a>
            </div>

            {/* Health score */}
            <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
              <HealthScore score={data.health_score} />
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <StatCard icon={StarIcon}  label="Stars"       value={data.stars}       delay={160} />
              <StatCard icon={ForkIcon}  label="Forks"       value={data.forks}       delay={210} />
              <StatCard icon={EyeIcon}   label="Watchers"    value={data.watchers}    delay={260} />
              <StatCard icon={IssueIcon} label="Open issues" value={data.open_issues} delay={310} />
              <StatCard icon={PrIcon}    label="Open PRs"    value={data.open_prs}    delay={360} />
            </div>

            {/* History log */}
            <div className="animate-fade-up pt-4" style={{ animationDelay: "420ms" }}>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                  Analysis history
                </div>
                {historyStatus === "loading" && (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <span className="h-3 w-3 animate-spin rounded-full border border-zinc-600 border-t-zinc-300" />
                    saving…
                  </span>
                )}
              </div>
              <HistoryLog logs={history} loading={historyStatus === "loading"} />
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/60 pt-6 font-mono text-xs text-zinc-500 sm:mt-24">
        <span className="flex flex-col gap-0.5">
          <span>Gitanalyze</span>
          <span>Built by Arkajit Mukherjee</span>
        </span>
      </footer>
    </main>
  );
}
