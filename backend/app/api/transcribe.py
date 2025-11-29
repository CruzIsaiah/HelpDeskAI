# backend/app/api/transcribe.py

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from app.services.whisper_service import transcribe_audio
from uuid import uuid4
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import HelpdeskSession

router = APIRouter(prefix="/transcribe", tags=["Transcription"])

class TranscribeResponse(BaseModel):
    session_id: str
    transcript: str

@router.post("/", response_model=TranscribeResponse)
async def transcribe(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Accept an audio file and return the transcription with a generated session ID.
    """
    try:
        text = await transcribe_audio(file)
        
        # Generate a session ID
        session_id = str(uuid4())
        
        # Create initial session in database
        session = HelpdeskSession(
            transcript=text,
            entities={},
            steps=[],
            manual_markdown=""
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        
        return {"session_id": session_id, "transcript": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
