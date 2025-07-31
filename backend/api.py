# api.py

from fastapi import FastAPI, Request
from pydantic import BaseModel
import uvicorn
import os

# Optional: Load env vars from .env
from dotenv import load_dotenv
load_dotenv()

# ========== Replace this with your GPT function ==========
def generate_insight(user_input):
    # Simulated version
    return {
        "domains": ["Fashion", "Music", "Pop Culture"],
        "companies": ["Spotify", "Universal Music", "TikTok"],
        "insight": "Gen Z artists are reshaping cultural and commercial trends, especially on music and social platforms."
    }
# ========================================================

# FastAPI app
app = FastAPI()

class Input(BaseModel):
    prompt: str

@app.post("/generate")
def generate(input: Input):
    result = generate_insight(input.prompt)
    return result

# Run with: uvicorn api:app --reload
