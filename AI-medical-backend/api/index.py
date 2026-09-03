import os
import re

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pymongo import MongoClient

from langchain_google_genai import (
    ChatGoogleGenerativeAI,
    GoogleGenerativeAIEmbeddings
)

from langchain_core.prompts import ChatPromptTemplate


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI is not configured")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is not configured")


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="AI Medical Assistant API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# MONGODB
# ============================================================

client = MongoClient(MONGODB_URI)

db = client["test"]

medical_collection = db["medical_chunks"]
doctors_collection = db["doctors"]
users_collection = db["users"]


# ============================================================
# GEMINI EMBEDDINGS
# ============================================================

embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001"
)


# ============================================================
# GEMINI LLM
# ============================================================

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.0
)


# ============================================================
# REQUEST MODELS
# ============================================================

class ChatMessage(BaseModel):
    role: str
    content: str


class QueryRequest(BaseModel):
    query: str
    history: list[ChatMessage] = []


# ============================================================
# SPECIALTY ALIASES
# ============================================================

# IMPORTANT:
# These values must match the "speciality" values
# stored in your MongoDB doctors collection.
#
# Example:
# DB has:
# speciality = "heart"
# speciality = "ENT"

SPECIALTY_ALIASES = {

    # Heart
    "cardiologist": "heart",
    "cardiology": "heart",
    "heart specialist": "heart",
    "heart doctor": "heart",
    "heart specialist doctor": "heart",

    # ENT
    "ent": "ENT",
    "ent specialist": "ENT",
    "ent doctor": "ENT",
    "ear nose throat": "ENT",
    "ear, nose and throat": "ENT",
    "otolaryngologist": "ENT",

    # Dermatology
    "dermatologist": "dermatology",
    "dermatology": "dermatology",
    "skin specialist": "dermatology",
    "skin doctor": "dermatology",

    # Neurology
    "neurologist": "neurology",
    "neurology": "neurology",
    "brain specialist": "neurology",
    "nerve specialist": "neurology",

    # Orthopedics
    "orthopedic": "orthopedic",
    "orthopaedic": "orthopedic",
    "orthopedic doctor": "orthopedic",
    "bone specialist": "orthopedic",
    "joint specialist": "orthopedic",

    # Gynecology
    "gynecologist": "gynecology",
    "gynaecologist": "gynecology",
    "gynecology": "gynecology",
    "women specialist": "gynecology",

    # Pediatrics
    "pediatrician": "pediatrics",
    "paediatrician": "pediatrics",
    "pediatrics": "pediatrics",
    "child specialist": "pediatrics",
    "children doctor": "pediatrics",

    # Gastroenterology
    "gastroenterologist": "gastroenterology",
    "gastroenterology": "gastroenterology",
    "stomach specialist": "gastroenterology",

    # Urology
    "urologist": "urology",
    "urology": "urology",
    "urinary specialist": "urology",

    # Pulmonology
    "pulmonologist": "pulmonology",
    "pulmonology": "pulmonology",
    "lung specialist": "pulmonology",
    "lung doctor": "pulmonology",

    # Endocrinology
    "endocrinologist": "endocrinology",
    "endocrinology": "endocrinology",
    "diabetes specialist": "endocrinology",

    # Psychiatry
    "psychiatrist": "psychiatry",
    "psychiatry": "psychiatry",
    "mental health specialist": "psychiatry",

    # Ophthalmology
    "ophthalmologist": "ophthalmology",
    "ophthalmology": "ophthalmology",
    "eye specialist": "ophthalmology",
    "eye doctor": "ophthalmology",

    # Dentistry
    "dentist": "dentistry",
    "dental": "dentistry",
    "dentistry": "dentistry",
    "teeth specialist": "dentistry",
}


# ============================================================
# SYMPTOM → SPECIALTY MAPPING
# ============================================================

# This is used before searching doctors.
#
# IMPORTANT:
# This does NOT diagnose a disease.
# It only identifies an appropriate medical specialty.

