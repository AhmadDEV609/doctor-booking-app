import os
import re

from dotenv import load_dotenv

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from langchain_google_genai import (
    ChatGoogleGenerativeAI,
    GoogleGenerativeAIEmbeddings
)

from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate

from pymongo import MongoClient


# =========================================================
# ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


if not MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI environment variable is missing."
    )


if not GOOGLE_API_KEY:
    raise RuntimeError(
        "GOOGLE_API_KEY environment variable is missing."
    )


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="AI Medical Assistant API",
    description="RAG + MongoDB Doctor Search + Gemini Medical Assistant",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

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

client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=10000
)

db = client["test"]

medical_collection = db["medical_chunks"]

doctors_collection = db["doctors"]

users_collection = db["users"]


# =========================================================
# GEMINI EMBEDDINGS
# =========================================================

embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001"
)


# =========================================================
# GEMINI LLM
# =========================================================

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.0
)


# =========================================================
# MEDICAL VECTOR SEARCH
# =========================================================

def retrieve_medical_context(
    query: str,
    limit: int = 5
):
    """
    Convert the user's question into an embedding and
    retrieve the most relevant medical document chunks
    from MongoDB Atlas Vector Search.
    """

    query_vector = embeddings.embed_query(query)

    pipeline = [
        {
            "$vectorSearch": {
                "index": "medical_vector_index",
                "path": "embedding",
                "queryVector": query_vector,
                "numCandidates": 50,
                "limit": limit
            }
        },
        {
            "$project": {
                "_id": 0,
                "text": 1,
                "metadata": 1,
                "score": {
                    "$meta": "vectorSearchScore"
                }
            }
        }
    ]

    results = list(
        medical_collection.aggregate(
            pipeline
        )
    )

    return results


# =========================================================
# FORMAT MEDICAL CONTEXT
# =========================================================

def format_medical_context(results):

    if not results:
        return ""

    context_parts = []

    for result in results:

        text = result.get("text")

        if text:
            context_parts.append(text)

    return "\n\n".join(context_parts)


# =========================================================
# DOCTOR SEARCH TOOL
# =========================================================

@tool
def search_doctors(
    specialty: str = "",
    city: str = ""
) -> str:
    """
    Search admin-approved doctors.

    Use this tool when the user:
    - asks for doctors
    - asks for approved doctors
    - asks for doctor details
    - asks for doctors by specialty
    - asks for doctors by city
    - describes symptoms and needs a suitable specialist

    specialty:
        Optional specialty filter.

    city:
        Optional city filter.

    Only doctors with approveStatus='approved' are returned.
    """

    # -----------------------------------------------------
    # BASE QUERY
    # -----------------------------------------------------

    query = {
        "approveStatus": "approved"
    }

    # -----------------------------------------------------
    # CLEAN INPUT
    # -----------------------------------------------------

    spec_clean = (
        specialty.strip()
        if specialty
        else ""
    )

    city_clean = (
        city.strip()
        if city
        else ""
    )

    # -----------------------------------------------------
    # SPECIALTY FILTER
    # -----------------------------------------------------

    if spec_clean:

        query["speciality"] = {
            "$regex": re.escape(spec_clean),
            "$options": "i"
        }

    # -----------------------------------------------------
    # CITY FILTER
    # -----------------------------------------------------

    if city_clean:

        query["city"] = {
            "$regex": re.escape(city_clean),
            "$options": "i"
        }

    # -----------------------------------------------------
    # FIND DOCTORS
    # -----------------------------------------------------

    doctors = list(
        doctors_collection.find(
            query,
            {
                "_id": 1,
                "userId": 1,
                "speciality": 1,
                "experience": 1,
                "fee": 1,
                "city": 1,
                "checkDuration": 1,
                "availability": 1
            }
        )
    )

    # -----------------------------------------------------
    # NO RESULTS
    # -----------------------------------------------------

    if not doctors:

        return (
            "No approved doctors found matching "
            "the given criteria."
        )

    # -----------------------------------------------------
    # FORMAT DOCTORS
    # -----------------------------------------------------

    formatted_doctors = []

    for doctor in doctors:

        user = users_collection.find_one(
            {
                "_id": doctor.get("userId")
            },
            {
                "_id": 0,
                "name": 1,
                "email": 1,
                "phone": 1,
                "image": 1,
                "bio": 1,
                "city": 1
            }
        )

        doctor_data = {
            "name": (
                user.get("name")
                if user
                else "Doctor"
            ),

            "speciality": doctor.get(
                "speciality"
            ),

            "experience": doctor.get(
                "experience"
            ),

            "fee": doctor.get(
                "fee"
            ),

            "city": doctor.get(
                "city"
            ),

            "checkDuration": doctor.get(
                "checkDuration"
            ),

            "availability": doctor.get(
                "availability",
                []
            )
        }

        formatted_doctors.append(
            doctor_data
        )

    return str(formatted_doctors)


