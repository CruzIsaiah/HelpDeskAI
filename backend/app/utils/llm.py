# backend/app/utils/llm.py

import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def chat_completion(system_prompt: str, user_prompt: str) -> str:
    """
    Wrapper for OpenAI chat completion API.
    Returns model-generated text.
    """
    resp = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
    )

    return resp.choices[0].message.content.strip()
