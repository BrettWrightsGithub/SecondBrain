# Product Requirements Document (PRD)

## 1. Introduction

**Product Name:** Your Second Brain

Your Second Brain is a system designed to collect, process, and act upon data from diverse sources (emails, PDFs, APIs, meetings, social media, and more). It automates routine tasks, issues alerts when necessary, and continuously refines its performance through feedback and metacognition. This PRD outlines the goals, requirements, scope, and success criteria for developing and maintaining this system.

---

## 2. Purpose & Goals

1. **Centralized Intelligence**: Serve as a one-stop solution where all relevant inputs are aggregated, interpreted, and transformed into actionable insights.
2. **Adaptive & Modular**: Support a microservices approach, letting each major function run independently and be easily extended or replaced.
3. **Privacy & Security**: Emphasize local deployment and advanced encryption methods to protect sensitive data, while offering flexible options (e.g., local vs. cloud LLMs).
4. **User Efficiency**: Automate repetitive tasks, reduce the need for manual sorting or classification, and surface high-priority information.
5. **Continuous Improvement**: Implement feedback loops and metacognition to learn from real user interactions and improve system accuracy over time.

---

## 3. Key Features / Scope

1. **Layered Architecture**  
   - **Sensing**: Gather data from multiple sources (email, APIs, PDF files, etc.).  
   - **Perception**: Filter, parse, and categorize content (OCR, NLP, classification).  
   - **Cascading Subsystems**: Trigger workflows in response to recognized events or patterns.  
   - **High-Level Reasoning**: Provide summarized information and recommended actions.  
   - **Long-Term Memory**: Store reference materials, user knowledge, and historical logs.  
   - **Feedback Loops**: Integrate user feedback to adjust priorities, classification rules, or system behaviors.

2. **Local & Cloud LLM Support**  
   - **OLLama** with local models (Llama 3.2, Phi 3.5) for privacy-critical tasks.  
   - **Cloud Providers** (OpenAI, Groq, Anthropic) for more demanding tasks.

3. **Workflow Orchestration**  
   - Use **n8n** to connect microservices, define triggers, and chain actions.

4. **Data Storage & Retrieval**  
   - **Chroma** for local vector-based search.  
   - **Supabase** (local CLI or hosted) for SQL/structured data.

5. **Security & Privacy**  
   - **File Quarantine** & **ClamAV** scanning for untrusted attachments.  
   - **Docker** containers for sandboxed processing of potentially malicious data.

6. **UI & User Experience**  
   - Modern front-end with **Tailwind CSS** + **ShadCN** components.
   - **Minimal Chat-Centric Interface**: A primary chat stream for direct interaction with the second brain.
     - **Side Panel (Cognition Log)**: View system’s “thoughts” and reasoning in real time.
     - **Credentials Page**: List and manage service/API credentials.
     - **Values & Preferences Form**: Gather user goals, preferences, and constraints to guide system decisions.
     - **Feedback Mechanism**: Let users provide direct corrections or confirmations within chat.

---

## 4. Non-Goals

1. **Full Replacement of Human Judgment**: The system assists but does not fully replace human decision-making.
2. **Single Vendor Dependence**: The design should remain cloud-agnostic and not rely on any one vendor’s AI or storage solution.
3. **Production-Grade Healthcare Solutions**: While it can handle personal health data, compliance with medical regulations (e.g., HIPAA) is an aspiration but not guaranteed in the initial release.

---

## 5. Use Cases / Workflows

1. **Urgent Email Processing**  
   - Detect urgent client requests, automatically create tasks, and send reminders.
2. **Meeting Summaries & Action Items**  
   - Transcribe or partially capture calls, generate bullet-point action items, and store them.
3. **API Event Monitoring**  
   - Detect anomalies or important updates in real time, generate alerts, and log events.
4. **Social Media & Brand Monitoring**  
   - Identify negative mentions or key brand references; propose responses.
