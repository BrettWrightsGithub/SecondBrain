# Tech Stack Overview

This document provides a detailed overview of the technology stack and dependencies used in the "Your Second Brain" project, including packages, tools, and frameworks organized by their respective purposes.

---

## **Languages**
- **Node.js** (>= 18.17.0): Primary language for the backend and orchestration.
- **Python** (>= 3.8): Used for PDF parsing, OCR, and data processing workflows.

---

## **Frontend Frameworks and Libraries**
- **Next.js**: Core framework for building the frontend.
- **React**: UI library for creating dynamic user interfaces.
- **TailwindCSS**: Styling framework for modern, responsive design.
- **ShadCN Components**: Component library for accessible, consistent, and interactive UI elements.
- **Zustand**: State management library for managing global and local state.
- **TanStack Query**: Query library for efficient server state management and caching.
- **Radix UI**: Accessible components for creating UI primitives.
- **Lucide React**: Icon library used for user-friendly visual elements.

---

## **Backend Frameworks and Tools**
- **n8n.io**: Workflow orchestration and automation tool.
- **LangChain**: Framework for building AI workflows and connecting to large language models.
- **OLLama**: Local LLM framework for privacy-first AI capabilities (Llama 3.2, Phi 3.5 models).
- **OpenAI API**: Cloud-based LLM integration for advanced AI tasks.
- **Anthropic and Groq APIs**: Alternative AI providers for specialized AI functionalities.

---

## **Data Storage and Retrieval**
- **Chroma**: Local vector database for embedding-based search and retrieval.
- **Supabase**: Postgres-based storage for structured data.
- **Firebase**: Real-time database for syncing application state and user data.

---

## **File and Data Processing**
- **PyTesseract**: OCR library for extracting text from images and scanned PDFs.
- **pdfplumber**: Python library for parsing text from PDF documents.
- **ClamAV**: Malware scanning tool for quarantining untrusted files.

---

## **Security and Containerization**
- **Docker**: For containerized deployments of microservices.
- **File Encryption**: Local encryption via LUKS, FileVault, or database-level encryption.
- **ClamAV**: File scanning for untrusted or unknown attachments.

---

## **DevOps and Infrastructure**
- **Node.js**: Package management with npm.
- **Python Pip**: For managing dependencies in Python workflows.
- **Docker**: Used for microservice orchestration and secure isolation of untrusted processes.

---

## **AI Workflow**
- **LangChain**: Integration with LLMs for task chaining and decision-making processes.
- **Chroma**: Vector database for embeddings and fast information retrieval.
- **OpenAI API**: Access to GPT-based models for processing complex AI tasks.
- **OLLama**: Privacy-centric local LLM framework.

---

## **UX and UI Design**
- **TailwindCSS**: Utility-first CSS framework for modern styling.
- **ShadCN Components**: Advanced UI components for accessibility and consistency.
- **Lucide React**: Icon library for intuitive visual communication.

---

## **Workflow Automation**
- **n8n.io**: Central tool for managing workflows and connecting different services.
- **LangChain**: Automates chaining of AI tasks for dynamic workflows.

---

## **Sensing and Data Input Modules**
- **PDF Parser**: Extracts data from documents.
- **Metadata Tagging**: Adds descriptive metadata to files and folders.
- **API Integrations**: For ingesting live data streams, such as Google Calendar and Drive APIs.
- **Social Media Scrapers**: Captures data from Twitter, LinkedIn, and similar platforms.

---

## **Decision-Making Tools**
- **Dashboard**: Displays metrics like CPU usage, memory, and storage in real-time.
- **Feedback Mechanism**: Integrates user feedback into workflows and system adjustments.
- **Prioritization Algorithms**: Scores tasks based on urgency and impact for better decision-making.

---

This tech stack reflects a modular, privacy-conscious design and emphasizes extensibility and user-centric functionality. Updates or new additions can be incorporated seamlessly without disrupting the existing ecosystem.

