
# Contact Data Ingestion & Processing System - Database Schema

## 1. Overview
This document outlines the schema for the contact data ingestion and processing system, including tables for storing documents, events, and structured contact information.

---

## 2. Database Schema (Postgres)

### **Table: `documents`**
Stores ingested files such as vCard, PDFs, and emails.

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL,  -- e.g., "vCard", "PDF", "Email"
    file_data BYTEA,          -- Raw file content
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### **Table: `events`**
Tracks ingestion events, linking documents and contact records.

```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,  -- e.g., "Ingest vCard", "Update Contact"
    document_id INT REFERENCES documents(id) ON DELETE CASCADE,
    contact_id INT REFERENCES contacts(id) ON DELETE SET NULL,
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### **Table: `contacts`**
Stores structured contact information extracted from ingested documents.

```sql
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
    interests TEXT[],       -- Array of interests
    important_dates JSONB,  -- Store anniversaries, etc.
    personality_notes TEXT,
    personal_values TEXT,   -- Personal values associated with the contact
    other_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_event_id INT REFERENCES events(id) -- Track last modification event
);
```

---

## 3. Relationships

- `documents` → `events`: A document ingestion event is recorded each time a file is processed.
- `events` → `contacts`: Tracks which contacts were created or updated from an event.
- `contacts` → `events`: Stores the latest ingestion/modification event for each contact.

---

## 4. Future Considerations
- Indexing key fields (e.g., `email`, `phone`) for faster queries.
- Implementing data retention policies for documents.
- Expansion to additional document types beyond vCard and PDFs.

