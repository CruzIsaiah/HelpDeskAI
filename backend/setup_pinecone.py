#!/usr/bin/env python3
"""
Setup script for Pinecone index and knowledge base ingestion.
Run this to create the Pinecone index and ingest all documents.
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Resolve locations relative to this file so the script works when
# invoked from a different CWD.
SCRIPT_DIR = Path(__file__).resolve().parent
load_dotenv(dotenv_path=SCRIPT_DIR / ".env")

# Check if Pinecone API key is set
pinecone_key = os.getenv("PINECONE_API_KEY")
if not pinecone_key:
    print("❌ Error: PINECONE_API_KEY not found in environment variables")
    print("Please set it in your backend/.env file")
    sys.exit(1)

from pinecone import Pinecone, ServerlessSpec
from app.utils.embeddings import embed_text
from app.utils.chunker import chunk_text

def create_index():
    """Create Pinecone index if it doesn't exist"""
    index_name = os.getenv("PINECONE_INDEX_NAME", "helpdesk-ai")
    pinecone_environment = os.getenv("PINECONE_ENV") or os.getenv("PINECONE_ENVIRONMENT")

    print(f"🔍 Initializing Pinecone client (env={pinecone_environment})...")
    try:
        pc = Pinecone(api_key=pinecone_key)
    except Exception as e:
        print(f"❌ Error initializing Pinecone client: {e}")
        sys.exit(1)

    print(f"🔍 Checking if index '{index_name}' exists...")
    try:
        indexes_obj = pc.list_indexes()
    except Exception as e:
        print(f"❌ Error listing indexes: {e}")
        sys.exit(1)

    # `list_indexes` may return a names list or an object with `.names()`
    if hasattr(indexes_obj, "names"):
        existing = indexes_obj.names()
    elif isinstance(indexes_obj, (list, tuple)):
        existing = list(indexes_obj)
    else:
        existing = []

    if index_name in existing:
        print(f"✅ Index '{index_name}' already exists")
        return pc.Index(index_name)

    print(f"📌 Creating new index '{index_name}'...")
    try:
        # Use ServerlessSpec if available in this client
        try:
            spec = ServerlessSpec(cloud="aws", region="us-east-1")
            pc.create_index(name=index_name, dimension=1536, metric="cosine", spec=spec)
        except Exception:
            pc.create_index(name=index_name, dimension=1536, metric="cosine")

        print(f"✅ Index '{index_name}' created successfully")
        return pc.Index(index_name)
    except Exception as e:
        print(f"❌ Error creating index: {e}")
        sys.exit(1)

def ingest_documents(index):
    """Ingest all knowledge base documents into Pinecone"""
    
    # Path to knowledge base (relative to this script)
    kb_path = SCRIPT_DIR / "docs" / "manuals"
    
    if not kb_path.exists():
        print(f"❌ Knowledge base path not found: {kb_path}")
        sys.exit(1)
    
    print(f"📚 Ingesting documents from {kb_path}...")
    
    documents = []
    doc_id = 0
    
    # Process all files
    for file_path in kb_path.glob("*"):
        if file_path.is_file():
            try:
                print(f"📄 Processing {file_path.name}...")
                
                # Read file content
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Chunk the document
                chunks = chunk_text(content, max_chars=800)
                print(f"   └─ Created {len(chunks)} chunks")
                
                # Process each chunk
                for i, chunk in enumerate(chunks):
                    # Create embedding
                    embedding = embed_text(chunk)

                    # Create metadata
                    metadata = {
                        "text": chunk,
                        "source_file": file_path.name,
                        "chunk_index": i,
                        "total_chunks": len(chunks)
                    }

                    documents.append({
                        "id": f"doc_{doc_id}_{i}",
                        "values": embedding,
                        "metadata": metadata
                    })
                
                doc_id += 1
                
            except Exception as e:
                print(f"❌ Error processing {file_path.name}: {e}")
                continue
    
    print(f"📊 Total vectors to upsert: {len(documents)}")
    
    if not documents:
        print("❌ No documents found to ingest")
        return
    
    # Upsert in batches
    batch_size = 100
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i + batch_size]
        # Convert to tuples (id, vector, metadata) which is widely accepted by pinecone
        upsert_payload = [(d["id"], d["values"], d["metadata"]) for d in batch]
        try:
            index.upsert(vectors=upsert_payload)
            print(f"✅ Upserted batch {i//batch_size + 1}/{(len(documents)-1)//batch_size + 1}")
        except Exception as e:
            print(f"❌ Error upserting batch: {e}")
            sys.exit(1)
    
    print(f"🎉 Successfully ingested {len(documents)} document chunks!")

def main():
    """Main setup function"""
    print("🚀 Starting Pinecone setup for HelpDesk AI...")
    print("=" * 50)
    
    # Create index
    index = create_index()
    
    print()
    
    # Ingest documents
    ingest_documents(index)
    
    print()
    print("=" * 50)
    print("✅ Setup completed successfully!")
    print("📊 Index stats:")
    
    try:
        stats = index.describe_index_stats()
        # stats is a dict; try common keys
        total = stats.get("total_vector_count") or stats.get("namespaces", {})
        if isinstance(total, dict):
            # fallback to sum of namespace counts
            total_vectors = sum(ns.get("vector_count", 0) for ns in total.values())
        else:
            total_vectors = total
        print(f"   Total vectors: {total_vectors}")
    except Exception as e:
        print(f"   Could not fetch stats: {e}")

if __name__ == "__main__":
    main()
