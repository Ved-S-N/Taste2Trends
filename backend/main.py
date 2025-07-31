from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import re
from dotenv import load_dotenv
import google.generativeai as genai


# Load .env and configure Gemini
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# FastAPI app
app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model
class InsightRequest(BaseModel):
    userPrompt: str
    selectedPreferences: list[str]
    customPreferences: list[str]

# Regex extractors
def extract_companies_from_insight(insight_text: str):
    match = re.search(r"(?i)suggested companies\s*:\s*(.+)", insight_text)
    return [c.strip() for c in match.group(1).split(",")] if match else []

def extract_domains_from_insight(insight_text: str):
    match = re.search(r"(?i)domains\s*:\s*(.+)", insight_text)
    return [d.strip() for d in match.group(1).split(",")] if match else []

# Gemini-powered function
def infer_domains_and_insight(user_input: str) -> str:
    prompt = f"""
    (same as before)
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("❌ Gemini Error:", e)
        # MOCK RESPONSE as fallback
        return """
- Domains: Footwear, E-commerce, Lifestyle, Fashion, Retail
- Suggested Companies: Nike, Adidas, Amazon, Lululemon, JD Sports
- Analysis: In 2025, the footwear and lifestyle sectors continue to show strong demand...
"""

# Main endpoint
@app.post("/generate")
def generate_insight(data: InsightRequest):
    print("✅ Received data:", data.dict())

    combined_input = f"{data.userPrompt}. Preferences: {', '.join(data.selectedPreferences + data.customPreferences)}"
    insight_text = infer_domains_and_insight(combined_input)

    domains = extract_domains_from_insight(insight_text)
    companies = extract_companies_from_insight(insight_text)

    return {
        "insight": insight_text,
        "domains": domains,
        "companies": companies
    }
