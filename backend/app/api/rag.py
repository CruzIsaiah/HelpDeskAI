from fastapi import APIRouter
from pydantic import BaseModel
from app.rag.vector_search import retrieve_docs
from app.utils.llm import chat_completion

router = APIRouter(tags=["RAG"])

class QueryRequest(BaseModel):
    query: str

@router.post("/query")
async def rag_query(payload: QueryRequest):
    query = payload.query

    docs = retrieve_docs(query)

    context = "\n".join(docs) if docs else "No relevant documents found."

    system_prompt = (
        "You are a helpful support assistant. "
        "Use the provided context to answer the user's question. "
        "If the context does not contain the answer, say so clearly."
    )

    user_prompt = f"Context:\n{context}\n\nUser question: {query}\n\nAnswer:"

    answer = chat_completion(system_prompt, user_prompt)

    return {
        "query": query,
        "answer": answer,
        "sources": docs
    }