5. **Personal Health Tracking**  
   - Integrate wearable device data, detect anomalies, and suggest lifestyle improvements.

---

## 6. Tech Stack & Dependencies

1. **Primary Languages**: Node.js (>= 18.17.0) & Python (>= 3.8)
2. **Automation**: n8n (CLI setup) for workflow orchestration
3. **LLM**: OLLama (local), plus integration with OpenAI, Groq, Anthropic
4. **Storage**:  
   - Supabase (Postgres) for structured data  
   - Chroma for vector embeddings
5. **Containerization**: Docker for microservice isolation
6. **Security**:  
   - ClamAV for anti-malware scanning  
   - Local encryption & Docker isolation
7. **UI**: Tailwind CSS + ShadCN
   - Minimal chat-based interface with optional side panels

---

## 7. Security & Privacy Requirements

1. **Local-First Approach**: Sensitive data (e.g., personal health) processed locally. Users can opt in to cloud services for heavier tasks.
2. **Quarantine & Scanning**: All untrusted file attachments must pass a ClamAV check.
3. **Encryption**: At-rest encryption for local storage (LUKS, FileVault, or database-level encryption). Optional encryption for backups.
4. **Sandboxing**: Use Docker or ephemeral VMs for parsing untrusted content.

---

## 8. Performance Requirements

1. **Real-Time Alerts**: For tasks like urgent email or anomaly detection, aim for <1 minute from data arrival to alert.
2. **Batch Processing**: Large PDF or media sets should complete within a user-defined timeframe, with progress feedback.
3. **Scalability**: Must support 10s to 1000s of events daily, with feasible ways to horizontally scale.

---

## 9. UI/UX Requirements

1. **Chat-Centric Main Page**  
   - Primary interface is a chat stream between user and second brain  
   - Lower-level escalations appear as messages or prompts  
   - Users can drag/drop or upload files (e.g., PDFs) directly into chat
2. **Cognition Side Panel**  
   - Slide-out or persistent panel showing the system’s internal “thoughts,” reasoning steps, and logs
3. **Credentials & Integrations**  
   - Separate page or modal to store and manage service credentials (API keys, etc.)  
   - Optionally offload certain auth to n8n if desired
4. **Values & Preferences**  
   - A guided form or settings page to capture user’s personal values, goals, or constraints
5. **Feedback Mechanism**  
   - In-chat or separate interface for user to correct or confirm system actions  
   - The system automatically updates rules or thresholds if feasible
6. **Minimalism & Clarity**  
   - Tailwind + ShadCN for consistent design  
   - Focus on a clean, uncluttered experience

---

## 10. Roadmap & Timeline

1. **Phase 1** – Core Setup (2–4 weeks)  
   - Docker containerization, basic microservices, n8n orchestration.  
   - ClamAV scanning, simple PDF parsing.  
   - Minimal chat UI skeleton with Tailwind + ShadCN.
2. **Phase 2** – Enhanced AI & Storage (4–6 weeks)  
   - OLLama integration for local LLM tasks.  
   - Chroma for vector-based search.  
   - Supabase integration.
3. **Phase 3** – Polishing & Advanced Features (4–6 weeks)  
   - Metacognition layer for system self-tuning.  
   - Detailed chat-based interactions (multi-turn with side-panel cognition logs).  
   - Fine-tuned user preference forms & advanced feedback system.

---

## 11. Acceptance Criteria

1. **Functional**: The system correctly ingests data from configured sources, categorizes tasks, and provides recommended actions.
2. **Security**: All incoming files are scanned, and sensitive data can be stored locally with encryption.
3. **Performance**: Real-time events are processed promptly, and the system can handle daily workloads without significant lag.
4. **UI/UX**: The user can interact primarily through a chat interface, with a side panel for system logs, and a separate page or form for credentials, values, and preferences.
5. **Extensibility**: Additional data sources, AI models, or microservices can be added without major refactoring.

---

**Document Version:** 1.1  
**Last Updated:** 25 Jan 2025

