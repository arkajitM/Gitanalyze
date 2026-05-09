from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

dbURL = "sqlite:///./gitanalyze.db"

engine = create_engine(
    dbURL, 
    connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

