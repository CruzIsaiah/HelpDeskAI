# backend/app/services/device_service.py

from sqlalchemy.orm import Session
from app.db.models import UserDevice
from app.db.database import get_db

def fetch_all_devices(db: Session):
    return db.query(UserDevice).all()
