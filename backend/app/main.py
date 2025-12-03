# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(
    title="HelpDesk API",
    description="Voice-based troubleshooting system with RAG",
    version="1.0.0"
)

# ------------------------------
# CORS
# ------------------------------
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# DATABASE INIT
# ------------------------------
from app.db.database import init_db

@app.on_event("startup")
async def startup():
    await init_db()

# ------------------------------
# ROUTERS
# ------------------------------
from app.api import (
    transcribe,
    troubleshoot,
    history,
    manual,
    rag,
    auth,
    devices
)

app.include_router(transcribe.router, prefix="/api")
app.include_router(troubleshoot.router, prefix="/api")
app.include_router(history.router, prefix="/api")
app.include_router(manual.router, prefix="/api")
app.include_router(rag.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(devices.router, prefix="/api")


# ------------------------------
# ROOT / HEALTH
# ------------------------------
@app.get("/")
async def root():
    return {"message": "HelpDesk API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
