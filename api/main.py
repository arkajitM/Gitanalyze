from fastapi import FastAPI, HTTPException

import models
from github_service import openPullRequests
from database import engine


app = FastAPI()

models.Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"Output": "Gitanalyze is ready to start!"}


@app.get("/repos/{owner}/{repo}/pulls/open")
def get_open_pull_requests(owner: str, repo: str):
    pull_requests = openPullRequests(owner, repo)

    if pull_requests is None:
        raise HTTPException(status_code=404, detail="Repository not found or GitHub request failed")

    return {
        "owner": owner,
        "repo": repo,
        "count": len(pull_requests),
        "pull_requests": pull_requests,
    }

