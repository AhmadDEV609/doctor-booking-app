# 🏥 AI-Powered Medical Appointment & Healthcare Management Platform

A modern full-stack healthcare management platform that connects **patients, doctors, and administrators** through a centralized digital healthcare system.

The platform provides doctor discovery, appointment booking, availability management, administrative appointment management, and an **AI Medical Assistant powered by Retrieval-Augmented Generation (RAG)**.

---

## 📌 Overview

The goal of this project is to build a practical healthcare platform that simplifies appointment management while providing an intelligent AI-powered assistant for healthcare-related information.

The system is designed around three primary roles:

* 👤 **Patient**
* 👨‍⚕️ **Doctor**
* 🛡️ **Administrator**

Patients can discover doctors and book appointments based on availability. Doctors can manage their professional information and availability, while administrators can monitor and manage doctors and appointments through a dedicated dashboard.

The platform also integrates an **AI Medical Assistant** as a separate Python-based service. The assistant uses **RAG (Retrieval-Augmented Generation)** to retrieve relevant information from a curated medical knowledge base before generating a response.

> ⚠️ **Medical Disclaimer:** The AI Medical Assistant is intended for educational and informational purposes only. It is not a replacement for professional medical diagnosis, treatment, or emergency medical care.

---

## ✨ Key Features

### 👤 Patient Features

* User registration and authentication
* Secure login/logout
* Doctor discovery
* Doctor profile viewing
* Doctor speciality information
* Doctor availability viewing
* Appointment booking
* Appointment date and time selection
* Payment method selection
* Personal appointment history
* Appointment status tracking
* Responsive user interface

---

### 👨‍⚕️ Doctor Features

* Doctor registration
* Doctor profile management
* Professional information management
* Speciality information
* Availability management
* Appointment visibility
* Account approval workflow
* Doctor status management

---

### 🛡️ Admin Features

* Dedicated admin dashboard
* Doctor management
* Doctor approval/rejection
* Appointment management
* Appointment status updates
* Search appointments
* Filter appointments by status
* Appointment statistics
* Responsive appointment table
* Mobile-friendly appointment cards
* Real-time UI state updates after status changes
* Loading states
* Error handling
* Refresh functionality

---

### 🤖 AI Medical Assistant

The project includes an AI Medical Assistant designed around a **Retrieval-Augmented Generation (RAG)** architecture.

The assistant is intended to:

* Answer healthcare-related questions
* Retrieve relevant information from a medical knowledge base
* Provide context-aware responses
* Reduce hallucination by grounding responses in retrieved sources
* Maintain conversational context
* Separate AI functionality from the main application backend

### RAG Architecture

```text
User
 │
 ▼
React Frontend
 │
 ▼
Node.js / Express Backend
 │
 ▼
Python AI Service
 │
 ├── Query Processing
 │
 ├── Embedding Generation
 │
 ├── Vector Database
 │
 ├── Relevant Document Retrieval
 │
 └── LLM Response Generation
 │
 ▼
AI Medical Assistant Response
```

The AI service is planned as an independent **Python + FastAPI** service so that the RAG pipeline can evolve independently from the main Node.js backend.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │     React Client     │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Node.js / Express  │
                    │    Main Backend      │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │    Users    │  │   Doctors   │  │ Appointments│
       │   Module    │  │   Module    │  │   Module    │
       └─────────────┘  └─────────────┘  └─────────────┘
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                       ┌─────────────┐
                       │  MongoDB    │
                       └─────────────┘

                               │
                               │ AI Requests
                               ▼
                    ┌──────────────────────┐
                    │   Python / FastAPI   │
                    │     AI Service       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      RAG Pipeline    │
                    ├──────────────────────┤
                    │ Embeddings           │
                    │ Vector Retrieval     │
                    │ Medical Knowledge    │
                    │ LLM                  │
                    └──────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

| Technology   | Purpose                        |
| ------------ | ------------------------------ |
| React.js     | Frontend framework             |
| React Hooks  | State and lifecycle management |
| React Router | Client-side routing            |
| Tailwind CSS | Styling and responsive UI      |
| Axios        | API communication              |
| Lucide React | UI icons                       |

---

## Backend

| Technology        | Purpose                    |
| ----------------- | -------------------------- |
| Node.js           | Backend runtime            |
| Express.js        | REST API framework         |
| MongoDB           | Database                   |
| Mongoose          | MongoDB ODM                |
| JWT / Cookies     | Authentication             |
| Express Validator | Request validation         |
| Cookie Parser     | Cookie handling            |
| CORS              | Cross-origin communication |

---

## AI / RAG

| Technology             | Purpose              |
| ---------------------- | -------------------- |
| Python                 | AI service           |
| FastAPI                | AI API service       |
| LangChain / LlamaIndex | RAG orchestration    |
| Embedding Model        | Text embeddings      |
| Vector Database        | Semantic retrieval   |
| LLM                    | Response generation  |
| Medical Knowledge Base | Grounded information |

> The exact LLM, embedding model, and vector database can be configured according to deployment requirements.

---

# 📂 Project Structure

A recommended project structure is:

