import os
import re
import json

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



load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is missing")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI is missing")



app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


client = MongoClient(MONGODB_URI)

db = client["medical_assistant"]

medical_chunks_collection = db["medical_chunks"]
doctors_collection = db["doctors"]
users_collection = db["users"]


embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=GOOGLE_API_KEY
)


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=GOOGLE_API_KEY,
    temperature=0.2
)




class QueryRequest(BaseModel):

    query: str

    history: list = []




SPECIALTY_ALIASES = {

    # Heart
    "cardiologist": "heart",
    "cardiology": "heart",
    "heart specialist": "heart",
    "heart doctor": "heart",

    # ENT
    "ent": "ENT",
    "ent specialist": "ENT",
    "ear nose throat": "ENT",
    "ear doctor": "ENT",

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

    # Orthopedic
    "orthopedic": "orthopedic",
    "orthopedist": "orthopedic",
    "orthopedic doctor": "orthopedic",
    "bone specialist": "orthopedic",

    # Gynecology
    "gynecologist": "gynecology",
    "gynecology": "gynecology",
    "gynae": "gynecology",
    "women specialist": "gynecology",

    # Pediatrics
    "pediatrician": "pediatrics",
    "pediatrics": "pediatrics",
    "child specialist": "pediatrics",
    "children doctor": "pediatrics",

    # Gastroenterology
    "gastroenterologist": "gastroenterology",
    "gastroenterology": "gastroenterology",
    "stomach specialist": "gastroenterology",
    "stomach doctor": "gastroenterology",

    # Urology
    "urologist": "urology",
    "urology": "urology",
    "urinary specialist": "urology",
    "urine doctor": "urology",

    # Pulmonology
    "pulmonologist": "pulmonology",
    "pulmonology": "pulmonology",
    "lung specialist": "pulmonology",
    "lung doctor": "pulmonology",

    # Endocrinology
    "endocrinologist": "endocrinology",
    "endocrinology": "endocrinology",
    "diabetes specialist": "endocrinology",
    "hormone specialist": "endocrinology",

    # Psychiatry
    "psychiatrist": "psychiatry",
    "psychiatry": "psychiatry",
    "mental health specialist": "psychiatry",
    "mental health doctor": "psychiatry",

    # Ophthalmology
    "ophthalmologist": "ophthalmology",
    "ophthalmology": "ophthalmology",
    "eye specialist": "ophthalmology",
    "eye doctor": "ophthalmology",

    # Dentistry
    "dentist": "dentistry",
    "dental": "dentistry",
    "dental specialist": "dentistry",
    "teeth specialist": "dentistry",
}



KNOWN_CITIES = [
    "lahore",
    "karachi",
    "islamabad",
    "rawalpindi",
    "faisalabad",
    "multan",
    "peshawar",
    "quetta",
    "gujranwala",
    "sialkot",
    "hyderabad",
    "bahawalpur",
]


def format_history(history):

    if not history:
        return ""

    recent_history = history[-10:]

    formatted = []

    for message in recent_history:

        role = message.get("role", "")
        content = message.get("content", "")

        formatted.append(
            f"{role}: {content}"
        )

    return "\n".join(formatted)


# ============================================================
# CITY EXTRACTION
#
# Used for MongoDB doctor search.
# ============================================================

def extract_city(text):

    text_lower = text.lower()

    for city in KNOWN_CITIES:

        if re.search(
            rf"\b{re.escape(city)}\b",
            text_lower
        ):
            return city

    return ""


# ============================================================
# SPECIALTY EXTRACTION
#
# Used mainly for direct doctor requests.
# ============================================================

def extract_specialty(text):

    text_lower = text.lower().strip()

    aliases = sorted(
        SPECIALTY_ALIASES.keys(),
        key=len,
        reverse=True
    )

    for alias in aliases:

        if re.search(
            rf"\b{re.escape(alias)}\b",
            text_lower
        ):
            return SPECIALTY_ALIASES[alias]

    return ""