SYMPTOM_SPECIALTY_RULES = {

    # --------------------------------------------------------
    # HEART / CARDIOLOGY
    # --------------------------------------------------------

    "chest pain": "heart",
    "chest pressure": "heart",
    "chest tightness": "heart",
    "heart pain": "heart",
    "heart racing": "heart",
    "palpitations": "heart",
    "irregular heartbeat": "heart",
    "fast heartbeat": "heart",
    "slow heartbeat": "heart",

    # --------------------------------------------------------
    # ENT
    # --------------------------------------------------------

    "ear pain": "ENT",
    "earache": "ENT",
    "hearing loss": "ENT",
    "hearing problem": "ENT",
    "ringing in ear": "ENT",
    "tinnitus": "ENT",
    "sore throat": "ENT",
    "throat pain": "ENT",
    "tonsil": "ENT",
    "sinus": "ENT",
    "blocked nose": "ENT",
    "nasal congestion": "ENT",
    "nose bleeding": "ENT",

    # --------------------------------------------------------
    # DERMATOLOGY
    # --------------------------------------------------------

    "skin rash": "dermatology",
    "rash": "dermatology",
    "acne": "dermatology",
    "pimples": "dermatology",
    "skin itching": "dermatology",
    "itchy skin": "dermatology",
    "skin allergy": "dermatology",
    "hair loss": "dermatology",
    "eczema": "dermatology",
    "psoriasis": "dermatology",

    # --------------------------------------------------------
    # NEUROLOGY
    # --------------------------------------------------------

    "severe headache": "neurology",
    "migraine": "neurology",
    "frequent headache": "neurology",
    "dizziness": "neurology",
    "numbness": "neurology",
    "tingling": "neurology",
    "seizure": "neurology",
    "tremor": "neurology",
    "memory problems": "neurology",

    # --------------------------------------------------------
    # ORTHOPEDICS
    # --------------------------------------------------------

    "bone pain": "orthopedic",
    "joint pain": "orthopedic",
    "knee pain": "orthopedic",
    "back pain": "orthopedic",
    "shoulder pain": "orthopedic",
    "neck pain": "orthopedic",
    "fracture": "orthopedic",
    "muscle pain": "orthopedic",
    "sprain": "orthopedic",

    # --------------------------------------------------------
    # GYNECOLOGY
    # --------------------------------------------------------

    "period pain": "gynecology",
    "irregular periods": "gynecology",
    "menstrual problem": "gynecology",
    "pelvic pain": "gynecology",
    "pregnancy": "gynecology",
    "pregnancy problem": "gynecology",

    # --------------------------------------------------------
    # PEDIATRICS
    # --------------------------------------------------------

    "child fever": "pediatrics",
    "baby fever": "pediatrics",
    "child cough": "pediatrics",
    "child illness": "pediatrics",

    # --------------------------------------------------------
    # GASTROENTEROLOGY
    # --------------------------------------------------------

    "stomach pain": "gastroenterology",
    "abdominal pain": "gastroenterology",
    "constipation": "gastroenterology",
    "diarrhea": "gastroenterology",
    "vomiting": "gastroenterology",
    "acid reflux": "gastroenterology",
    "heartburn": "gastroenterology",

    # --------------------------------------------------------
    # UROLOGY
    # --------------------------------------------------------

    "urine problem": "urology",
    "urination problem": "urology",
    "painful urination": "urology",
    "kidney stone": "urology",
    "blood in urine": "urology",

    # --------------------------------------------------------
    # PULMONOLOGY
    # --------------------------------------------------------

    "breathing problem": "pulmonology",
    "shortness of breath": "pulmonology",
    "breathing difficulty": "pulmonology",
    "persistent cough": "pulmonology",
    "chronic cough": "pulmonology",
    "lung problem": "pulmonology",
    "wheezing": "pulmonology",

    # --------------------------------------------------------
    # ENDOCRINOLOGY
    # --------------------------------------------------------

    "diabetes": "endocrinology",
    "high blood sugar": "endocrinology",
    "low blood sugar": "endocrinology",
    "thyroid problem": "endocrinology",
    "thyroid": "endocrinology",

    # --------------------------------------------------------
    # PSYCHIATRY
    # --------------------------------------------------------

    "anxiety": "psychiatry",
    "panic attack": "psychiatry",
    "depression": "psychiatry",
    "mental health": "psychiatry",
    "stress": "psychiatry",

    # --------------------------------------------------------
    # OPHTHALMOLOGY
    # --------------------------------------------------------

    "eye pain": "ophthalmology",
    "eye problem": "ophthalmology",
    "blurred vision": "ophthalmology",
    "vision problem": "ophthalmology",
    "red eyes": "ophthalmology",

    # --------------------------------------------------------
    # DENTISTRY
    # --------------------------------------------------------

    "tooth pain": "dentistry",
    "toothache": "dentistry",
    "gum pain": "dentistry",
    "dental pain": "dentistry",
}


# ============================================================
# CITY EXTRACTION
# ============================================================

