from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from schemas import Repo
import models
from github_service import calculate_health_score, openPullRequests, repoData
from database import engine


app = FastAPI()

models.Base.metadata.create_all(bind=engine)



@app.get("/test")
def home():
    return {"Output": "Gitanalyze is ready to start!"}

@app.get("/repos/{owner}/{repo}/stats")
def stats(owner: str, repo: str):
    data = repoData(owner, repo)
    
    if data is None:
        raise HTTPException(status_code=404, detail="Repository not found or GitHub request failed")

    pull_requests = openPullRequests(owner, repo)

    if pull_requests is None:
        raise HTTPException(status_code=404, detail="Repository not found or GitHub request failed")

    open_prs = len(pull_requests)
    open_issues = max(data["issues"] - open_prs, 0)
    health_score = calculate_health_score(
        stars=data["stars"],
        forks=data["forks"],
        issues=open_issues,
        open_prs=open_prs,
        watchers=data["watchers"],
        updated_at=data["update"],
    )

    return {
        "owner": owner,
        "repo": repo,
        "stars": data["stars"],
        "forks": data["forks"],
        "watchers": data["watchers"],
        "open_issues": open_issues,
        "open_prs": open_prs,
        "updated_at": data["update"],
        "health_score": health_score,
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

    repos = db.query(models.Repo).all()
    db.close()
    return repos

#view history 
@app.post("/history")
def history(owner: str, repo: str):
    data = repoData(owner, repo)

    if data is None:
        raise HTTPException(status_code=404, detail="Repository not found or GitHub request failed")

    pull_requests = openPullRequests(owner, repo)

    if pull_requests is None:
        raise HTTPException(status_code=404, detail="Repository not found or GitHub request failed")

    open_prs = len(pull_requests)
    open_issues = max(data["issues"] - open_prs, 0)
    health_score = calculate_health_score(
        stars=data["stars"],
        forks=data["forks"],
        issues=open_issues,
        open_prs=open_prs,
        watchers=data["watchers"],
        updated_at=data["update"],
    )
    
    db: Session = SessionLocal()

    history = models.RepoHistory(
        creator=owner,
        name=repo,
        stars=data["stars"],
        forks=data["forks"],
        issues=open_issues,
        openPrs=open_prs,
        healthScore=health_score,
    )

    db.add(history)
    db.commit()
    db.refresh(history)
    db.close()

    return history

#retrieve history

@app.get("/get_history")
def retrieveHistory(owner: str, repo: str):

    db: Session = SessionLocal()

    log = (
        db.query(models.RepoHistory)
        .filter(
            models.RepoHistory.creator == owner, 
            models.RepoHistory.name == repo
        )
    .all()
    ) 
    db.close()
    return log


