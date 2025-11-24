# HelpDesk AI – Cloud-Deployed Voice Support Agent

HelpDesk AI is a voice-powered troubleshooting assistant that allows users to **speak their technical issue** and instantly receive **AI-generated step-by-step solutions**.  
The system uses Whisper for transcription, a RAG pipeline for knowledge retrieval, and an LLM for generating clear troubleshooting instructions.  
It is fully cloud-deployable and will be hosted on **AWS** for production.

---

## 🚀 Features

- 🎤 **Voice Input** – Users describe their problem via microphone
- 🧠 **Whisper Transcription** – Converts speech to text
- 🔍 **Entity Extraction** – Finds devices, error codes, keywords
- 📚 **RAG Pipeline** – Retrieves relevant solutions from the knowledge base (Pinecone)
- 🤖 **LLM Troubleshooting** – Generates interactive step-by-step instructions
- 📝 **Instruction Manual** – Auto-generated PDF/Markdown for reuse
- 💾 **Persistent Sessions** – All interactions saved to PostgreSQL
- ☁️ **AWS Deployment** – Backend hosted on AWS (EC2 or Cloud Run equivalent)

---

## 🧩 Architecture Overview

```
User → Microphone → Whisper (STT)
       ↓
Transcript → NLP Extraction → Vector Search (Pinecone)
       ↓
LLM Reasoning → Troubleshooting Steps → Instruction Manual
       ↓
Frontend UI (React/Next.js)
```

**Backend:** FastAPI (Python)  
**Frontend:** React / Next.js  
**Database:** PostgreSQL  
**Vector DB:** Pinecone  
**Storage (Prod):** AWS S3  
**Hosting:** AWS EC2 / Elastic Beanstalk / Cloud Run  
**AI Models:** Whisper + OpenAI GPT (or model of choice)

---

## 📁 Project Structure

```
HelpDeskAI/
├── backend/
│   ├── app/
│   │   ├── api/               # API routes: transcribe, troubleshoot
│   │   ├── db/                # Database models + session storage
│   │   ├── rag/               # RAG pipeline: embed, search, reason
│   │   ├── services/          # Whisper, manual generation
│   │   └── utils/             # Helper functions
│   ├── docs/manuals/          # Knowledge base documents
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/components/
│   ├── src/pages/
│   ├── package.json
│
└── docker-compose.yml
```

---

## 🛠️ Tech Stack

### Frontend

- React / Next.js
- TailwindCSS
- Axios

### Backend

- FastAPI
- Python
- OpenAI Whisper
- OpenAI GPT / Llama / Ollama (configurable)

### Infrastructure (AWS)

- **EC2** – Backend hosting
- **S3** – Audio files, manuals
- **RDS PostgreSQL** – Database
- **IAM** – Permissions
- **Route 53 (optional)** – Custom domain

### Additional

- Pinecone (vector DB)
- LangChain (optional orchestration)
- PDF/Markdown manual creator

---

## 🧪 API Endpoints

### **POST /transcribe**

Upload an audio file → returns transcript

### **POST /troubleshoot**

Send transcript → returns steps + manual

---

## 📦 Installation (Local)

### Backend

```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```
cd frontend
npm install
npm run dev
```

API will run at:

---

## ☁️ Deployment (AWS Summary)

**Backend options:**

**Storage:**

- S3 bucket for audio + manuals

**Database:**

- RDS PostgreSQL or Supabase

**Vector Search:**

- Pinecone cloud

---

## 📌 Status

The backend RAG pipeline, ingestion, and testing are functional.  
Next steps include:

- Hook frontend → backend API
- Deploy FastAPI on AWS
- Deploy frontend on Vercel or AWS Amplify
- Add PDF/manual generation to UI

---

## 🧑‍💻 Contributors

- Isaiah Cruz
- Michal Dzienski
- Geovens Jean B.
- Emmanuel McCrimmon
- Dylan Stechmann

---

## 📄 License

MIT License.
