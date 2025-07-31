from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import re
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic request model
class InsightRequest(BaseModel):
    userPrompt: str
    selectedPreferences: list[str]
    customPreferences: list[str]

# Extract domains from text
def extract_domains_from_insight(insight_text: str):
    match = re.search(r"(?i)domains\s*:\s*(.+)", insight_text)
    return [d.strip() for d in match.group(1).split(",")] if match else []

# Extract companies from text
def extract_companies_from_insight(insight_text: str):
    match = re.search(r"(?i)suggested companies\s*:\s*(.+)", insight_text)
    return [c.strip() for c in match.group(1).split(",")] if match else []

# Call Gemini model
def infer_domains_and_insight(user_input: str) -> str:
    prompt = f"""
You are a trend forecasting assistant.

Given this input:
"{user_input}"

Return only:
1. A short 2–3 sentence **summary insight**.
2. A **clean bullet list** of 3 domains (max 5 words each).
3. A bullet list of **no more than 5 company names**.
Avoid extra explanations or long descriptions.

Format:
Insight: ...
Domains:
- ...
- ...
Companies:
- ...
- ...
""".strip()


    try:
        model = genai.GenerativeModel(model_name="gemini-2.5-pro")
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("❌ Gemini API Error:", e)
        return """
- Domains: Fashion, Retail, Lifestyle
- Suggested Companies: Nike, Adidas, Lululemon
- Analysis: These sectors are seeing strong growth in 2025, especially with Gen Z adoption trends...
"""

# API route
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
