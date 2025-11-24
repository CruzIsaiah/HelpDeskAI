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

# CORS middleware
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
from app.db.database import init_db

@app.on_event("startup")
async def startup():
    await init_db()

# Import routers after app is created
from app.api import transcribe, troubleshoot
from app.api.rag import router as rag_router

# Attach routers
app.include_router(transcribe.router, prefix="/api")
app.include_router(troubleshoot.router, prefix="/api")
app.include_router(rag_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "HelpDesk API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