def analyze_medical_query(
    query,
    history_text=""
):

    prompt = ChatPromptTemplate.from_messages(
        [

            (
                "system",
                """
You are the medical-intelligence router for a medical
assistant application.

Your job is NOT to diagnose the patient.

Your job is to analyze the user's message and return
ONLY valid JSON.

The user may write in:

- English
- Urdu
- Roman Urdu
- mixed English/Roman Urdu
- informal language
- misspelled words
- different descriptions of the same symptom

You must understand the meaning rather than relying
only on exact keywords.

Determine:

1. Whether the user is describing symptoms.
2. Whether the symptoms may indicate an emergency.
3. Which medical specialty would be the most appropriate
   for a doctor search, if a doctor is needed.
4. Whether the user is explicitly asking to find/show a doctor.
5. Whether the user is asking a general medical question.

IMPORTANT:

- Do NOT diagnose the user.
- Do NOT invent symptoms that were not mentioned.
- Do NOT assume an emergency unless the information suggests
  a potentially urgent or life-threatening situation.
- When symptoms involve potentially serious warning signs,
  set emergency=true.
- If emergency=true, provide a short reason in emergency_reason.
- Choose the most appropriate specialty from the allowed
  specialties below.
- If no specialty is reasonably identifiable, use "".
- For a general medical question with no symptoms,
  symptoms=false.
- A user can describe symptoms without explicitly saying
  "symptom".
- Informal descriptions should be semantically understood.

Allowed specialties:

heart
ENT
dermatology
neurology
orthopedic
gynecology
pediatrics
gastroenterology
urology
pulmonology
endocrinology
psychiatry
ophthalmology
dentistry
general_medicine

Return exactly this JSON structure:

{
    "is_symptom_query": true,
    "emergency": false,
    "emergency_reason": "",
    "specialty": "",
    "doctor_needed": false,
    "direct_doctor_request": false,
    "general_medical_question": false,
    "symptoms": []
}

Rules for fields:

is_symptom_query:
true if user is describing one or more symptoms.

emergency:
true if the described situation may require immediate
medical attention.

specialty:
the most appropriate medical specialty.

doctor_needed:
true when symptoms reasonably warrant seeing a doctor
or the user is asking for a doctor.

direct_doctor_request:
true when the user explicitly asks to find/show/recommend
a doctor or specialist.

general_medical_question:
true when the user is asking for medical information
rather than asking to find a doctor.

symptoms:
list the symptoms actually understood from the user.
Do not invent symptoms.

Return JSON only.
"""
            ),

            (
                "human",
                """
Previous Conversation:

{history_text}

Current User Message:

{query}

Analyze the current message in the context of the
previous conversation.
Return JSON only.
"""
            )

        ]
    )

    chain = prompt | llm

    try:

        response = chain.invoke(
            {
                "history_text": history_text,
                "query": query,
            }
        )

        content = response.content.strip()

        # Remove markdown code fences if Gemini adds them
        content = re.sub(
            r"^```json\s*",
            "",
            content,
            flags=re.IGNORECASE
        )

        content = re.sub(
            r"^```\s*",
            "",
            content
        )

        content = re.sub(
            r"\s*```$",
            "",
            content
        )

        analysis = json.loads(content)

        return analysis

    except Exception as error:

        print(
            "Medical Analysis Error:",
            error
        )

        # Safe fallback
        return {
            "is_symptom_query": False,
            "emergency": False,
            "emergency_reason": "",
            "specialty": "",
            "doctor_needed": False,
            "direct_doctor_request": False,
            "general_medical_question": True,
            "symptoms": []
        }


# ============================================================
# DOCTOR QUERY DETECTION
#
# Kept as fallback for direct doctor requests.
# ============================================================

def is_direct_doctor_query(query):

    query_lower = query.lower()

    doctor_keywords = [

        "doctor",
        "doctors",
        "specialist",
        "specialists",
        "physician",
        "which doctor",
        "find doctor",
        "find doctors",
        "show doctor",
        "show doctors",
        "need a doctor",
        "recommend doctor",
        "recommend a doctor",
    ]

    for keyword in doctor_keywords:

        if keyword in query_lower:
            return True

    return False