```text
medical-platform/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── config/
│   │   └── app.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── ai-service/
│   ├── app/
│   │   ├── api/
│   │   ├── rag/
│   │   ├── embeddings/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── knowledge-base/
│   ├── requirements.txt
│   └── .env
│
├── README.md
└── .gitignore
```

---

# 🔐 Authentication & Authorization

The platform uses authentication to protect application resources.

The backend can distinguish between different user roles and restrict access to protected routes.

Example:

```text
Patient
   │
   ├── View Doctors
   ├── Book Appointment
   └── View Own Appointments

Doctor
   │
   ├── Manage Profile
   ├── Manage Availability
   └── Manage Doctor Information

Admin
   │
   ├── Manage Doctors
   ├── Approve/Reject Doctors
   ├── View Appointments
   └── Update Appointment Status
```

---

# 📅 Appointment Management

The appointment system supports:

* Doctor selection
* Date selection
* Time-slot selection
* Doctor availability validation
* Duplicate appointment prevention
* Payment method selection
* Appointment status management
* Admin appointment monitoring

### Appointment Flow

```text
Patient
   │
   ▼
Select Doctor
   │
   ▼
Check Availability
   │
   ▼
Select Date & Time
   │
   ▼
Choose Payment Method
   │
   ▼
Create Appointment
   │
   ▼
Pending
   │
   ├── Confirmed
   │
   ├── Completed
   │
   └── Cancelled
```

---

# 👨‍⚕️ Doctor Approval Workflow

Administrators can manage doctor account approval.

```text
Doctor Registration
        │
        ▼
     Pending
      /   \
     /     \
    ▼       ▼
Approved   Rejected
```

This allows the platform to maintain administrative control over doctor accounts before they become fully active.

---

# 🤖 RAG-Based AI Medical Assistant

The AI Medical Assistant uses **Retrieval-Augmented Generation** instead of relying entirely on an LLM's pre-trained knowledge.

## How RAG Works

```text
User Question
      │
      ▼
Query Processing
      │
      ▼
Generate Query Embedding
      │
      ▼
Vector Search
      │
      ▼
Retrieve Relevant Medical Documents
      │
      ▼
Build Context
      │
      ▼
LLM
      │
      ▼
Grounded Response
```

### Benefits

* Better contextual responses
* Knowledge-base grounding
* Reduced hallucination
* Easier knowledge updates
* Source-based answers
* Domain-specific retrieval

---

# 🧠 Medical Knowledge Base

The RAG system can use a curated collection of trusted medical information such as:

* Medical guidelines
* Patient education materials
* Disease information
* Medication information
* Symptoms and general health information
* Preventive healthcare information
* Healthcare FAQs

The knowledge base should be carefully reviewed and maintained before being used in production.

---

# 🔌 API Overview

## Authentication

```http
POST /api/v1/users/register
POST /api/v1/users/login
POST /api/v1/users/logout
```

---

## Doctors

```http
GET /api/v1/admin/doctors
PATCH /api/v1/admin/doctors/:doctorId/status
```

---

## Appointments

```http
POST /api/v1/appointments/:doctorId
GET  /api/v1/appointments
GET  /api/v1/appointments/my
PATCH /api/v1/appointments/:appointmentId
```

---

## AI Assistant

Example AI service endpoint:

```http
POST /api/v1/ai/chat
```

Example request:

```json
{
  "message": "What are common symptoms of dehydration?"
}
```

Example response:

```json
{
  "success": true,
  "answer": "Dehydration can commonly cause thirst, dry mouth, fatigue, dizziness, and reduced urination.",
  "sources": []
}
```

---

# ⚙️ Environment Variables

## Backend

Create a `.env` file inside the backend directory:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

NODE_ENV=development
```

---

## Frontend

Example:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## AI Service

Example:

```env
AI_PORT=8000

OPENAI_API_KEY=your_api_key

VECTOR_DATABASE_URL=your_vector_database_url

EMBEDDING_MODEL=your_embedding_model

LLM_MODEL=your_llm_model
```

> Never commit `.env` files or API keys to GitHub.

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repository.git
```

```bash
cd your-repository
```

---

# Frontend Setup

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

Frontend will typically run on:

```text
http://localhost:5173
```

---

# Backend Setup

Open another terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env`:

```bash
cp .env.example .env
```

Start the backend:

```bash
npm run dev
```

Backend will typically run on:

```text
http://localhost:5000
```

---

# AI Service Setup

Open another terminal:

```bash
cd ai-service
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Activate it on Linux/macOS:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI service:

```bash
uvicorn app.main:app --reload --port 8000
```

The AI service will typically run on:

```text
http://localhost:8000
```

---

# 🧪 Testing

The project can be tested at multiple levels.

### Frontend

```bash
npm run test
```

### Backend

```bash
npm test
```

### AI Service

```bash
pytest
```

> Testing commands may vary depending on the project's configured testing tools.

---

# 📱 Responsive Design

The application is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

The admin appointment interface provides:

### Desktop

```text
Responsive Data Table
```

### Mobile / Tablet

```text
Appointment Cards
```

