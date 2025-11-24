# backend/app/services/whisper_service.py

"""
Whisper transcription using OpenAI API.
"""

from dotenv import load_dotenv
import os
import io
from fastapi import UploadFile

load_dotenv()

try:
    from openai import OpenAI
    _client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
except Exception:
    _client = None


def transcribe_bytes(
    audio_bytes: bytes,
    filename: str = "audio.wav",
    model: str = None,
    language: str = "en"
) -> str:
    """
    Transcribe raw audio bytes using OpenAI Whisper API.
    """
    if _client is None:
        raise RuntimeError("OpenAI client not configured")

    model = model or os.getenv("WHISPER_MODEL", "whisper-1")

    audio_file = io.BytesIO(audio_bytes)
    audio_file.name = filename

    resp = _client.audio.transcriptions.create(
        file=audio_file,
        model=model,
        language=language
    )

    if hasattr(resp, "text"):
        return resp.text

    try:
        return resp["text"]
    except Exception:
        return str(resp)


async def transcribe_audio(file: UploadFile) -> str:
    """
    FastAPI wrapper for uploaded audio file.
    """
    audio_bytes = await file.read()
    return transcribe_bytes(audio_bytes, filename=file.filename)
