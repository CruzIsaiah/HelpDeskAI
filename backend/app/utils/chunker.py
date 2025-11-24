# backend/app/utils/chunker.py

from typing import List

def chunk_text(text: str, max_chars: int = 800) -> List[str]:
    """
    Splits long text into smaller chunks for embedding/storage.
    Uses character-based chunking with sentence boundary preference.
    """
    text = text.strip()
    chunks = []

    while len(text) > max_chars:
        cut = text.rfind(".", 0, max_chars)
        if cut == -1:
            cut = max_chars
        chunk = text[:cut].strip()
        chunks.append(chunk)
        text = text[cut:].strip()

    if text:
        chunks.append(text)

    return chunks