This allows administrators to manage appointments comfortably across different screen sizes.

---

# ⚡ UI State Management

The admin dashboard provides immediate visual feedback when appointment status changes.

For example:

```text
Pending
   │
   │ Admin changes status
   ▼
API Request
   │
   ▼
Database Updated
   │
   ▼
Frontend State Updated
   │
   ▼
Updated Status UI
```

This avoids requiring the administrator to manually refresh the page after every update.

---

# 🛡️ Error Handling

The application includes handling for common scenarios such as:

* Invalid requests
* Authentication failures
* Missing resources
* Invalid appointment status
* Doctor not found
* Appointment conflicts
* API failures
* Database errors
* Frontend loading failures

The backend uses centralized error handling middleware to provide consistent API error responses.

---

# 🔒 Security Considerations

Security is an important part of the platform because the application deals with healthcare-related information.

Recommended production practices include:

* Secure authentication
* HTTP-only cookies
* Strong JWT secrets
* Password hashing
* Input validation
* Request sanitization
* CORS configuration
* Rate limiting
* Secure HTTP headers
* Environment variable protection
* Database access controls
* API authorization
* Audit logging

Sensitive patient information should never be exposed unnecessarily through API responses or logs.

---

# 🗄️ Database Models

The platform includes several core entities.

### User

```text
User
├── name
├── email
├── password
├── role
├── image
├── phone
└── other profile information
```

### Doctor

```text
Doctor
├── userId
├── speciality
├── bio
├── availability
├── approveStatus
└── professional information
```

### Appointment

```text
Appointment
├── userId
├── doctorId
├── day
├── date
├── startTime
├── endTime
├── paymentMethod
├── approveStatus
├── createdAt
└── updatedAt
```

---

# 🔄 Appointment Status

The application uses appointment status values to represent the appointment lifecycle.

```text
Pending
Confirmed
Completed
Cancelled
```

These statuses are displayed through the admin dashboard and can be used for filtering and statistics.

---

# 📊 Admin Dashboard

The admin appointment dashboard provides:

* Total appointments
* Pending appointments
* Confirmed appointments
* Completed appointments
* Cancelled appointments
* Search functionality
* Status filtering
* Appointment details
* Doctor information
* Patient information
* Payment information
* Appointment date/time
* Status update controls

---

# 🧩 Future Improvements

The platform can be extended with additional healthcare features.

### AI & RAG

* [ ] Medical document ingestion pipeline
* [ ] Vector database integration
* [ ] Source citations in AI responses
* [ ] Conversation history
* [ ] Patient-specific AI context
* [ ] Multilingual medical assistant
* [ ] Voice-based AI assistant
* [ ] Medical document summarization
* [ ] AI-powered symptom information
* [ ] Retrieval evaluation system
* [ ] Hallucination monitoring

### Healthcare Platform

* [ ] Doctor-patient messaging
* [ ] Video consultations
* [ ] Prescription management
* [ ] Medical reports
* [ ] Patient medical history
* [ ] Notifications
* [ ] Email reminders
* [ ] SMS notifications
* [ ] Online payment integration
* [ ] Appointment rescheduling
* [ ] Doctor reviews and ratings

### Administration

* [ ] Advanced analytics
* [ ] Revenue dashboard
* [ ] User management
* [ ] Audit logs
* [ ] System activity monitoring
* [ ] Advanced reporting

---

# 🌐 Production Architecture

A production deployment could be structured as:

```text
                    Internet
                       │
                       ▼
                ┌──────────────┐
                │   Frontend   │
                │ React / CDN  │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ API Gateway  │
                └──────┬───────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
      ┌──────────────┐  ┌──────────────┐
      │ Node Backend │  │ AI Service   │
      │ Express      │  │ FastAPI      │
      └──────┬───────┘  └──────┬───────┘
             │                 │
             ▼                 ▼
      ┌──────────────┐  ┌──────────────┐
      │   MongoDB    │  │ Vector DB    │
      └──────────────┘  └──────────────┘
```

---

# 🤝 Contributing

Contributions are welcome.

To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Commit your changes
6. Push the branch
7. Open a Pull Request

Example:

```bash
git checkout -b feature/medical-chatbot
```

```bash
git add .
```

```bash
git commit -m "Add AI medical assistant"
```

```bash
git push origin feature/medical-chatbot
```

---

# 📜 License

This project is intended for educational and development purposes.

Add an appropriate open-source license such as **MIT License** if you intend to distribute the project publicly.

---

# ⚠️ Medical Disclaimer

The AI Medical Assistant is **not a medical professional** and should not be used as a substitute for professional medical advice, diagnosis, or treatment.

Users should consult a qualified healthcare professional for medical decisions, diagnosis, treatment, medication, or emergency situations.

---

# 👨‍💻 Author

**Muhammad Ahmad**

Full-Stack Developer | MERN Stack | AI & RAG

---

# ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

Contributions, suggestions, and feedback are welcome.

---

## 📌 Project Status

**Status:** 🚧 Active Development

The core healthcare management functionality is under development, with the AI Medical Assistant and RAG pipeline being developed as an independent Python/FastAPI service.
