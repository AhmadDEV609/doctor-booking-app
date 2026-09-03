import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter


# =========================
# PATHS
# =========================

BASE_DIR = Path(__file__).resolve().parent

PDF_PATH = BASE_DIR / "data" / "data.pdf"


# =========================
# ENVIRONMENT VARIABLES
# =========================

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is missing from .env")

if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY is missing from .env")


# =========================
# MONGODB CONNECTION
# =========================

client = MongoClient(MONGODB_URI)

db = client["test"]

collection = db["medical_chunks"]


# =========================
# CHECK PDF
# =========================

if not PDF_PATH.exists():
    raise FileNotFoundError(
        f"PDF not found: {PDF_PATH}"
    )


# =========================
# LOAD PDF
# =========================

print("Loading PDF...")

loader = PyPDFLoader(str(PDF_PATH))

documents = loader.load()

print(f"Loaded pages: {len(documents)}")


# =========================
# SPLIT DOCUMENT
# =========================

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1500,
    chunk_overlap=150
)

chunks = text_splitter.split_documents(documents)

print(f"Total chunks: {len(chunks)}")


# =========================
# GEMINI EMBEDDINGS
# =========================

print("Creating Gemini embedding model...")

embeddings = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001"
)


# =========================
# CREATE EMBEDDINGS
# =========================

print("Creating embeddings...")
print("Please wait...")

texts = [
    chunk.page_content
    for chunk in chunks
]

vectors = embeddings.embed_documents(texts)

print(f"Created embeddings: {len(vectors)}")


# =========================
# PREPARE MONGODB DOCUMENTS
# =========================

mongo_documents = []

for chunk, vector in zip(chunks, vectors):

    mongo_documents.append(
        {
            "text": chunk.page_content,
            "embedding": vector,
            "metadata": chunk.metadata
        }
    )


# =========================
# INSERT INTO MONGODB
# =========================

print("Inserting chunks into MongoDB...")

if mongo_documents:

    result = collection.insert_many(
        mongo_documents
    )

    print(
        f"Inserted documents: {len(result.inserted_ids)}"
    )


# =========================
# FINISHED
# =========================

total_documents = collection.count_documents({})

print("\n================================")
print("INGESTION COMPLETED SUCCESSFULLY")
print("================================")

print(f"Collection: test.medical_chunks")
print(f"Total documents: {total_documents}")