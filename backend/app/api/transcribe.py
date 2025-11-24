# backend/app/api/transcribe.py

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.whisper_service import transcribe_audio

router = APIRouter(prefix="/transcribe", tags=["Transcription"])

@router.post("/")
async def transcribe(file: UploadFile = File(...)):
    """
    Accept an audio file and return the transcription.
    """
    try:
        text = await transcribe_audio(file)
        return {"transcript": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
