# backend/app/db/models.py

from sqlalchemy import Column, Integer, Text, DateTime, func
from sqlalchemy.types import JSON
from app.db.database import Base

class HelpdeskSession(Base):
    """
    Stores each troubleshooting request:
    - Transcript
    - Extracted entities
    - Steps returned to user
    - Manual (markdown)
    """
    __tablename__ = "helpdesk_sessions"

    id = Column(Integer, primary_key=True, index=True)
    transcript = Column(Text, nullable=False)
    entities = Column(JSON, nullable=True)
    steps = Column(JSON, nullable=True)
    manual_markdown = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