# =========================================================
# TOOL ENABLED LLM
# =========================================================

llm_with_tools = llm.bind_tools(
    [search_doctors]
)


# =========================================================
# MEDICAL SYSTEM PROMPT
# =========================================================

prompt_template = """
You are a professional AI Medical Assistant.

Your role is to provide clear, accurate, safe,
responsible and helpful health information.

You are connected to:

1. A medical knowledge base using RAG.
2. A MongoDB database containing doctors.
3. A doctor search tool.

=========================================================
MEDICAL KNOWLEDGE / RAG RULES
=========================================================

1. First inspect the provided medical Context.

2. If the Context contains sufficient information
to answer the question, primarily use that information.

3. Do not claim that information came from the medical
knowledge base if it is not supported by the Context.

4. If the Context contains only part of the answer,
use the relevant Context and supplement it with
general medical knowledge when appropriate.

5. If the Context does not contain the answer,
you may use general medical knowledge.

6. When the answer is not found in the medical knowledge
base, clearly indicate that the answer is based on
general medical knowledge.

7. Never invent medical facts.

=========================================================
MEDICAL SAFETY RULES
=========================================================

8. Never diagnose a patient with certainty based only
on symptoms.

9. Symptoms can have multiple possible causes.

10. When appropriate, explain possible causes without
claiming a definite diagnosis.

11. Mention important emergency warning signs when
they are relevant.

12. If symptoms suggest a potentially serious emergency,
prioritize urgent medical attention.

13. Do not recommend delaying emergency care.

14. Do not prescribe medication or give unsafe medication
dosages without sufficient clinical context.

15. Encourage consultation with a qualified healthcare
professional when appropriate.

=========================================================
DOCTOR SEARCH RULES
=========================================================

16. If the user directly asks for doctors, doctor lists,
approved doctors, doctor details, doctors in the system,
or doctors of a specific specialty, use the
search_doctors tool.

17. If the user asks for ALL approved doctors, use the
search_doctors tool without a specialty or city filter.

18. If the user asks for a specific specialty, pass that
specialty to the search_doctors tool.

19. If the user provides a city, pass that city to the
search_doctors tool.

20. Only show doctors returned by the search_doctors tool.

21. Never invent doctor information.

22. Never invent:
- doctor names
- specialties
- experience
- fees
- cities
- timings
- availability
- qualifications
- licenses

23. The doctor database is the ONLY source of truth
for doctor information.

24. If no doctors are returned, clearly tell the user
that no approved matching doctors were found.

25. The AI must not use the isAvailable field to decide
whether a doctor should be shown.

26. Approved doctors should be shown based on
approveStatus='approved'.

27. If availability/timing information exists in the
database's availability field, it may be shown exactly
as returned by the database.

=========================================================
SYMPTOM → SPECIALTY RULES
=========================================================

28. If the user describes symptoms and asks which doctor
they should consult, do NOT diagnose the disease.

29. Identify the most appropriate medical specialty
based on the symptoms.

30. Clearly explain that the specialty recommendation
is guidance and not a diagnosis.

31. After identifying a suitable specialty, use the
search_doctors tool to find approved doctors in that
specialty.

32. If the user provides a city, include the city when
searching for doctors.

33. If the symptoms may indicate an emergency, prioritize
urgent medical care instead of a normal appointment.

=========================================================
LANGUAGE RULES
=========================================================

34. Respond in the same language used by the user.

35. If the user uses English, respond in English.

36. If the user uses Roman Urdu, respond in Roman Urdu.

37. Keep the response professional, empathetic and easy
to understand.

38. Use clean Markdown formatting.

=========================================================
MEDICAL CONTEXT
=========================================================

{context}

=========================================================
USER QUESTION
=========================================================

{question}
"""


prompt = ChatPromptTemplate.from_template(
    prompt_template
)


# =========================================================
# DOCTOR QUERY DETECTION
# =========================================================

