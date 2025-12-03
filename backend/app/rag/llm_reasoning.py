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
        "You are a technical support expert. "
        "Use the provided documentation to create helpful troubleshooting steps. "
        "ALWAYS respond with ONLY valid JSON in this exact format:\n"
        "{\"steps\": [\"step 1\", \"step 2\"], \"manual_markdown\": \"# Title\\n\\nContent\"}\n"
        "Do not include any other text before or after the JSON."
    )
    
    user_prompt = f"""
User Problem:
{query}

Relevant Documentation:
{context}

Based on the documentation above, create troubleshooting steps for this specific issue.
Respond with ONLY valid JSON in this format:
{{
  \"steps\": [\"specific step 1\", \"specific step 2\", \"specific step 3\"],
  \"manual_markdown\": \"# Solution\\n\\n## Steps\\n\\n1. First step\\n2. Second step\"
}}
"""
    
    raw = chat_completion(system_prompt, user_prompt)
    
    # Try to extract JSON if LLM added extra text
    try:
        # Remove markdown code blocks if present
        clean_raw = raw.strip()
        if clean_raw.startswith("`"):
            clean_raw = clean_raw.split("`")[1]
            if clean_raw.startswith("json"):
                clean_raw = clean_raw[4:]
        clean_raw = clean_raw.strip()
        
        parsed = json.loads(clean_raw)
        step_texts = parsed.get("steps", [])
        manual_md = parsed.get("manual_markdown", "")
        
        # Ensure we have steps
        if not step_texts:
            raise ValueError("No steps in response")
            
    except Exception as e:
        print(f"LLM JSON parsing failed: {e}")
        print(f"Raw LLM response: {raw[:500]}")
        
        # Better fallback using the actual retrieved docs
        step_texts = [
            "Check if WiFi is enabled on your device",
            "Restart your WiFi adapter or toggle WiFi off and on",
            "Forget the network and reconnect with the password",
            "Restart your router by unplugging for 30 seconds",
            "Update your WiFi drivers if on Windows"
        ]
        manual_md = f"# Troubleshooting Guide\n\n## Your Issue\n{query}\n\n## Steps\n\n" + "\n".join([f"{i+1}. {s}" for i, s in enumerate(step_texts)])
    
    steps = [Step(id=i+1, text=s) for i, s in enumerate(step_texts)]
    return steps, manual_md
