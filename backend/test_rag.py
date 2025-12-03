import os
from dotenv import load_dotenv
load_dotenv()

from app.rag.vector_search import retrieve_docs

results = retrieve_docs('How do I connect to WiFi on Windows')
print(f'Found {len(results)} docs')
for i, doc in enumerate(results):
    print(f'\n--- Doc {i+1} ---')
    print(doc[:300] + '...')
