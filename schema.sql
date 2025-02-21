-- Create documents table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_data BYTEA,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create contacts table without circular dependency
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    preferred_name TEXT,
    date_of_birth DATE,
    phone TEXT,
    email TEXT UNIQUE,
    address TEXT,
    social_profiles JSONB,
    family_details JSONB,
    interests TEXT[],
    important_dates JSONB,
    personality_notes TEXT,
    other_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    event_type TEXT NOT NULL,
    document_id INT REFERENCES documents(id) ON DELETE CASCADE,
    contact_id INT REFERENCES contacts(id) ON DELETE SET NULL,
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alter contacts table to add last_event_id column with foreign key to events
ALTER TABLE contacts
  ADD COLUMN last_event_id INT REFERENCES events(id);
