from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import Repo
import models
from github_service import openPullRequests, repoData
from database import engine


app = FastAPI()

models.Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"Output": "Gitanalyze is ready to start!"}

@app.get("/")
def stats(owner: str, repo: str):
    data = repoData(owner, repo)
    
    if data is None:
        raise HTTPException(status_code=404, detail="Repository not found or GitHub request failed")

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

@app.post("/repos")
def saveRepo(repo: Repo):
    db: Session = SessionLocal()

    newRepo = models.Repo(
        creator=repo.owner,
        name=repo.repo
    )

    db.add(newRepo)
    db.commit()
    db.refresh(newRepo)
    db.close()

    return {
        "message": "Repo saved",
        "repo_id": newRepo.id,
        "owner": newRepo.creator,
        "repo": newRepo.name
    }

#get all the information from the sqlite File 

@app.get("/repos")
def getRepo():
    
    db: Session = SessionLocal()

    repos = db.query(models.Repo).all 
    db.close
    return repos


