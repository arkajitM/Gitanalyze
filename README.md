# Gitanalyze

A lightweight GitHub analytics API built with FastAPI that analyzes repository activity and calculates a custom repository health score.

## Features

- GitHub repository analytics
- Tracks:
  - Stars
  - Forks
  - Watchers
  - Open Issues
  - Open Pull Requests
  - Last Updated Date
- Custom health score system
- REST API with FastAPI

## Tech Stack

- Python
- FastAPI
- SQLite
- SQLAlchemy
- Pydantic

## Example Request

```http
GET /?owner=facebook&repo=react
```

## Example Response

```json
{
  "stars": 235000,
  "forks": 49000,
  "watchers": 6800,
  "open_issues": 1200,
  "open_pull_requests": 250,
  "health_score": 87
}
```

## Run Locally

```bash
git clone https://github.com/arkajitM/Gitanalyze.git
cd Gitanalyze

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload
```

## Future Improvements

- React + Tailwind dashboard
- Charts and trend tracking
- Docker deployment
- CI/CD integration

Built by Arkajit Mukherjee
