from sqlalchemy import Column, Integer, String, DateTime
from database import Base
from datetime import datetime, timezone

class Repo(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True)
    creator = Column(String, nullable=False)
    name = Column(String, nullable=False)

class RepoHistory(Base):
    __tablename__ = "log"

    id = Column(Integer, primary_key=True)
    creator = Column(String, nullable=False)
    name = Column(String, nullable=False)
    
    stars = Column(Integer)
    forks = Column(Integer)
    issues = Column(Integer)
    openPrs = Column(Integer)
    healthScore = Column(Integer)
    
    time = Column(DateTime, default=lambda: datetime.now(timezone.utc))