KNOWN_CITIES = [
    "lahore",
    "karachi",
    "islamabad",
    "rawalpindi",
    "peshawar",
    "quetta",
    "multan",
    "faisalabad",
    "gujranwala",
    "sialkot",
    "hyderabad",
    "bahawalpur"
]


def extract_city(text: str):

    text_lower = text.lower()

    for city in KNOWN_CITIES:

        if city in text_lower:
            return city

    return ""


# ============================================================
# SPECIALTY EXTRACTION
# ============================================================

def extract_specialty(text: str):

    text_lower = text.lower().strip()

    # Sort longest first
    # Example:
    # "heart specialist" should be checked before "heart"

    sorted_aliases = sorted(
        SPECIALTY_ALIASES.items(),
        key=lambda item: len(item[0]),
        reverse=True
    )

    for alias, specialty in sorted_aliases:

        if alias in text_lower:
            return specialty

    return ""


# ============================================================
# SYMPTOM → SPECIALTY
# ============================================================

def detect_specialty_from_symptoms(text: str):

    text_lower = text.lower()

    sorted_rules = sorted(
        SYMPTOM_SPECIALTY_RULES.items(),
        key=lambda item: len(item[0]),
        reverse=True
    )

    for symptom, specialty in sorted_rules:

        if symptom in text_lower:
            return specialty

    return ""


# ============================================================
# HISTORY FORMATTER
# ============================================================

def format_history(history):

    if not history:
        return ""

    return "\n".join(
        f"{message.role}: {message.content}"
        for message in history[-10:]
    )


# ============================================================
# DOCTOR QUERY DETECTION
# ============================================================

def is_direct_doctor_query(query: str):

    query_lower = query.lower()

    keywords = [
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
        "consult doctor",
        "which doctor",
        "what doctor"
    ]

    return any(
        keyword in query_lower
        for keyword in keywords
    )


# ============================================================
# CHECK DOCTOR CONVERSATION CONTEXT
# ============================================================

def is_doctor_context(history: str):

    history_lower = history.lower()

    doctor_terms = [
        "doctor",
        "doctors",
        "specialist",
        "specialists",
        "approved doctor",
        "approved doctors",
        "doctor list",
        "doctor details"
    ]

    return any(
        term in history_lower
        for term in doctor_terms
    )


# ============================================================
# FIND APPROVED DOCTORS
# ============================================================

