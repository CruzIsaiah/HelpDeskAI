from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.rag.vector_search import retrieve_docs
from app.utils.llm import chat_completion
from app.services.device_service import fetch_all_devices
from app.db.database import get_db   # ✅ FIXED IMPORT

router = APIRouter(prefix="/rag", tags=["RAG"])


class QueryRequest(BaseModel):
    query: str


@router.post("/query")
async def rag_query(payload: QueryRequest, db: Session = Depends(get_db)):  # ✅ get_db now works
    query = payload.query

    # ------------------------------
    # 1. Retrieve Docs (RAG)
    # ------------------------------
    docs = retrieve_docs(query)
    context_docs = "\n".join(docs) if docs else "No relevant documents found."

    # ------------------------------
    # 2. Fetch Saved Devices
    # ------------------------------
    devices = fetch_all_devices(db)

    if devices:
        formatted_devices = "\n".join([
            f"- {d.type} | {d.name} | {d.model} | OS: {d.os_version or 'N/A'}"
            for d in devices
        ])
    else:
        formatted_devices = "User has no saved devices."

    # ------------------------------
    # 3. Build Prompt
    # ------------------------------
    system_prompt = (
        "You are a highly helpful troubleshooting assistant.\n"
        "You ALWAYS check the user's saved device list when answering.\n"
        "If the user asks 'what devices do I own?', return the device list.\n"
        "Use RAG document context only when relevant.\n"
        "If the context does not contain the answer, say so clearly.\n"
        "If troubleshooting is needed, tailor steps to the user's exact device.\n"
    )

    user_prompt = f"""
USER QUESTION:
{query}

USER DEVICES:
{formatted_devices}

DOCUMENT CONTEXT:
{context_docs}

Now produce the best possible answer using the information above.
"""

    # ------------------------------
    # 4. LLM response
    # ------------------------------
    answer = chat_completion(system_prompt, user_prompt)

    return {
        "query": query,
        "answer": answer,
        "sources": docs
    }
