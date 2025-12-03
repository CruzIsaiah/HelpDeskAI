# backend/app/api/devices.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.db.models import UserDevice


router = APIRouter(prefix="/devices", tags=["Devices"])

# -------------------------
# Pydantic Schemas
# -------------------------

class DeviceCreate(BaseModel):
    name: str
    type: str | None = None
    model: str | None = None
    os_version: str | None = None
    notes: str | None = None

class DeviceResponse(DeviceCreate):
    id: int

    class Config:
        orm_mode = True

# -------------------------
# POST /devices (create)
# -------------------------

@router.post("/", response_model=DeviceResponse)
def add_device(device: DeviceCreate, db: Session = Depends(get_db)):
    db_device = UserDevice(
        name=device.name,
        type=device.type,
        model=device.model,
        os_version=device.os_version,
        notes=device.notes
    )
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

# -------------------------
# GET /devices (list all)
# -------------------------

@router.get("/", response_model=list[DeviceResponse])
def get_devices(db: Session = Depends(get_db)):
    return db.query(UserDevice).all()

# -------------------------
# DELETE /devices/{id}
# -------------------------

@router.delete("/{device_id}")
def delete_device(device_id: int, db: Session = Depends(get_db)):
    device = db.query(UserDevice).filter(UserDevice.id == device_id).first()
    if not device:
        return {"error": "Device not found"}

    db.delete(device)
    db.commit()
    return {"message": "Device deleted"}
