# backend/app/rag/vector_search.py

import os
from pinecone import Pinecone
from app.utils.embeddings import embed_text

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "helpdesk-ai")

# Initialize pinecone client and index using Pinecone class (client v3)
if PINECONE_API_KEY:
    pc = Pinecone(api_key=PINECONE_API_KEY)
    index = pc.Index(PINECONE_INDEX_NAME)
else:
    index = None


def retrieve_docs(query: str, top_k: int = 5):
    """
    Embed the query, search Pinecone, and return retrieved text chunks.
    """
    query_vector = embed_text(query)

    if index is None:
        return []

    result = index.query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True
    )

    docs = []
    for match in result.get("matches", []):
        metadata = match.get("metadata", {})
        txt = metadata.get("text")
        if txt:
            docs.append(txt)

    return docs
