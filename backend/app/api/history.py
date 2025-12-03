from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.database import get_db

router = APIRouter(prefix="/history", tags=["History"])

@router.get("/")
def get_history(db: Session = Depends(get_db)):
    query = text("""
        SELECT id, transcript, manual_markdown, created_at
        FROM helpdesk_sessions
        ORDER BY created_at DESC
    """)

    rows = db.execute(query).fetchall()

    result = []
    for row in rows:
        result.append({
            "id": str(row.id),
            "transcript": row.transcript or "",
            "manual_markdown": row.manual_markdown or "",
            "created_at": str(row.created_at) if row.created_at else ""
        })

    return result
