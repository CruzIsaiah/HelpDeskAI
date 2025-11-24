# backend/app/utils/embeddings.py

import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def embed_text(text: str):
    """
    Returns embedding vector for text using OpenAI embeddings.
    """
    response = client.embeddings.create(
        model=os.getenv("EMBED_MODEL", "text-embedding-3-small"),
        input=text
    )
    return response.data[0].embedding
