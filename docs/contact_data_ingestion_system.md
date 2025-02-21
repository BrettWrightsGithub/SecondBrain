
# Contact Data Ingestion & Processing System

## 1. Overview
This document outlines the functionality for ingesting, processing, and storing contact-related data from various sources such as vCard files, PDFs, emails, and manually entered details. The system ensures traceability by linking each data ingestion event to structured contact records stored in a local Postgres database.

---

## 2. Data Flow Overview
### High-Level Data Processing Pipeline
1. **Ingestion Phase**  
   - A user provides input data (vCard, PDF, email text, etc.).  
   - The file or text is stored in the `documents` table.  

2. **AI Processing Phase**  
   - The document is analyzed using **LLM parsing (LangChain + OLLama/OpenAI)**.  
   - AI extracts structured fields (e.g., Name, Email, DOB, Address).  
   - The system checks for **new or existing contacts** in the `contacts` table.  

3. **Event Logging Phase**  
   - A record of the ingestion is stored in the `events` table, linking:  
     - The **original document** (from `documents`).  
     - The **created/updated contact record** (from `contacts`).  

4. **Storage & Retrieval**  
   - The user can **view, search, and retrieve structured contact records**.  
   - **Events maintain a history** of modifications for auditing and corrections.  

---

## 3. Database Schema (Postgres)
```sql
-- Table for storing ingested documents (vCard, PDF, Emails)
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL,  -- e.g., "vCard", "PDF", "Email"
    file_data BYTEA,          -- Raw file content
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking ingestion events
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,  -- e.g., "Ingest vCard", "Update Contact"
    document_id INT REFERENCES documents(id) ON DELETE CASCADE,
    contact_id INT REFERENCES contacts(id) ON DELETE SET NULL,
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing structured contact records
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    preferred_name TEXT,
    date_of_birth DATE,
    phone TEXT,
    email TEXT UNIQUE,
    address TEXT,
    social_profiles JSONB,  -- Store social media links as JSON
    family_details JSONB,   -- Store family relationships as JSON
    interests TEXT[],
    important_dates JSONB,  -- Store anniversaries, etc.
    personality_notes TEXT,
    other_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_event_id INT REFERENCES events(id) -- Track last modification event
);
```

---

## 4. AI Prompt for Data Extraction
### AI Assistant Role
The AI is responsible for extracting structured contact details from unstructured text or files.

**Prompt Template:**
> You are an AI personal assistant that extracts structured contact information from unstructured data. Below is a passage containing details about a person. Your task is to extract key details and organize them into a structured format.  
> 
> **Source Context:** {Email, Meeting Notes, Social Media, Personal Notes, PDF, etc.}  
> **Timestamp of the Data:** {Date & Time when the information was recorded}  
> 
> Extract the following fields:
> - **Full Name**  
> - **Nickname/Preferred Name**  
> - **Date of Birth**  
> - **Address (if provided)**  
> - **Contact Information** (phone, email, etc.)  
> - **Social Media Profiles** (if any)  
> - **Family/Relationship Details** (e.g., spouse, children, parents)  
> - **Interests and Hobbies**  
> - **Favorite Activities or Pastimes**  
> - **Important Dates** (anniversaries, birthdays of significant people)  
> - **Personality Traits/Notes**  
> - **Other Relevant Details**  
> 
> If a field is not mentioned or unclear, return `"N/A"` for that field.
> 
> ### Example Output:
> ```json
> {
>   "Source": "Email",
>   "Timestamp": "2025-02-20 14:35:00",
>   "Full Name": "John Smith",
>   "Nickname/Preferred Name": "Johnny",
>   "Date of Birth": "1985-07-12",
>   "Address": "123 Main St, Anytown, USA",
>   "Contact Information": "john.smith@example.com, (555) 123-4567",
>   "Social Media Profiles": {"LinkedIn": "linkedin.com/in/johnsmith"},
>   "Family/Relationship Details": "Married, two children",
>   "Interests and Hobbies": ["Hiking", "Photography", "Reading"],
>   "Important Dates": {"Wedding": "2010-06-20"},
>   "Personality Traits/Notes": "Outgoing, creative, detail-oriented",
>   "Other Relevant Details": "Enjoys learning new languages"
> }
> ```

---

## 5. Integration with Tech Stack
### Backend (Postgres & n8n)
✔ **Postgres stores structured data (contacts, events, documents).**  
✔ **n8n manages ingestion workflows & AI integration.**  
✔ **API endpoints (Next.js) handle queries & file retrieval.**  

### Frontend (Next.js + React)
✔ **TanStack Query fetches contact/event data.**  
✔ **Zustand manages local state (e.g., draft contact records).**  
✔ **ShadCN UI components display structured data in tables & modals.**  

---

## 6. Workflow Diagram
```mermaid
graph TD
  A[Data Ingestion] -->|Raw Data| B[n8n Workflow]
  B -->|Preprocessing| C[AI Parsing (LangChain + OLLama)]
  C -->|Extract Structured Data| D[AI Filtering (Privacy Rules)]
  D -->|Check Data Sensitivity| E{Storage Decision}
  E -->|Personal Data| F[Postgres (Local Storage)]
  E -->|General Data| G[Supabase/Chroma (Optional)]
  F -->|Retrieval| H[n8n Query & User Interface]
  G -->|Retrieval| H
```

---

## 7. Next Steps & Enhancements
✔ **UI Component Implementation**: Develop a Next.js UI for managing contacts & event history.  
✔ **n8n Workflow Setup**: Automate ingestion, AI extraction, and storage.  
✔ **AI Model Optimization**: Fine-tune AI prompts for better data accuracy.  
✔ **Data Retention Policies**: Decide how long raw files (vCards, PDFs) should be stored.  
