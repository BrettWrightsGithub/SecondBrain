
# INSTRUCTIONS.md

## Project Overview

This project involves the development of an AI-powered system that integrates document parsing, Bluetooth file sharing, hotspot traffic monitoring, and real-time analytics using advanced workflows and AI-driven insights. The project will leverage technologies like Next.js, Python, LangChain, and n8n for end-to-end implementation.

### Key Features
1. Real-time document parsing and semantic embedding storage.
2. Bluetooth file sharing module for iPhone to PC transfers.
3. Hotspot traffic monitoring with real-time analytics.
4. Scalable workflows using n8n and LangChain for task automation.
5. Modular architecture for easy scalability and maintenance.

---

## Technical Stack Overview

### Frontend
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: TailwindCSS with Radix UI and ShadCN components
- **State Management**: Zustand
- **API Query Management**: TanStack Query

### Backend
- **Workflow Orchestration**: n8n.io
- **Data Storage**: Pinecone, Faiss, Firebase
- **LLM Integration**: LangChain, OpenAI, OLLama
- **Security**: Docker, ClamAV, LUKS

### Tools
- Node.js >= 18.17.0
- Python >= 3.8
- Bluetooth Libraries: PyBluez
- Document Parsing: PyTesseract, pdfplumber

---

## Setup Instructions

### Step 1: Environment Setup
1. Install Node.js (>= 18.17.0) and Python (>= 3.8).
2. Configure n8n:
   ```bash
   npm install -g n8n
   n8n start
   ```
3. Install necessary Python libraries:
   ```bash
   pip install pytesseract pdfplumber pybluez
   ```

### Step 2: Initialize Project
1. Create a new project and initialize Git:
   ```bash
   mkdir project-name && cd project-name
   git init
   ```
2. Install dependencies:
   ```bash
   npm init -y
   npm install next react react-dom tailwindcss @radix-ui/react-icons zustand tanstack/react-query
   npx tailwindcss init -p
   ```

### Step 3: Configure Frontend
1. Scaffold the Next.js application with TailwindCSS.
2. Update `tailwind.config.js` with custom settings.
3. Add ShadCN components for consistent UI design.

### Step 4: Build Workflows with n8n
1. Create workflows for:
   - Document parsing using PyTesseract and pdfplumber.
   - Real-time API monitoring.
   - Bluetooth file sharing and hotspot analytics.
2. Store embeddings in Faiss or Pinecone for vector search.

### Step 5: Develop Core Features
1. **Document Parsing**:
   - Use PyTesseract for OCR and pdfplumber for PDF parsing.
   - Build LangChain workflows for embedding creation and storage.
2. **Bluetooth File Sharing**:
   - Implement PyBluez for file transfer.
   - Integrate with iOS CoreBluetooth for seamless functionality.
3. **Hotspot Traffic Monitoring**:
   - Use the iOS NetworkExtension Framework for monitoring.
   - Display traffic analytics in a dashboard.

---

## Scenario Implementation

### Scenario 1: Document Parsing and Embedding Storage
- Parse uploaded documents for text and semantic meaning.
- Store embeddings in Pinecone for retrieval.
- Automate using n8n workflows.

### Scenario 2: Real-Time Meeting Notes
- Transcribe audio using Whisper.
- Extract action items and store summaries in Firebase.
- Generate automated follow-ups based on meeting content.

### Scenario 3: API Monitoring
- Subscribe to APIs for real-time updates.
- Detect anomalies using predefined thresholds.
- Alert users for critical events and log data.

### Scenario 4: Social Media Monitoring
- Monitor social media channels for brand mentions.
- Classify sentiment and recommend responses.
- Store interactions in long-term memory.

### Scenario 5: Health Data Analytics
- Connect to health devices for real-time data.
- Compare metrics against historical baselines.
- Provide actionable insights and recommendations.

---

## Testing and Validation

1. Test all workflows with sample data:
   - PDF parsing and embedding creation.
   - File transfer via Bluetooth.
   - Hotspot analytics.
2. Validate outputs against expected results.
3. Perform end-to-end tests for scenario workflows.

---

## References and Documentation

| **Component**       | **Documentation URL**                                         |
|---------------------|---------------------------------------------------------------|
| Next.js             | [Next.js Documentation](https://nextjs.org/docs)             |
| TailwindCSS         | [TailwindCSS Documentation](https://tailwindcss.com/docs)     |
| n8n.io              | [n8n Documentation](https://docs.n8n.io/)                    |
| LangChain           | [LangChain Documentation](https://python.langchain.com/docs) |
| PyTesseract         | [PyTesseract Documentation](https://pypi.org/project/pytesseract/) |
| Pinecone            | [Pinecone Documentation](https://www.pinecone.io/docs/)       |
| Faiss               | [Faiss Documentation](https://github.com/facebookresearch/faiss) |

---

This file serves as a comprehensive guide for developers to set up, develop, and test the project in alignment with the provided PRD and scenarios.
