import os
from dotenv import load_dotenv

# Load .env from project root
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
ENV_PATH = os.path.join(ROOT, ".env")
load_dotenv(ENV_PATH)

from pinecone import Pinecone
from app.utils.embeddings import embed_text

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)


def test_query(query: str):
    print(f"\n🔎 Querying Pinecone for:\n{query}\n")

    embedding = embed_text(query)

    result = index.query(
        vector=embedding,
        top_k=3,
        include_metadata=True
    )

    matches = result.get("matches", [])
    if not matches:
        print("❌ No results found.")
        return

    for i, match in enumerate(matches, start=1):
        score = match.get("score", 0)
        text = match.get("metadata", {}).get("text", "[no text]")
        print(f"\n--- Result {i} (score: {score:.4f}) ---")
        print(text)


if __name__ == "__main__":
    # Try a few queries
    test_query("wifi not working")
    test_query("router reset instructions")
    test_query("printer printing blank pages")
