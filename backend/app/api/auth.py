# backend/app/api/auth.py

from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# Dummy in-memory "database"
users = {}

@router.post("/register")
def register(username: str, password: str):
    if username in users:
        raise HTTPException(status_code=400, detail="User already exists")
    users[username] = password
    return {"message": "User registered successfully"}

@router.post("/login")
def login(username: str, password: str):
    if username not in users:
        raise HTTPException(status_code=404, detail="User not found")
    if users[username] != password:
        raise HTTPException(status_code=401, detail="Invalid password")
    return {"message": "Login successful"}
