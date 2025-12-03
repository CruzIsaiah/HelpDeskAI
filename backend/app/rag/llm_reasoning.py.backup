# backend/app/rag/llm_reasoning.py

from typing import List, Tuple
from pydantic import BaseModel
import json

from app.utils.llm import chat_completion


class Step(BaseModel):
    id: int
    text: str


def generate_steps_and_manual(
    query: str,
    docs: List[str],
    entities: dict
) -> Tuple[List[Step], str]:
    """
    Given:
      - user problem text
      - pinecone retrieved docs
      - extracted entities

    Produce:
      - structured troubleshooting steps
      - a markdown manual
    """

    context = "\n\n".join(docs) if docs else "No relevant docs found."

    system_prompt = (
        "You are a technical support expert that creates simple troubleshooting steps."
    )

    user_prompt = f"""
    User Problem:
    {query}

    Entities:
    {json.dumps(entities, indent=2)}

    Relevant Documentation:
    {context}

    -----

    Produce a JSON response with:
    - steps: list of strings (concise troubleshooting steps)
    - manual_markdown: string (markdown manual with title + numbered steps)
    """

    raw = chat_completion(system_prompt, user_prompt)

    try:
        parsed = json.loads(raw)
        step_texts = parsed.get("steps", [])
        manual_md = parsed.get("manual_markdown", "")
    except Exception:
        # fallback minimal steps if LLM formatting breaks
        step_texts = [
            "Restart the device.",
            "Check your network connection.",
            "Try the operation again."
        ]
        manual_md = (
            "# Troubleshooting Manual\n\n"
            "## Basic Steps\n\n" +
            "\n".join([f"{i+1}. {s}" for i, s in enumerate(step_texts)])
        )

    steps = [Step(id=i+1, text=s) for i, s in enumerate(step_texts)]

    return steps, manual_md