# ============================================================
# DOCTOR CONTEXT
# ============================================================

def is_doctor_context(history_text):

    history_lower = history_text.lower()

    doctor_keywords = [

        "doctor",
        "doctors",
        "specialist",
        "specialists",
        "physician",

        "cardiologist",
        "dermatologist",
        "neurologist",
        "orthopedic",
        "gynecologist",
        "pediatrician",
        "gastroenterologist",
        "urologist",
        "pulmonologist",
        "psychiatrist",
        "ophthalmologist",
        "dentist",
    ]

    for keyword in doctor_keywords:

        if keyword in history_lower:
            return True

    return False


# ============================================================
# APPROVED DOCTORS SEARCH
#
# SAME MONGODB LOGIC
# ============================================================

def find_approved_doctors(
    specialty="",
    city=""
):

    mongo_query = {
        "approveStatus": "approved"
    }

    # --------------------------------------------------------
    # Specialty filter
    # --------------------------------------------------------

    if specialty:

        mongo_query["speciality"] = {
            "$regex": f"^{re.escape(specialty)}$",
            "$options": "i"
        }

    # --------------------------------------------------------
    # City filter
    # --------------------------------------------------------

    if city:

        mongo_query["city"] = {
            "$regex": f"^{re.escape(city)}$",
            "$options": "i"
        }

    doctors = doctors_collection.find(
        mongo_query,
        {
            "_id": 1,
            "userId": 1,
            "speciality": 1,
            "experience": 1,
            "fee": 1,
            "city": 1,
            "checkDuration": 1,
            "availability": 1,
        }
    )

    result = []

    for doctor in doctors:

        user = users_collection.find_one(
            {
                "_id": doctor.get("userId")
            },
            {
                "name": 1,
                "email": 1,
                "phone": 1,
                "image": 1,
                "bio": 1,
            }
        )

        doctor_data = {

            "_id": doctor.get("_id"),

            "userId": doctor.get("userId"),

            "speciality": doctor.get(
                "speciality",
                ""
            ),

            "experience": doctor.get(
                "experience",
                ""
            ),

            "fee": doctor.get(
                "fee",
                ""
            ),

            "city": doctor.get(
                "city",
                ""
            ),

            "checkDuration": doctor.get(
                "checkDuration",
                ""
            ),

            "availability": doctor.get(
                "availability",
                []
            ),

            "name": user.get(
                "name",
                ""
            ) if user else "",

            "email": user.get(
                "email",
                ""
            ) if user else "",

            "phone": user.get(
                "phone",
                ""
            ) if user else "",

            "image": user.get(
                "image",
                ""
            ) if user else "",

            "bio": user.get(
                "bio",
                ""
            ) if user else "",
        }

        result.append(doctor_data)

    return result


# ============================================================
# DOCTOR RESPONSE GENERATOR
#
# SAME DOCTOR RESPONSE LOGIC
# ============================================================

def generate_doctor_response(
    doctors,
    specialty="",
    city=""
):

    if not doctors:

        return (
            "I could not find any approved doctors "
            "matching your requested criteria."
        )

    doctor_data = json.dumps(
        doctors,
        default=str,
        indent=2
    )

    prompt = ChatPromptTemplate.from_messages(
        [

            (
                "system",
                """
You are a medical appointment assistant.

Your task is to format the doctor information
provided to you.

IMPORTANT RULES:

1. Use ONLY the doctor data provided.
2. Do NOT invent any information.
3. Do NOT change doctor information.
4. Do NOT remove any doctor.
5. Display EVERY doctor.
6. Keep the response concise and professional.
7. Do not provide medical advice.
8. Respond in the same language as the user when possible.
"""
            ),

            (
                "human",
                """
User requested:

Specialty: {specialty}
City: {city}

Doctor data:

{doctor_data}

Format the doctor information clearly.
"""
            )

        ]
    )

    try:

        chain = prompt | llm

        response = chain.invoke(
            {
                "specialty": specialty,
                "city": city,
                "doctor_data": doctor_data,
            }
        )

        return response.content

    except Exception:

        response_lines = []

        for index, doctor in enumerate(
            doctors,
            start=1
        ):

            response_lines.append(
                f"""
Doctor {index}

Name: {doctor.get("name", "N/A")}
Speciality: {doctor.get("speciality", "N/A")}
Experience: {doctor.get("experience", "N/A")}
Fee: {doctor.get("fee", "N/A")}
City: {doctor.get("city", "N/A")}
Check Duration: {doctor.get("checkDuration", "N/A")}
Email: {doctor.get("email", "N/A")}
Phone: {doctor.get("phone", "N/A")}
Bio: {doctor.get("bio", "N/A")}
Availability: {doctor.get("availability", "N/A")}
"""
            )

        return "\n".join(response_lines)



