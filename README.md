# HelpDesk AI – Project Overview

HelpDesk AI is a cloud-based support platform designed to simplify troubleshooting. Users can **speak their problem directly into the app**, which then **transcribes and interprets** the issue, searches a **knowledge base**, and provides an **interactive step-by-step guide** to solve it. Each session generates a transcript and a personalized instruction manual that can be saved and reused. Over time, users can contribute product-specific notes and verified fixes, turning the system into a collaborative hub of practical solutions.

---

## 🧰 Tech Stack

* **Frontend:** React (UI with microphone input, results display)
* **Backend:** FastAPI (API endpoints for transcription and query)
* **Speech-to-Text:** Whisper (for transcription)
* **Vector Store:** Chroma (for knowledge base retrieval)
* **LLM Runtime:** Ollama (for generating answers)
* **Deployment:** Netlify/Vercel (frontend), Render/Railway/Fly.io (backend)

---

## 🎯 Goal

Deliver a simple, cloud-deployed voice-powered support tool that demonstrates the flow: **voice → transcription → retrieval → AI answer → reusable instructions**.
