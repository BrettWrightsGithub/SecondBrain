# INSTRUCTIONS.md

## Overview for WindSurf AI IDE
These instructions guide the WindSurf AI IDE through the development, testing, and maintenance of this project. The AI is expected to:
1. Understand the project structure and requirements.
2. Automate setup and installation.
3. Build services and connectors based on provided documentation.
4. Follow a test-driven development (TDD) approach.

### Prerequisites
1. Ensure WindSurf is up-to-date.
2. Install the following tools:
   - Node.js (>= 18.17.0)
   - Python (>= 3.8)
   - n8n.io (CLI setup)
   - Firebase CLI (if using Firebase for storage)

3. Ensure API keys for Google Drive, Pinecone, and other integrations are available.

---

## Step-by-Step Instructions

### **1. Initialize the Project**
- Create a new project folder and initialize the repository:
  ```bash
  mkdir project-name && cd project-name
  git init
  ```
- Use `WindSurf` to generate the `package.json` file and install dependencies:
  ```bash
  npm init -y
  npm install next react react-dom tailwindcss @radix-ui/react-icons zustand tanstack/react-query
  ```

### **2. Set Up the Frontend**
- Scaffold a Next.js project with TailwindCSS:
  ```bash
  npx create-next-app@latest . --typescript --eslint
  npx tailwindcss init -p
  ```
- Update `tailwind.config.js` with custom settings.
- Add a basic layout and navigation using `@radix-ui/react-icons`.
- Integrate ShadCN components for consistent and interactive UI.

### **3. Workflow Orchestration with n8n**
- Install and configure n8n:
  ```bash
  npm install -g n8n
  n8n start
  ```
- Build workflows for document parsing and Google Drive integration. Reference the [n8n Documentation](https://docs.n8n.io/) for setup.

### **4. Develop Document Parsing Service**
- Install Python libraries for PDF parsing and OCR:
  ```bash
  pip install pytesseract pdfplumber
  ```
- Create a Python script for local document processing.
- Use WindSurf to generate LangChain-based workflows for RAG setups.
- Store embeddings locally using Faiss or Pinecone.

### **5. Bluetooth File Sharing**
- Install required Bluetooth libraries:
  ```bash
  pip install pybluez
  ```
- Create a module for pairing and file transfer.
- Use WindSurf to manage iOS CoreBluetooth integrations.

### **6. Hotspot Traffic Monitoring**
- Research the [NetworkExtension Framework Documentation](https://developer.apple.com/documentation/networkextension) for iPhone integration.
- Build a dashboard for real-time traffic analytics.

### **7. AI API Assistant**
- Configure Llama 3.2 locally via Ollama.
- Use LangChain and GPT models to parse API documentation and build connectors.
- Test workflows and deploy via n8n.

### **8. Testing and Debugging**
- Use TDD with Jest for frontend components.
- Write Python unit tests for backend services.
- Leverage WindSurf to automate debugging via CLI and logs.

---

## Best Practices
1. Follow a modular architecture for services and connectors.
2. Reference the latest official documentation:
   - [Next.js](https://nextjs.org/docs)
   - [TailwindCSS](https://tailwindcss.com/docs)
   - [n8n.io](https://docs.n8n.io/)
   - [Firebase](https://firebase.google.com/docs)

3. Document workflows and edge cases for easier debugging.

4. Use WindSurf’s internet search capability to pull updated guides and examples as needed.

---

## Tests and Walkthrough
- Ensure WindSurf performs the following tests:
  1. Parses a PDF and stores embeddings.
  2. Transfers a file via Bluetooth.
  3. Monitors iPhone hotspot traffic and logs data.
  4. Builds an API connector with LangChain.

- Validate the results using sample data and user input scenarios.

---

Feel free to adapt this further based on specific feedback or additional requirements.
