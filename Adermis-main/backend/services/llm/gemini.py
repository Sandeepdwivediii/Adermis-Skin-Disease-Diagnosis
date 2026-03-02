"""Gemini client wrapper with structured JSON enforcement."""
import json
import google.generativeai as genai
from config import GEMINI_API_KEY

# Configure once
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

_model_name = "gemini-2.0-flash"


def _get_model():
    return genai.GenerativeModel(_model_name)


def generate_text(prompt: str) -> str:
    """Send a prompt to Gemini and return the raw text response."""
    try:
        response = _get_model().generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        raise RuntimeError(f"Gemini API error: {str(e)}")


def generate_json(prompt: str) -> list | dict:
    """Send a prompt expecting JSON, parse and return."""
    raw = generate_text(prompt)
    # Strip markdown code fences if present
    cleaned = raw
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        # Remove first and last lines (```json and ```)
        lines = [l for l in lines if not l.strip().startswith("```")]
        cleaned = "\n".join(lines)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return []
