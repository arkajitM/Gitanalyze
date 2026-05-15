import requests
from config import GITHUB_TOKEN
import os
from math import log1p
from datetime import datetime, timezone

def _github_headers():
    token = os.getenv("GITHUB_TOKEN")
    headers = {"Accept": "application/vnd.github+json"}

    if token:
        headers["Authorization"] = f"Bearer {token}"

    return headers


def repoData(owner: str, repo: str):
    url = f"https://api.github.com/repos/{owner}/{repo}"

    try:
        response = requests.get(url, headers=_github_headers(), timeout=10)
    except requests.RequestException:
        return None

    if (response.status_code != 200):
        return None

    data = response.json()
    return {
        "stars": data["stargazers_count"],
        "forks": data["forks_count"],
        "issues": data["open_issues_count"],
        "watchers": data["watchers_count"],
        "update": data["updated_at"],
    }


def _bounded_log_score(value: int, benchmark: int) -> float:
    if value <= 0:
        return 0

    return min(log1p(value) / log1p(benchmark), 1)


def _recency_score(updated_at: str | None) -> float:
    if not updated_at:
        return 5

    try:
        updated = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
    except ValueError:
        return 5

    age_days = (datetime.now(timezone.utc) - updated).days

    if age_days <= 30:
        return 10
    if age_days <= 180:
        return 8
    if age_days <= 365:
        return 5
    if age_days <= 730:
        return 2

    return 0


def calculate_health_score(
    stars: int,
    forks: int,
    issues: int,
    open_prs: int,
    watchers: int = 0,
    updated_at: str | None = None,
) -> int:
    stars = max(stars, 0)
    forks = max(forks, 0)
    issues = max(issues, 0)
    open_prs = max(open_prs, 0)
    watchers = max(watchers, 0)

    popularity_score = 15 * (
        0.55 * _bounded_log_score(stars, 50000)
        + 0.30 * _bounded_log_score(forks, 10000)
        + 0.15 * _bounded_log_score(watchers, 50000)
    )
    repo_signal = max(
        _bounded_log_score(stars, 1000),
        _bounded_log_score(forks, 200),
        _bounded_log_score(watchers, 1000),
    )
    maintenance_confidence = 0.25 + (0.75 * repo_signal)

    fork_ratio = forks / max(stars, 1)
    collaboration_score = 10 * min(fork_ratio / 0.25, 1)

    issue_capacity = max(10, stars * 0.02 + forks * 0.10)
    issue_pressure = issues / issue_capacity
    issue_score = (35 / (1 + issue_pressure)) * maintenance_confidence

    pr_capacity = max(5, forks * 0.03 + stars * 0.002)
    pr_pressure = open_prs / pr_capacity
    pr_score = (30 / (1 + pr_pressure)) * maintenance_confidence

    score = (
        popularity_score
        + collaboration_score
        + issue_score
        + pr_score
        + _recency_score(updated_at)
    )

    return round(max(0, min(100, score)))


def openPullRequests(owner: str, repo: str):
    url = f"https://api.github.com/repos/{owner}/{repo}/pulls"
    pull_requests = []
    page = 1

    while True:
        try:
            response = requests.get(
                url,
                headers=_github_headers(),
                params={"state": "open", "per_page": 100, "page": page},
                timeout=10,
            )
        except requests.RequestException:
            return None

        if response.status_code != 200:
            return None

        data = response.json()
        pull_requests.extend(
            {
                "number": pr["number"],
                "title": pr["title"],
                "author": pr["user"]["login"],
                "url": pr["html_url"],
                "created_at": pr["created_at"],
                "updated_at": pr["updated_at"],
            }
            for pr in data
        )

        if len(data) < 100:
            break

        page += 1

    return pull_requests
