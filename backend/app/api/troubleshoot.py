# backend/app/api/troubleshoot.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.db.database import get_db
from app.db.models import HelpdeskSession

from app.rag.entity_extraction import extract_entities
from app.rag.vector_search import retrieve_docs
from app.rag.llm_reasoning import generate_steps_and_manual
from app.rag.llm_reasoning import Step


router = APIRouter(prefix="/troubleshoot", tags=["Troubleshooting"])


# -------------------------
# Request / Response Models
# -------------------------

class TroubleshootRequest(BaseModel):
    transcript: str


class TroubleshootResponse(BaseModel):
    entities: Dict[str, Any]
    steps: List[Step]
    manual_markdown: str


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
    Saves the session and returns a full troubleshooting response.
    """
    try:
        query = req.transcript

        # 1. Extract entities
        entities = extract_entities(query)

        # 2. Retrieve relevant docs from Pinecone
        docs = retrieve_docs(query)

        # 3. Generate steps + manual markdown
        steps, manual_md = generate_steps_and_manual(query, docs, entities)

        # 4. Save session to DB
        session = HelpdeskSession(
            transcript=query,
            entities=entities,
            steps=[s.dict() for s in steps],
            manual_markdown=manual_md
        )
        db.add(session)
        db.commit()
        db.refresh(session)

        # 5. Return the response
        return TroubleshootResponse(
            entities=entities,
            steps=steps,
            manual_markdown=manual_md
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
