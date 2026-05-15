const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function fetchRepoStats(owner, repo) {
  const o = owner.trim();
  const r = repo.trim();
  if (!o || !r) throw new Error("Please enter both an owner and a repository.");

  const res = await fetch(`${API_BASE}/repos/${encodeURIComponent(o)}/${encodeURIComponent(r)}/stats`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Repository "${o}/${r}" not found.`);
  }
  return res.json();
}

export async function saveHistory(owner, repo) {
  const res = await fetch(
    `${API_BASE}/history?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
    { method: "POST" }
  );
  if (!res.ok) throw new Error("Failed to save history.");
  return res.json();
}

export async function fetchHistory(owner, repo) {
  const res = await fetch(
    `${API_BASE}/get_history?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`
  );
  if (!res.ok) throw new Error("Failed to fetch history.");
  return res.json();
}

export async function saveRepo(owner, repo) {
  const res = await fetch(`${API_BASE}/repos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ owner, repo }),
  });
  if (!res.ok) throw new Error("Failed to save repo.");
  return res.json();
}

export async function fetchAllRepos() {
  const res = await fetch(`${API_BASE}/repos`);
  if (!res.ok) throw new Error("Failed to fetch repos.");
  return res.json();
}