def is_doctor_query(query: str) -> bool:
    """
    Detect direct doctor-related requests.

    This prevents normal doctor listing/detail queries
    from unnecessarily depending on RAG retrieval.
    """

    query_lower = query.lower()

    doctor_keywords = [
        "doctor",
        "doctors",
        "approved doctor",
        "approved doctors",
        "doctor list",
        "doctor lists",
        "doctor detail",
        "doctor details",
        "doctor information",
        "doctor info",
        "specialist",
        "specialists",
        "ent doctor",
        "ent specialist",
        "cardiologist",
        "cardiology",
        "dermatologist",
        "dermatology",
        "neurologist",
        "neurology",
        "orthopedic",
        "orthopaedic",
        "gynecologist",
        "gynaecologist",
        "pediatrician",
        "paediatrician",
        "psychiatrist",
        "lahore doctor",
        "doctors in lahore"
    ]

    return any(
        keyword in query_lower
        for keyword in doctor_keywords
    )


# =========================================================
# FINAL DOCTOR RESPONSE
# =========================================================

def generate_doctor_response(
    query: str,
    result: str,
    context: str = ""
):
    """
    Convert raw MongoDB doctor results into a
    professional natural-language response.
    """

    final_prompt = f"""
You are a professional AI Medical Assistant.

USER QUESTION:

{query}


DATABASE DOCTOR RESULTS:

{result}


MEDICAL CONTEXT:

{context}


IMPORTANT RULES:

1. The database results are the ONLY source of truth
for doctor information.

2. Only mention doctors present in the database results.

3. Never invent or modify doctor information.

4. Never invent:
- Name
- Specialty
- Experience
- City
- Fee
- Timings
- Availability
- Qualifications
- License

5. If doctors were found, present them clearly.

6. For each doctor show the information that is actually
available in the database, such as:

- Name
- Specialty
- Experience
- City
- Consultation Fee
- Check Duration
- Available Days
- Available Timings

7. Do not mention information that does not exist
in the database result.

8. If no doctors were found, clearly tell the user that
no approved matching doctors were found in the system.

9. If this was a symptom-based recommendation,
do not diagnose the patient.

10. Explain that the recommended specialty is guidance
and not a medical diagnosis.

11. If the symptoms indicate a possible emergency,
prioritize urgent medical care.

12. Respond in the same language as the user.

13. Keep the response professional, concise and clear.

14. Use Markdown formatting.
"""

    response = llm.invoke(
        final_prompt
    )

    return response.content


# =========================================================
# MEDICAL RAG RESPONSE
# =========================================================

def generate_medical_response(
    query: str,
    context: str
):
    """
    Generate a normal medical response using
    retrieved RAG context and optional doctor tool.
    """

    response = llm_with_tools.invoke(
        prompt.invoke(
            {
                "context": context,
                "question": query
            }
        )
    )

    # -----------------------------------------------------
    # TOOL CALL
    # -----------------------------------------------------

    if response.tool_calls:

        tool_call = response.tool_calls[0]

        tool_args = tool_call.get(
            "args",
            {}
        )

        result = search_doctors.invoke(
            tool_args
        )

        return generate_doctor_response(
            query=query,
            result=result,
            context=context
        )

    # -----------------------------------------------------
    # NORMAL MEDICAL RESPONSE
    # -----------------------------------------------------

    return response.content


# =========================================================
# MAIN AI FUNCTION
# =========================================================

def ask_medical_assistant(query: str):

    query = query.strip()

    if not query:
        return (
            "Please enter a medical question or describe "
            "your symptoms."
        )

    # =====================================================
    # DIRECT DOCTOR QUERY
    # =====================================================

    if is_doctor_query(query):

        response = llm_with_tools.invoke(
            prompt.invoke(
                {
                    "context": "",
                    "question": query
                }
            )
        )

        # -------------------------------------------------
        # GEMINI DECIDED TO SEARCH DOCTORS
        # -------------------------------------------------

        if response.tool_calls:

            tool_call = response.tool_calls[0]

            tool_args = tool_call.get(
                "args",
                {}
            )

            result = search_doctors.invoke(
                tool_args
            )

            return generate_doctor_response(
                query=query,
                result=result
            )

        # -------------------------------------------------
        # FALLBACK
        # -------------------------------------------------

        return response.content

    # =====================================================
    # NORMAL MEDICAL QUESTION
    # =====================================================

    medical_results = retrieve_medical_context(
        query,
        limit=5
    )

    context = format_medical_context(
        medical_results
    )

    return generate_medical_response(
        query=query,
        context=context
    )


# =========================================================
# CHAT API
# =========================================================

@app.post("/api/chat")
def chat_endpoint(
    request: QueryRequest
):

    try:

        ai_response = ask_medical_assistant(
            request.query
        )

        return {
            "status": "success",
            "query": request.query,
            "response": ai_response
        }

    except Exception as error:

        print(
            "Chat API Error:",
            str(error)
        )

        return {
            "status": "error",
            "query": request.query,
            "response": (
                "Sorry, I was unable to process your "
                "request right now. Please try again."
            )
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