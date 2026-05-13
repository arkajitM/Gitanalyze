import requests
import os


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
        "forks": data["fork_count"],
        "issues": data["open_issues_count"],
        "watchers": data["watcher_count"],
        "update": data["updated_at"],
    }


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
