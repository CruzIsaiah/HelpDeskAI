# HelpDesk - Voice-Based Troubleshooting System

A comprehensive help desk application that uses voice recording, AI transcription, RAG-based troubleshooting, and automated manual generation.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React/Next.js)               │
│  - Voice recording → Whisper STT                            │
│  - Interactive troubleshooting panel                        │
│  - PDF/Markdown manual download                             │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP API
┌──────────────────────▼──────────────────────────────────────┐
│                    BACKEND (FastAPI)                         │
│  - Audio transcription (Whisper)                            │
│  - NLP entity extraction                                    │
│  - RAG Pipeline:                                            │
│    • Pinecone vector search                                │
│    • Context assembly                                      │
│    • LLM reasoning (GPT-3.5)                               │
│  - Manual generation (PDF/Markdown)                        │
│  - Session management (PostgreSQL)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    PostgreSQL    Pinecone         S3/GCS
    (Sessions)    (Vector DB)    (File Storage)
```

## Tech Stack

### Frontend

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios

### Backend

- **Framework**: FastAPI
- **Language**: Python 3.11
- **Database**: PostgreSQL
- **Vector DB**: Pinecone
- **LLM**: OpenAI GPT-3.5-turbo
- **Embeddings**: SentenceTransformers
- **Storage**: AWS S3 / Google Cloud Storage
- **Document Generation**: ReportLab

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15

## Setup Instructions

### Prerequisites

- Docker & Docker Compose
- OpenAI API Key
- Pinecone API Key
- AWS/GCS credentials (for file storage)
- PostgreSQL (optional if using Docker)

### Environment Setup

1. **Backend Configuration**

   ```bash
   cp backend/.env.example backend/.env
   ```

   Edit `backend/.env` with your credentials:

   ```env
   DATABASE_URL=postgresql://helpdesk:password@localhost:5432/helpdesk
   OPENAI_API_KEY=sk-...
   PINECONE_API_KEY=...
   PINECONE_INDEX_NAME=helpdesk-docs
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_BUCKET_NAME=helpdesk-storage
   ```

2. **Frontend Configuration**
   ```bash
   cp frontend/.env.example frontend/.env
   ```

### Running with Docker Compose

```bash
docker-compose up -d
```

Access:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Running Locally (Development)

**Backend**:

```bash
cd backend
pip install -r requirements.txt
python run.py
```

**Frontend**:

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
HelpDesk/
├── frontend/                    # React/Next.js application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Next.js pages
│   │   └── hooks/              # Custom React hooks
│   ├── public/                 # Static files
│   └── package.json
│
├── backend/                     # FastAPI application
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── services/          # Business logic
│   │   ├── models/            # SQLAlchemy models
│   │   ├── db/                # Database configuration
│   │   ├── rag/               # RAG pipeline
│   │   │   ├── entity_extraction.py
│   │   │   ├── vector_search.py
│   │   │   └── llm_reasoning.py
│   │   └── utils/             # Utilities
│   ├── tests/                 # Test files
│   ├── requirements.txt
│   └── run.py
│
├── config/                     # Configuration files
├── docs/                       # Documentation
└── docker-compose.yml
```

## API Endpoints

### Transcription

- **POST** `/api/transcribe` - Transcribe audio file
  - Request: `multipart/form-data` with audio file
  - Response: `{ session_id, transcript, status }`

### Troubleshooting

- **POST** `/api/troubleshoot` - Get troubleshooting solution
  - Request: `{ transcript, session_id }`
  - Response: `{ session_id, solution, status }`

### Manual Generation

- **POST** `/api/generate-manual` - Generate PDF/Markdown manual
  - Request: `{ issue_description, solution, format }`
  - Response: `{ content, format, status }`

## Database Schema

### user_sessions

```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY,
  transcript TEXT,
  solution TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### manuals

```sql
CREATE TABLE manuals (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  format VARCHAR(50),
  created_at TIMESTAMP
);
```

### contributed_solutions

```sql
CREATE TABLE contributed_solutions (
  id UUID PRIMARY KEY,
  issue VARCHAR(255),
  solution TEXT,
  created_at TIMESTAMP
);
```

## Pinecone Vector Database

The system uses Pinecone to store and search documentation:

**Stored Categories**:

- Documentation chunks
- Community solutions
- Troubleshooting steps
- Error messages

**Embedding Model**: `all-MiniLM-L6-v2` (SentenceTransformers)

## Features

✅ **Voice Recording** - Web-based microphone recording
✅ **Whisper Transcription** - OpenAI Whisper STT
✅ **Entity Extraction** - NLP-based keyword extraction
✅ **RAG Pipeline** - Retrieval-Augmented Generation with Pinecone
✅ **LLM Reasoning** - GPT-3.5 reasoning over context
✅ **Session Management** - Track user sessions in PostgreSQL
✅ **Manual Generation** - Auto-generate PDF/Markdown manuals
✅ **File Storage** - AWS S3 or Google Cloud Storage
✅ **Interactive UI** - Real-time troubleshooting interface

## Development Roadmap

- [ ] User authentication & authorization
- [ ] Admin dashboard for solution management
- [ ] Community contribution system
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Caching layer (Redis)
- [ ] Rate limiting
- [ ] Advanced logging & monitoring

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create a GitHub issue or contact the development team.
