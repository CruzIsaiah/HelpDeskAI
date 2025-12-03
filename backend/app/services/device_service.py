# backend/app/services/device_service.py

from sqlalchemy.orm import Session
from app.db.models import UserDevice

def fetch_all_devices(db: Session):
    """
    Returns all saved user devices using a normal SQLAlchemy sync session.
    """
    return db.query(UserDevice).all()