# RAG — RETRIEVE MEDICAL CONTEXT
#
# SAME VECTOR SEARCH


def retrieve_medical_context(
    query,
    limit=5
):

    query_embedding = embeddings.embed_query(
        query
    )

    results = medical_chunks_collection.aggregate(
        [

            {
                "$vectorSearch": {

                    "index": "medical_vector_index",

                    "path": "embedding",

                    "queryVector": query_embedding,

                    "numCandidates": 50,

                    "limit": limit,
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
    )

    return list(results)



# FORMAT RAG CONTEXT


def format_medical_context(results):

    if not results:

        return "No relevant medical information was found."

    context_parts = []

    for index, result in enumerate(
        results,
        start=1
    ):

        text = result.get(
            "text",
            ""
        )

        score = result.get(
            "score",
            0
        )

        context_parts.append(
            f"""
Medical Source {index}

Relevance Score: {score}

{text}
"""
        )

    return "\n\n".join(
        context_parts
    )


# ============================================================
# RAG RELEVANCE CHECK
#
# This prevents unrelated chunks from being treated
# as relevant context.
# ============================================================

def has_relevant_rag_context(results):

    if not results:
        return False

    # MongoDB vector search score threshold.
    #
    # This is intentionally moderate.
    # You can tune it later according to your dataset.
    MIN_RELEVANCE_SCORE = 0.55

    for result in results:

        score = result.get(
            "score",
            0
        )

        try:
            score = float(score)
        except Exception:
            score = 0

        if score >= MIN_RELEVANCE_SCORE:
            return True

    return False


# ============================================================
# EMERGENCY RESPONSE
# ============================================================

def build_emergency_response(
    analysis,
    specialty=""
):

    reason = analysis.get(
        "emergency_reason",
        ""
    )

    if reason:

        emergency_text = (
            "⚠️ **This may require urgent medical attention.**\n\n"
            f"{reason}\n\n"
            "Please seek immediate medical attention or "
            "contact your local emergency service. "
            "Do not delay urgent care."
        )

    else:

        emergency_text = (
            "⚠️ **This may be a medical emergency.**\n\n"
            "Please seek immediate medical attention or "
            "contact your local emergency service. "
            "Do not delay urgent care."
        )

    return emergency_text



def handle_symptom_request(
    query,
    history_text,
    analysis
):

    if not analysis.get(
        "is_symptom_query",
        False
    ):
        return None

    specialty = analysis.get(
        "specialty",
        ""
    )

    doctor_needed = analysis.get(
        "doctor_needed",
        False
    )

    emergency = analysis.get(
        "emergency",
        False
    )

    # --------------------------------------------------------
    # Emergency first
    # --------------------------------------------------------

    emergency_response = ""

    if emergency:

        emergency_response = (
            build_emergency_response(
                analysis,
                specialty
            )
            + "\n\n"
        )

    # --------------------------------------------------------
    # If Gemini cannot determine specialty,
    # do NOT guess.
    # Let RAG answer the medical question.
    # --------------------------------------------------------

    if not specialty:

        return None

    # --------------------------------------------------------
    # General medicine can be handled by RAG
    # rather than searching for a specialist.
    # --------------------------------------------------------

    if specialty == "general_medicine":

        if emergency:

            return (
                emergency_response
                + handle_rag_request(
                    query,
                    history_text,
                    analysis
                )
            )

        return None

    # --------------------------------------------------------
    # If this is a symptom query but doctor is not needed,
    # let RAG provide educational information.
    # --------------------------------------------------------

    if not doctor_needed:

        if emergency:

            return (
                emergency_response
                + handle_rag_request(
                    query,
                    history_text,
                    analysis
                )
            )

        return None

    # --------------------------------------------------------
    # Extract city
    # --------------------------------------------------------

    combined_text = (
        history_text
        + "\n"
        + query
    )

    city = extract_city(
        combined_text
    )

    # --------------------------------------------------------
    # Find approved doctors
    # --------------------------------------------------------

    doctors = find_approved_doctors(
        specialty=specialty,
        city=city
    )

    # --------------------------------------------------------
    # Base response
    # --------------------------------------------------------

    response = emergency_response

    response += (
        "Based on the symptoms you described, "
        f"the appropriate specialty to consider is "
        f"**{specialty}**.\n\n"
    )

    # --------------------------------------------------------
    # No doctors
    # --------------------------------------------------------

    if not doctors:

        response += (
            "I could not find any approved doctors "
            f"for **{specialty}**"
        )

        if city:

            response += (
                f" in **{city}**"
            )

        response += "."

        return response

    # --------------------------------------------------------
    # Doctor response
    # --------------------------------------------------------

    doctor_response = generate_doctor_response(
        doctors=doctors,
        specialty=specialty,
        city=city
    )

    response += doctor_response

    return response


# ============================================================
# DIRECT DOCTOR REQUEST
#
# Gemini analysis is used first.
# Existing aliases remain as fallback.
# ============================================================

def handle_doctor_request(
    query,
    history_text,
    analysis
):

    query_lower = query.lower().strip()

    # --------------------------------------------------------
    # LLM decision
    # --------------------------------------------------------

    direct_doctor = analysis.get(
        "direct_doctor_request",
        False
    )

    # --------------------------------------------------------
    # Existing fallback
    # --------------------------------------------------------

    if not direct_doctor:

        direct_doctor = is_direct_doctor_query(
            query
        )

    # --------------------------------------------------------
    # Previous doctor conversation
    # --------------------------------------------------------

    doctor_context = is_doctor_context(
        history_text
    )

    # --------------------------------------------------------
    # Current specialty/city
    # --------------------------------------------------------

    current_specialty = extract_specialty(
        query
    )

    current_city = extract_city(
        query
    )

  
    follow_up_doctor_request = (

        doctor_context

        and (

            bool(current_specialty)

            or bool(current_city)

            or query_lower in SPECIALTY_ALIASES
        )
    )

  
    # Not a doctor request
    

    if not direct_doctor and not follow_up_doctor_request:

        return None

  
    # Combine conversation
    

    combined_text = (
        history_text
        + "\n"
        + query
    )



    specialty = extract_specialty(
        query
    )

    if not specialty:

        specialty = analysis.get(
            "specialty",
            ""
        )

    if not specialty:

        specialty = extract_specialty(
            combined_text
        )

   
    # City
   

    city = extract_city(
        combined_text
    )


    # If specialty is general medicine,
    # do not use it as a specialist MongoDB filter.
   

    if specialty == "general_medicine":

        specialty = ""

  
    # Search MongoDB
   

    doctors = find_approved_doctors(
        specialty=specialty,
        city=city
    )

 
    # Return doctor response
  

    return generate_doctor_response(
        doctors=doctors,
        specialty=specialty,
        city=city
    )



def handle_rag_request(
    query,
    history_text,
    analysis
):

  
    # Retrieve medical context
    

    results = retrieve_medical_context(
        query,
        limit=5
    )

  
    # Check whether context is actually relevant
    

    rag_context_available = (
        has_relevant_rag_context(
            results
        )
    )

    # Format context

    medical_context = format_medical_context(
        results
    )

    
    # Emergency instruction
   

    emergency_instruction = ""

    if analysis.get(
        "emergency",
        False
    ):

        emergency_reason = analysis.get(
            "emergency_reason",
            ""
        )

        emergency_instruction = f"""
IMPORTANT EMERGENCY INSTRUCTION:

The medical-intelligence layer has identified
that the user's situation may require urgent
medical attention.

Emergency reason:

{emergency_reason}

Clearly advise the user to seek immediate
medical attention or contact their local
emergency service.

Do not delay urgent care.

Do not diagnose the user.
"""

    
    # RAG / GENERAL KNOWLEDGE instruction
  

    if rag_context_available:

        knowledge_instruction = """
The retrieved medical context appears relevant
to the user's question.

Use it as the primary source for the answer.

You may use your general medical knowledge only
to explain or clarify the provided information.

Do not contradict the provided context.
Do not claim that general knowledge came from
the retrieved sources.
"""

    else:

        knowledge_instruction = """
The retrieved medical context is missing,
insufficient, or not sufficiently relevant
to the user's question.

In this situation, answer using your general
medical knowledge.

Be transparent that the answer is based on
general medical knowledge rather than the
retrieved medical context.

Do NOT say that the context contains information
when it does not.

Do NOT invent citations or sources.
"""

  
    # RAG prompt
   
    prompt = ChatPromptTemplate.from_messages(
        [

            (
                "system",
                """
You are a helpful AI medical assistant.

Your role is to provide general educational
medical information.

You are NOT a doctor and must NOT diagnose
the user.

IMPORTANT SAFETY RULES:

1. Do not diagnose the user.
2. Do not claim certainty about a medical condition.
3. Explain possible causes or possibilities carefully.
4. Provide useful general educational information.
5. Encourage professional medical consultation
   when appropriate.
6. If the situation appears urgent or dangerous,
   recommend immediate medical attention.
7. Do not invent medical facts.
8. Do not invent sources.
9. Respond in the same language/style as the user
   when reasonably possible.
10. Understand English, Urdu, Roman Urdu and
    mixed language.

KNOWLEDGE SOURCE RULE:

{knowledge_instruction}

{emergency_instruction}
"""
            ),

            (
                "human",
                """
Retrieved Medical Context:

{medical_context}

Previous Conversation:

{history_text}

Medical Intelligence Analysis:

{analysis}

User Question:

{query}

Provide the best helpful educational answer.
"""
            )

        ]
    )

   
    # Run Gemini
  

    chain = prompt | llm

    response = chain.invoke(
        {
            "medical_context": medical_context,

            "history_text": history_text,

            "analysis": json.dumps(
                analysis,
                ensure_ascii=False
            ),

            "query": query,

            "knowledge_instruction":
                knowledge_instruction,

            "emergency_instruction":
                emergency_instruction,
        }
    )

    return response.content




def ask_medical_assistant(
    query,
    history
):

    # Format history
   

    history_text = format_history(
        history
    )

    
    # STEP 1
    # LLM analyzes user message
   

    analysis = analyze_medical_query(
        query=query,
        history_text=history_text
    )

    print(
        "Medical Analysis:",
        json.dumps(
            analysis,
            indent=2,
            ensure_ascii=False
        )
    )

  
    # STEP 2
    # EMERGENCY + SYMPTOM HANDLING
   

    response = handle_symptom_request(
        query=query,
        history_text=history_text,
        analysis=analysis
    )

    if response:

        return response

  
    # STEP 3
    # DIRECT DOCTOR / DOCTOR FOLLOW-UP
    

    response = handle_doctor_request(
        query=query,
        history_text=history_text,
        analysis=analysis
    )

    if response:

        return response

    

    return handle_rag_request(
        query=query,
        history_text=history_text,
        analysis=analysis
    )



# CHAT API


@app.post("/api/chat")
def chat(request: QueryRequest):

    try:

        query = request.query.strip()

        if not query:

            return {
                "response": "Please enter a question."
            }

        response = ask_medical_assistant(
            query,
            request.history
        )

        return {
            "response": response
        }

    except Exception as error:

        print(
            "Chat Error:",
            error
        )

        return {
            "response":
                "Sorry, something went wrong. "
                "Please try again."
        }



# ROOT


@app.get("/")
def root():

    return {
        "message":
            "Medical Assistant API is running."
    }
