import os
import uuid
from dotenv import load_dotenv

# ----------------------------------------------------
# Load .env manually — required for python -m execution
# ----------------------------------------------------
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
ENV_PATH = os.path.join(ROOT_DIR, ".env")

load_dotenv(ENV_PATH)

# ----------------------------------------------------
# Imports AFTER .env is loaded
# ----------------------------------------------------
from pinecone import Pinecone
from app.utils.embeddings import embed_text

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "helpdesk-ai")

if not PINECONE_API_KEY:
    raise RuntimeError("❌ PINECONE_API_KEY is missing from .env")

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

# Directory where documents live
DOCS_DIR = os.path.join(ROOT_DIR, "docs", "manuals")


def load_documents():
    """Load all .txt and .md files from docs/manuals."""
    if not os.path.exists(DOCS_DIR):
        print(f"❌ Directory not found: {DOCS_DIR}")
        return []

    docs = []
    for f in os.listdir(DOCS_DIR):
        if f.endswith(".txt") or f.endswith(".md"):
            path = os.path.join(DOCS_DIR, f)
            with open(path, "r", encoding="utf-8") as file:
                docs.append(file.read())
    return docs


def chunk_text(text: str, max_length=500):
    """Split text into token-sized chunks."""
    words = text.split()
    chunks = []
    current = []

    for w in words:
        current.append(w)
        if len(current) >= max_length:
            chunks.append(" ".join(current))
            current = []

    if current:
        chunks.append(" ".join(current))

    return chunks


def ingest():
    """Main ingestion pipeline."""

    print("🚀 Starting Pinecone ingestion...")
    print(f"📂 Looking for docs inside: {DOCS_DIR}")

    docs = load_documents()
    if not docs:
        print("❌ No documents found. Add files to docs/manuals/")
        return

    print(f"📄 Found {len(docs)} documents.")

    total_chunks = 0

    for doc in docs:
        chunks = chunk_text(doc)

        for ch in chunks:
            vector = embed_text(ch)
            uid = str(uuid.uuid4())

            index.upsert([
                {
                    "id": uid,
                    "values": vector,
                    "metadata": {"text": ch}
                }
            ])

        total_chunks += len(chunks)

    print(f"🎉 Ingestion complete! Uploaded {total_chunks} chunks.")


if __name__ == "__main__":
    ingest()
