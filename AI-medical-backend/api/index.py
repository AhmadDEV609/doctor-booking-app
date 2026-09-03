import os
from pathlib import Path

from dotenv import load_dotenv

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from langchain_google_genai import (
    ChatGoogleGenerativeAI,
    GoogleGenerativeAIEmbeddings
)
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate

from pymongo import MongoClient


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

PDF_PATH = BASE_DIR / "data" / "data.pdf"

# Vercel serverless environment allows temporary files in /tmp
CHROMA_DIR = Path("/tmp/medical_chroma")


# =========================================================
# ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI environment variable is missing.")

if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY environment variable is missing.")


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="AI Medical Assistant API",
    description="RAG + MongoDB Tooling Assistant API"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# REQUEST MODEL
# =========================================================

class QueryRequest(BaseModel):
    query: str


# =========================================================
# MONGODB
# =========================================================

client = MongoClient(MONGODB_URI)

db = client["test"]


# =========================================================
# LOAD PDF
# =========================================================

if not PDF_PATH.exists():
    raise FileNotFoundError(
        f"Medical knowledge PDF not found: {PDF_PATH}"
    )

document = PyPDFLoader(str(PDF_PATH)).load()


# =========================================================
# TEXT SPLITTING
# =========================================================

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

documents = text_splitter.split_documents(document)


# =========================================================
# EMBEDDINGS
# =========================================================

embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001"
)


# =========================================================
# CHROMA VECTOR DATABASE
# =========================================================

docsearch = Chroma.from_documents(
    documents=documents,
    embedding=embeddings,
    collection_name="abc",
    persist_directory=str(CHROMA_DIR)
)

retriever = docsearch.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5}
)


# =========================================================
# FORMAT DOCUMENTS
# =========================================================

def format_docs(docs):
    return "\n\n".join(
        doc.page_content
        for doc in docs
    )


# =========================================================
# MEDICAL PROMPT
# =========================================================

prompt_template = """
Instructions:

You are a professional AI Medical Assistant.
Your role is to provide clear, accurate, safe, and clinically responsible health information.

KNOWLEDGE AND CONTEXT RULES

1. FIRST, inspect the provided Context carefully and determine whether it contains sufficient information to answer the user's question.

2. IF the answer is fully supported by the Context:
- Answer primarily using the information available in the Context.
- Do not introduce unsupported medical facts as if they came from the Context.

3. IF the Context contains only PART of the answer:
- Use the relevant information from the Context.
- For additional information, use general medical knowledge only when appropriate and safe.

4. IF the answer is NOT available in the Context:
- Start the response with exactly:
"[Note: This information was not found in the provided medical knowledge base. The following is based on general medical knowledge and should be verified with an appropriate healthcare professional when necessary.]"
- Then provide a professional, evidence-based general medical answer.

MEDICAL SAFETY RULES

5. Never claim that a user definitely has a disease based only on symptoms.

6. Always identify emergency warning signs when relevant.

7. Never invent doctor information, availability, timing, or fees.

SPECIALIST RECOMMENDATION RULES

8. If the user describes symptoms and asks which doctor they should consult, do NOT diagnose the disease.

9. Instead, identify the most appropriate medical specialty based on the symptoms.

10. If a suitable specialty can be identified, use the search_doctors tool to find admin-approved doctors in that specialty.

11. If the user provides a city, pass that city to the search_doctors tool.

12. Clearly tell the user that the recommended specialty is guidance and not a medical diagnosis.

13. If the symptoms may indicate an emergency, prioritize urgent medical care advice instead of recommending a normal appointment.

ANSWER QUALITY

14. Give answers in a professional, empathetic, and clear manner using clean Markdown formatting (bolding, bullet points).

15. Respond in the same language as the user (English or Roman Urdu).

Context:
{context}

Question:
{question}
"""


prompt = ChatPromptTemplate.from_template(
    prompt_template
)


# =========================================================
# SEARCH DOCTORS TOOL
# =========================================================

@tool
def search_doctors(specialty: str = "", city: str = "") -> str:
    """
    Search only admin-approved doctors based on specialty and/or city.
    """

    query = {
        "approveStatus": "approved"
    }

    spec_clean = specialty.strip() if specialty else ""
    city_clean = city.strip() if city else ""

    if spec_clean:
        query["$or"] = [
            {
                "specialty": {
                    "$regex": spec_clean,
                    "$options": "i"
                }
            },
            {
                "speciality": {
                    "$regex": spec_clean,
                    "$options": "i"
                }
            }
        ]

    if city_clean:
        query["city"] = {
            "$regex": city_clean,
            "$options": "i"
        }

    results = list(
        db["doctors"].find(
            query,
            {"_id": 0}
        )
    )

    if not results:
        return "No doctors found matching the given criteria."

    return str(results)


# =========================================================
# GEMINI
# =========================================================

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.0
)

llm_with_tools = llm.bind_tools(
    [search_doctors]
)


# =========================================================
# MEDICAL ASSISTANT
# =========================================================

def ask_medical_assistant(query):

    docs = retriever.invoke(query)

    context = format_docs(docs)

    response = llm_with_tools.invoke(
        prompt.invoke(
            {
                "context": context,
                "question": query
            }
        )
    )

    # -----------------------------------------------------
    # IF DOCTOR SEARCH TOOL IS REQUIRED
    # -----------------------------------------------------

    if response.tool_calls:

        tool_call = response.tool_calls[0]

        result = search_doctors.invoke(
            tool_call["args"]
        )

        final_prompt = f"""
You are a professional AI Medical Assistant.

User Question:
{query}

Database Search Results:
{result}

Medical Context:
{context}

Instructions:

1. If the user described symptoms, DO NOT diagnose the patient.

2. If a medical specialty was identified from the symptoms, clearly explain that this specialty may be appropriate to consult.

3. Clearly state that the recommendation is not a medical diagnosis.

4. If approved doctors were found in the database, list them clearly using only the information returned by the database.

5. For each doctor, show available information such as:
- Name
- Specialty
- Experience
- City
- Consultation Fee
- Available Timings

6. NEVER invent doctor information, fees, timings, availability, experience, or qualifications.

7. Only recommend doctors that appear in the database search results.

8. If no approved doctors were found, tell the user that no matching approved doctor is currently available in the system.

9. If the user's symptoms may indicate an emergency, prioritize urgent medical care advice instead of normal doctor recommendations.

10. Respond in the same language as the user: English or Roman Urdu.

11. Keep the response professional, empathetic, clear, and concise.
"""

        final_response = llm.invoke(
            final_prompt
        )

        return final_response.content

    return response.content


# =========================================================
# API ENDPOINT
# =========================================================

@app.post("/api/chat")
def chat_endpoint(request: QueryRequest):

    ai_response = ask_medical_assistant(
        request.query
    )

    return {
        "status": "success",
        "query": request.query,
        "response": ai_response
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/")
def root():
    return {
        "status": "success",
        "message": "AI Medical Assistant API is running"
    }