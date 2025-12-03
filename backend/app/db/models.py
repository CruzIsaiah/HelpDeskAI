# backend/app/db/models.py

from sqlalchemy import Column, Integer, Text, DateTime, func, String
from sqlalchemy.types import JSON
from app.db.database import Base

class HelpdeskSession(Base):
    __tablename__ = "helpdesk_sessions"

    id = Column(Integer, primary_key=True, index=True)
    transcript = Column(Text, nullable=False)
    entities = Column(JSON, nullable=True)
    steps = Column(JSON, nullable=True)
    manual_markdown = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class UserDevice(Base):
    __tablename__ = "user_devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=True)
    model = Column(String, nullable=True)
    os_version = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
