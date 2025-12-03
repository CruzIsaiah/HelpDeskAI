from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.rag.vector_search import retrieve_docs
from app.utils.llm import chat_completion
from app.db.database import get_db
from app.db.models import UserDevice
from app.services.device_matcher import detect_device_type

router = APIRouter(tags=["RAG"])


class QueryRequest(BaseModel):
    query: str


def get_device_context(db: Session):
    return db.query(UserDevice).all()


@router.post("/query")
async def rag_query(payload: QueryRequest, db: Session = Depends(get_db)):
    query = payload.query.strip()

    # ---------------------------
    # Detect the device user is talking about
    # ---------------------------
    detected_device = detect_device_type(query)
    saved_devices = get_device_context(db)

    # Does user have any matching saved device?
    matched = None
    if detected_device:
        for d in saved_devices:
            if d.type == detected_device:
                matched = d
                break

    # If detected device exists BUT not in user’s saved list → ask them
    if detected_device and not matched:
        return {
            "needs_device": True,
            "message": (
                f"It sounds like you're asking about a **{detected_device}**, "
                "but you don't have one saved in your device list.\n\n"
                "Please add it first so I can give accurate troubleshooting."
            )
        }

    # ---------------------------
    # If device is matched → continue normally
    # ---------------------------
    device_summary = "No device info."
    if matched:
        device_summary = (
            f"{matched.type.capitalize()} — {matched.name} {matched.model or ''} "
            f"(OS: {matched.os_version or 'unknown'})"
        )

    docs = retrieve_docs(query)
    context_docs = "\n".join(docs) if docs else "No relevant documents found."

    system_prompt = (
        "You are a helpful troubleshooting assistant. "
        "Use BOTH the documentation context and the user's device details "
        "to provide correct steps."
    )

    user_prompt = f"""
User Device:
{device_summary}

Documentation Context:
{context_docs}

User Question:
{query}

Provide a clear, helpful solution:
"""

    answer = chat_completion(system_prompt, user_prompt)

    return {
        "device_used": device_summary,
        "answer": answer,
        "sources": docs,
        "needs_device": False,
    }
