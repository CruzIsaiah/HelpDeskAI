# backend/app/rag/entity_extraction.py

import json
from app.utils.llm import chat_completion

def extract_entities(text: str):
    """
    Extract troubleshooting-related entities from user input.
    Returns a dictionary: device, os, error_codes, keywords.
    """

    system_prompt = (
        "You are an AI assistant that extracts structured technical info "
        "from a user's problem description."
    )

    user_prompt = f"""
    Extract entities from this text:

    {text}

    Return JSON with fields:
    - device
    - os
    - error_codes (list)
    - keywords (list)
    """

    raw = chat_completion(system_prompt, user_prompt)

    try:
        data = json.loads(raw)
    except Exception:
        # fallback in case model response isn't valid JSON
        data = {
            "device": None,
            "os": None,
            "error_codes": [],
            "keywords": []
        }

    return data
