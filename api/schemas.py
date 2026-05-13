from pydantic import BaseModel

class Repo(BaseModel):
    owner: str
    repo: str