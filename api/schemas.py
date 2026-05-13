from pydantic import Basemodel

class Repo(Basemodel):
    owner: str
    repo: str