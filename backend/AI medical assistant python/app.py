import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate
from pymongo import MongoClient

# ---------------------------------------------------------
# 1. FastAPI Setup & Environment
# ---------------------------------------------------------
app = FastAPI(
    title="AI Medical Assistant API",
    description="RAG + MongoDB Tooling Assistant API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

class QueryRequest(BaseModel):
    query: str

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGODB_URI)
db = client["test"]

# ---------------------------------------------------------
# 2. PDF & Vector DB Setup
# ---------------------------------------------------------
document = PyPDFLoader("backend/AI medical assistant python/data/data.pdf").load()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

documents = text_splitter.split_documents(document)

embeddings = FastEmbedEmbeddings(
    model_name="BAAI/bge-small-en-v1.5"
)

docsearch = Chroma.from_documents(
    documents=documents,
    embedding=embeddings,
    collection_name="abc",
    persist_directory="backend/AI medical assistant python/Ai medical assistant/chrome_db"
)

retriever = docsearch.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5}
)

def format_docs(docs):
    return "\n\n".join(
        doc.page_content
        for doc in docs
    )

# ---------------------------------------------------------
# 3. Prompt Template
# ---------------------------------------------------------
prompt_template = """
Instructions:

You are a professional AI Medical Assistant. Your role is to provide
clear, accurate, safe, and clinically responsible health information.

KNOWLEDGE AND CONTEXT RULES

1. FIRST, inspect the provided Context carefully and determine whether
   it contains sufficient information to answer the user's question.

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

ANSWER QUALITY

8. Give answers in a professional, empathetic, and clear manner using clean Markdown formatting (bolding, bullet points).
9. Respond in the same language as the user (English or Roman Urdu).

Context:
{context}

Question:
{question}
"""

prompt = ChatPromptTemplate.from_template(prompt_template)

# ---------------------------------------------------------
# 4. Tools & LLM Setup
# ---------------------------------------------------------
@tool
def search_doctors(specialty: str = "", city: str = "") -> str:
    """
    Search the database for doctors based on specialty (e.g., 'ENT', 'Cardiologist', 'Dermatologist') or city.
    Always use this tool when the user asks for available doctors, appointment timings, or fees.
    City is completely optional. If city is not provided, search and return all matching doctors.
    """
    query = {}

    # Cleaning search terms
    spec_clean = specialty.strip() if specialty else ""
    city_clean = city.strip() if city else ""

    if spec_clean:
        # Check both 'specialty' and 'speciality' spelling in MongoDB schema
        query["$or"] = [
            {"specialty": {"$regex": spec_clean, "$options": "i"}},
            {"speciality": {"$regex": spec_clean, "$options": "i"}}
        ]

    if city_clean:
        query["city"] = {"$regex": city_clean, "$options": "i"}

    # Fetch results from DB
    results = list(db["doctors"].find(query, {"_id": 0}))

    # Fallback: Agar "ENT" search karne se na mile, toh poori doctors list fetch karke check karlein
    if not results and spec_clean:
        all_docs = list(db["doctors"].find({}, {"_id": 0}))
        if all_docs:
            return f"Found all registered doctors in system: {all_docs}"
        return "No doctors found in the database system."

    if not results:
        return "No doctors found matching the given criteria."

    return str(results)


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.0
)

llm_with_tools = llm.bind_tools(
    [search_doctors]
)

# ---------------------------------------------------------
# 5. Core AI Assistant Function
# ---------------------------------------------------------
def ask_medical_assistant(query):

    docs = retriever.invoke(query)
    context = format_docs(docs)

    response = llm_with_tools.invoke(
        prompt.invoke({
            "context": context,
            "question": query
        })
    )

    if response.tool_calls:

        tool_call = response.tool_calls[0]

        result = search_doctors.invoke(
            tool_call["args"]
        )

        final_prompt = f"""
You are a professional AI Medical Assistant.

User Question: {query}

Database Search Results (Doctor Records):
{result}

Medical Context:
{context}

Instructions for Response:
1. If doctor records were found in the Database Search Results, list them clearly with all available details: Name, Specialty, Experience, City, Fee, and Available Timings. Format them with clean bullet points.
2. If no doctor records were found, politely inform the user that no matching doctor is currently registered in the system.
3. Keep the tone empathetic, clinical, and highly professional.
4. Respond in the same language as the user (English or Roman Urdu).
"""

        final_response = llm.invoke(final_prompt)
        return final_response.content

    return response.content


# ---------------------------------------------------------
# 6. API Endpoint
# ---------------------------------------------------------
@app.post("/api/chat")
def chat_endpoint(request: QueryRequest):
    ai_response = ask_medical_assistant(request.query)
    return {
        "status": "success",
        "query": request.query,
        "response": ai_response
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)