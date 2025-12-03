# backend/app/api/troubleshoot.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from uuid import uuid4

from app.db.database import get_db
from app.db.models import HelpdeskSession

from app.rag.entity_extraction import extract_entities
from app.rag.vector_search import retrieve_docs
from app.rag.llm_reasoning import generate_steps_and_manual
from app.rag.llm_reasoning import Step
from app.services.device_service import fetch_all_devices



router = APIRouter(prefix="/troubleshoot", tags=["Troubleshooting"])


# -------------------------
# Request / Response Models
# -------------------------

class TroubleshootRequest(BaseModel):
    transcript: str
    session_id: Optional[str] = None


class StepResponse(BaseModel):
    id: int
    text: str
    status: Optional[str] = None  # "pending", "completed", "skipped"


class TroubleshootResponse(BaseModel):
    session_id: str
    entities: Dict[str, Any]
    steps: List[StepResponse]
    manual_markdown: str
    solution: Dict[str, str]  # Frontend compatibility


# -------------------------
# Endpoint
# -------------------------

@router.post("/", response_model=TroubleshootResponse)
async def troubleshoot(req: TroubleshootRequest, db: Session = Depends(get_db)):
    """
    Takes the transcript, runs:
        - Entity extraction
        - Pinecone retrieval
        - LLM reasoning
    Updates or creates a session and returns a full troubleshooting response.
    """
    try:
        query = req.transcript

        # 1. Extract entities
        entities = extract_entities(query)

        # 2. Retrieve relevant docs from Pinecone
        docs = retrieve_docs(query)

        # 3. Generate steps + manual markdown
        steps, manual_md = generate_steps_and_manual(query, docs, entities)

        # 4. Convert steps to response format with initial "pending" status
        step_responses = [
            StepResponse(id=step.id, text=step.text, status="pending")
            for step in steps
        ]

        # 5. Handle session - either create new or update existing
        session_id = req.session_id or str(uuid4())
        
        # Check if session exists (for updates)
        existing_session = db.query(HelpdeskSession).filter(
            HelpdeskSession.id == session_id
        ).first() if req.session_id else None

        if existing_session:
            # Update existing session
            existing_session.entities = entities
            existing_session.steps = [s.dict() for s in step_responses]
            existing_session.manual_markdown = manual_md
            db.commit()
            db.refresh(existing_session)
        else:
            # Create new session
            new_session = HelpdeskSession(
                transcript=query,
                entities=entities,
                steps=[s.dict() for s in step_responses],
                manual_markdown=manual_md
            )
            db.add(new_session)
            db.commit()
            db.refresh(new_session)

        # 6. Return the response in format frontend expects
        return TroubleshootResponse(
            session_id=session_id,
            entities=entities,
            steps=step_responses,
            manual_markdown=manual_md,
            solution={"solution": manual_md}  # Frontend compatibility
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
