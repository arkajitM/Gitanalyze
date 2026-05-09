from sqlalchemy import Column, Integer, String
from database import Base

class Repo(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True)
    creator = Column(String, nullable=False)
    name = Column(String, nullable=False)
    