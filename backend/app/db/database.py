# backend/app/db/database.py

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

# Default: SQLite (local development)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./helpdesk.db")

# SQLite requires this, Postgres doesn’t
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


async def init_db():
    """
    Initializes the database by creating all defined tables.
    Called during FastAPI startup event.
    """
    from app.db import models  # ensures models are registered
    Base.metadata.create_all(bind=engine)


def get_db():
    """
    FastAPI dependency — yields a DB session for each request.
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