def find_approved_doctors(
    specialty: str = "",
    city: str = ""
):

    query = {
        "approveStatus": "approved"
    }

    specialty = specialty.strip()
    city = city.strip()

    # --------------------------------------------------------
    # SPECIALTY FILTER
    # --------------------------------------------------------

    if specialty:

        query["speciality"] = {
            "$regex": re.escape(specialty),
            "$options": "i"
        }

    # --------------------------------------------------------
    # CITY FILTER
    # --------------------------------------------------------

    if city:

        query["city"] = {
            "$regex": re.escape(city),
            "$options": "i"
        }

    # --------------------------------------------------------
    # FETCH DOCTORS
    # --------------------------------------------------------

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

    formatted_doctors = []

    # --------------------------------------------------------
    # FETCH USER INFORMATION
    # --------------------------------------------------------

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
                "bio": 1
            }
        )

        formatted_doctors.append({

            "name": (
                user.get("name")
                if user
                else "Doctor"
            ),

            "email": (
                user.get("email")
                if user
                else None
            ),

            "phone": (
                user.get("phone")
                if user
                else None
            ),

            "image": (
                user.get("image")
                if user
                else None
            ),

            "bio": (
                user.get("bio")
                if user
                else None
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
        })

    return formatted_doctors


# ============================================================
# FORMAT AVAILABILITY
# ============================================================

def format_availability(availability):

    if not availability:
        return "Not provided"

    formatted = []

    for slot in availability:

        day = slot.get(
            "day",
            "N/A"
        )

        start = slot.get(
            "startTime",
            "N/A"
        )

        end = slot.get(
            "endTime",
            "N/A"
        )

        formatted.append(
            f"{day}: {start} - {end}"
        )

    return ", ".join(formatted)


# ============================================================
# FORMAT DOCTOR RESPONSE
# ============================================================

def generate_doctor_response(
    doctors,
    specialty="",
    city=""
):

    if not doctors:

        criteria = []

        if specialty:
            criteria.append(
                f"specialty: {specialty}"
            )

        if city:
            criteria.append(
                f"city: {city}"
            )

        criteria_text = ""

        if criteria:
            criteria_text = (
                " for " + ", ".join(criteria)
            )

        return (
            "I could not find any approved doctors"
            f"{criteria_text} in the system.\n\n"
            "You can try another specialty or city."
        )

    response = ""

    if specialty or city:

        response += (
            "Here are the approved doctors "
            "matching your request:\n\n"
        )

    else:

        response += (
            "Here are the approved doctors "
            "available in our system:\n\n"
        )

    for index, doctor in enumerate(
        doctors,
        start=1
    ):

        response += f"""
### {index}. {doctor["name"]}

- **Specialty:** {doctor.get("speciality") or "N/A"}
- **Experience:** {doctor.get("experience") or "N/A"} years
- **City:** {doctor.get("city") or "N/A"}
- **Consultation Fee:** {doctor.get("fee") or "N/A"}
- **Check Duration:** {doctor.get("checkDuration") or "N/A"} minutes
- **Availability:** {format_availability(doctor.get("availability", []))}
"""

        if doctor.get("bio"):
            response += (
                f'- **Bio:** {doctor["bio"]}\n'
            )

        response += "\n"

    return response


# ============================================================
# RAG RETRIEVAL
# ============================================================

def retrieve_medical_context(
    query: str,
    limit: int = 5
):

    # --------------------------------------------------------
    # CREATE QUERY EMBEDDING
    # --------------------------------------------------------

    query_vector = embeddings.embed_query(
        query
    )

    # --------------------------------------------------------
    # MONGODB VECTOR SEARCH
    # --------------------------------------------------------

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


# ============================================================
# FORMAT RAG CONTEXT
# ============================================================

def format_medical_context(results):

    if not results:
        return (
            "No relevant medical information "
            "was found in the knowledge base."
        )

    context_parts = []

    for index, result in enumerate(
        results,
        start=1
    ):

        text = result.get(
            "text",
            ""
        )

        if text:

            context_parts.append(
                f"""
Medical Source {index}:

{text}
"""
            )

    return "\n".join(
        context_parts
    )


# ============================================================
# EMERGENCY DETECTION
# ============================================================

EMERGENCY_KEYWORDS = [

    "severe chest pain",
    "chest pain with difficulty breathing",
    "chest pain with shortness of breath",

    "difficulty breathing",
    "cannot breathe",
    "can't breathe",

    "severe bleeding",
    "uncontrolled bleeding",

    "unconscious",
    "loss of consciousness",

    "seizure",

    "stroke symptoms",

    "face drooping",
    "slurred speech",

    "severe allergic reaction",

    "anaphylaxis"
]


def detect_emergency(query: str):

    query_lower = query.lower()

    for keyword in EMERGENCY_KEYWORDS:

        if keyword in query_lower:
            return True

    return False


# ============================================================
# MEDICAL RESPONSE
# ============================================================

def generate_medical_response(
    query: str,
    history_text: str
):

    # --------------------------------------------------------
    # RAG
    # --------------------------------------------------------

    results = retrieve_medical_context(
        query,
        limit=5
    )

    medical_context = format_medical_context(
        results
    )

    # --------------------------------------------------------
    # EMERGENCY CHECK
    # --------------------------------------------------------

    emergency = detect_emergency(
        query
    )

    emergency_instruction = ""

    if emergency:

        emergency_instruction = """
IMPORTANT:
The user's symptoms may require urgent medical attention.

Clearly advise the user to seek emergency medical
care immediately, especially if symptoms are severe,
worsening, or associated with breathing difficulty,
fainting, severe bleeding, or other emergency signs.

Do not provide a diagnosis.
"""

    # --------------------------------------------------------
    # PROMPT
    # --------------------------------------------------------

    prompt = ChatPromptTemplate.from_messages([

        (
            "system",

            """
You are a professional AI Medical Assistant.

Your responsibilities:

1. Answer general medical questions.
2. Use the provided medical knowledge context when relevant.
3. Do not diagnose a disease with certainty.
4. Explain medical information clearly.
5. Give appropriate general safety guidance.
6. If the user describes symptoms, explain possible
   general causes without claiming a diagnosis.
7. If symptoms may require urgent care, clearly recommend
   appropriate medical attention.
8. Answer in the same language as the user.
9. Do not invent information from the database.
10. Do not invent doctors.

Doctor recommendations are handled separately by the
application's doctor-search system.

Medical Knowledge Context:

{context}

Conversation History:

{history}

{emergency_instruction}
"""
        ),

        (
            "human",
            "{query}"
        )
    ])

    messages = prompt.format_messages(

        context=medical_context,

        history=history_text,

        emergency_instruction=emergency_instruction,

        query=query
    )

    response = llm.invoke(
        messages
    )

    return response.content


# ============================================================
# SYMPTOM → DOCTOR FLOW
# ============================================================

def handle_symptom_doctor_request(
    query: str,
    history_text: str
):

    combined_text = f"""
Previous Conversation:

{history_text}

Current User Message:

{query}
"""

    # --------------------------------------------------------
    # DETECT SPECIALTY FROM SYMPTOMS
    # --------------------------------------------------------

    specialty = detect_specialty_from_symptoms(
        combined_text
    )

    # --------------------------------------------------------
    # IF SPECIALTY FOUND
    # --------------------------------------------------------

    if specialty:

        city = extract_city(
            combined_text
        )

        doctors = find_approved_doctors(
            specialty=specialty,
            city=city
        )

        response = ""

        # Emergency warning
        if detect_emergency(query):

            response += (
                "⚠️ **Important:** Your symptoms may "
                "require urgent medical evaluation. "
                "If the pain is severe, persistent, or "
                "associated with difficulty breathing, "
                "fainting, sweating, or other severe "
                "symptoms, seek emergency medical care "
                "immediately.\n\n"
            )

        response += (
            f"Based on the symptoms you described, "
            f"the appropriate specialty to consider is "
            f"**{specialty}**.\n\n"
        )

        if doctors:

            response += generate_doctor_response(
                doctors,
                specialty=specialty,
                city=city
            )

        else:

            response += (
                f"I could not find any approved "
                f"**{specialty}** doctors"
            )

            if city:

                response += (
                    f" in **{city.title()}**"
                )

            response += (
                " in our system.\n\n"
                "You may try another city or consult "
                "a healthcare professional directly."
            )

        return response

    return None


# ============================================================
# DIRECT DOCTOR REQUEST
# ============================================================

def handle_direct_doctor_request(
    query: str,
    history_text: str
):

    combined_text = f"""
Previous Conversation:

{history_text}

Current User Message:

{query}
"""

    # --------------------------------------------------------
    # Extract filters from current + previous conversation
    # --------------------------------------------------------

    specialty = extract_specialty(
        combined_text
    )

    city = extract_city(
        combined_text
    )

    # --------------------------------------------------------
    # Search
    # --------------------------------------------------------

    doctors = find_approved_doctors(
        specialty=specialty,
        city=city
    )

    return generate_doctor_response(
        doctors,
        specialty=specialty,
        city=city
    )


# ============================================================
# MAIN ASSISTANT
# ============================================================

def ask_medical_assistant(
    query: str,
    history
):

    history_text = format_history(
        history
    )

    query_lower = query.lower().strip()

    # ========================================================
    # 1. SYMPTOM → SPECIALTY → DOCTOR
    # ========================================================

    symptom_response = handle_symptom_doctor_request(
        query,
        history_text
    )

    if symptom_response:

        return symptom_response

    # ========================================================
    # 2. DIRECT DOCTOR QUERY
    # ========================================================

    direct_doctor = is_direct_doctor_query(
        query
    )

    doctor_context = is_doctor_context(
        history_text
    )

    current_specialty = extract_specialty(
        query
    )

    current_city = extract_city(
        query
    )

    # Follow-up like:
    #
    # User: Give me all approved doctors
    # User: Lahore
    #
    # or:
    #
    # User: Lahore
    # User: ENT

    follow_up_doctor_request = (

        doctor_context

        and (

            bool(current_specialty)

            or bool(current_city)

            or query_lower in SPECIALTY_ALIASES
        )
    )

    if direct_doctor or follow_up_doctor_request:

        return handle_direct_doctor_request(
            query,
            history_text
        )

    # ========================================================
    # 3. NORMAL MEDICAL QUESTION → RAG
    # ========================================================

    return generate_medical_response(
        query,
        history_text
    )


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():

    return {
        "message": "AI Medical Assistant API is running",
        "status": "success"
    }


# ============================================================
# CHAT ENDPOINT
# ============================================================

@app.post("/api/chat")
def chat(request: QueryRequest):

    query = request.query.strip()

    if not query:

        return {
            "response": "Please enter a question."
        }

    try:

        response = ask_medical_assistant(
            query,
            request.history
        )

        return {
            "response": response
        }

    except Exception as error:

        print(
            "CHAT ERROR:",
            str(error)
        )

        return {
            "response": (
                "Sorry, I encountered an error "
                "while processing your request."
            )
        }