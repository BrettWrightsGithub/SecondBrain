# UI Product Requirements Document (PRD)

## 1. Overview

**Project Name:** Your Second Brain – UI Layer

This document describes the user interface requirements and outlines how users will interact with Your Second Brain. It details:

- The pages and components to be built.
- Functional flows and wireframe-level descriptions.
- File and path structure guidance in a Next.js + TailwindCSS + ShadCN environment.
- Integration points with back-end services (n8n, LLMs, storage, etc.).
- Acceptance Criteria specific to the front-end.

**Note:** For overall system logic, data pipelines, and AI orchestration, refer to the main product PRD. This UI PRD focuses on the client-facing front-end.

---

## 2. Core UI Goals

### Chat-Centric Interaction
- Provide a familiar chat interface for user-system communication.
- Streamlined conversation flow with drag-and-drop file upload.

### Cognition & Logs
- Optional side panel (or drawer) showing system “thinking,” logs, or debug info.
- Helps advanced users understand or troubleshoot system reasoning.

### Integration Setup & Management
- Credentials page or section to store and manage external integrations (API keys, tokens).
- Easy addition/removal of services.

### User Preferences & Values
- A form or settings page for user to input personal preferences, constraints, and goals.
- Data drives how the system prioritizes tasks or decisions.

### Minimalistic, Clear Design
- Leverage Tailwind CSS and ShadCN for a cohesive, modern UI.
- Keep workflows simple and logical.

### Security & Feedback
- Obvious prompts if a user is uploading potentially risky files.
- Built-in feedback mechanism so users can confirm or correct system actions in real-time.

---

## 3. High-Level UI Structure

Below is a conceptual diagram of the main pages and key components.

> ┌───────────────────┐  
> │    Layout (App)   │  
> │ ┌─────────────────┴───────────────┐  
> │ │       Main Chat Page            │  
> │ │   - Chat window                 │  
> │ │   - Drag-and-drop file upload   │  
> │ │   - Quick user input field      │  
> │ └─────────────┬───────────────────┘  
> │               │  
> │               ▼  
> │  Cognition Side Panel (drawer)    │  
> │   - System logs / "thinking"      │  
> │   - Toggle or auto-expanding      │  
> │___________________________________│  
> │               │  
> │               ▼  
> │   Credentials & Integrations Page │  
> │    - Manage service API keys      │  
> │    - List active integrations     │  
> │___________________________________│  
> │               │  
> │               ▼  
> │   Values & Preferences Page       │  
> │    - User goals/preferences form  │  
> │    - System constraints           │  
> └────────────────────────────────────┘

### 3.1. Main Chat Page
- **Primary Interaction:** Displays messages between user and “Second Brain.”
- **Input Field:** Standard text input plus file attachment button/drag-and-drop zone.
- **Message Bubbles:** Show user messages and AI/system responses.
- **Real-Time Loading:** Indicate when the system is “thinking” or processing.

### 3.2. Cognition Side Panel
- **Purpose:** Expose optional system reasoning logs, metadata, or debug info for transparency or troubleshooting.
- **Trigger:** A button or icon toggles the side panel.
- **Contents:** Step-by-step system logic, any relevant error messages, or processing statuses.

### 3.3. Credentials & Integrations Page
- **Form Elements:** Each integration (e.g., OpenAI, Groq, ClamAV config, etc.) has its own fields for API keys or tokens.
- **List:** Show currently configured integrations, with an edit/remove button.
- **Storage:** The page will call secure endpoints to store/update credentials (no direct local or front-end only storage).

### 3.4. Values & Preferences Page
- **Questionnaire/Form:** Capture the user’s guiding principles or constraints (e.g., “Notify me only if urgent,” “I prefer local LLM usage for personal data”).
- **Impact on System:** The system can reference these preferences for deciding whether to escalate tasks, store data locally, etc.
- **Save/Update:** Preferences can be updated anytime, with a confirm prompt.

---

## 4. User Flows

### 4.1. Sending a Message in Chat
1. User navigates to Main Chat Page.
2. Types a question/command in the input field (e.g., “Summarize this PDF”).
3. (Optional) Drags and drops a file onto chat or clicks “Attach” to upload.
4. UI shows a loading indicator while system processes the request.
5. System responds in chat with answer or action.
6. If additional system insights are available, they appear in the Cognition Side Panel (if open).

### 4.2. Checking System Reasoning
1. From the chat, user clicks the “Cognition” toggle.
2. A side panel slides out, showing the real-time “thought process” or logs from the last X minutes.
3. User can close or pin the panel for continuous logs.

### 4.3. Updating Credentials
1. User opens the Credentials & Integrations page from a navigation link or menu.
2. A list of configured integrations is displayed with “Add Integration” or “Edit” options.
3. User clicks “Add” to provide a new service’s API key or token.
4. Submits the form; front-end calls the back-end for secure storage.
5. Front-end updates the list to show the new integration.

### 4.4. Editing Preferences
1. User opens Values & Preferences from the main menu.
2. A form displays existing preferences (e.g., “Local LLM by default,” “Send me daily summaries”).
3. User changes some settings and clicks “Save.”
4. New settings are validated, persisted, and the user sees a success notification.

### 4.5. Providing Feedback
1. In chat, if a system action is not correct or needs adjustment, the user can highlight or click a feedback button next to the message.
2. A small modal or inline field appears where user can correct or refine the system’s output.
3. This feedback is sent to the system, logged, and used to retrain or adjust weighting (back-end logic).

---

## 5. Wireframe-Level Descriptions

Below is a minimal example of a wireframe for the Main Chat Page. Use it as a guideline rather than a final design:

> |--------------------------------------------------|  
> |          Header (app-level navigation)           |  
> |--------------------------------------------------|  
> | Chat Window:                                     |  
> |   [ User Bubble ]                                |  
> |   [ System Bubble ]                              |  
> |   ... more messages ...                          |  
> |--------------------------------------------------|  
> | [ Text Input Field ] [ Attach File Button ]      |  
> |--------------------------------------------------|  
>      ^ Toggle Cognition Panel ^  
> **Cognition Panel (when toggled):**  
> > |-----------------|-------------------------------|  
> > | Chat Window     | Cognition Panel              |  
> > |                 |  Step 1: ...                 |  
> > |                 |  Step 2: ...                 |  
> > |                 |  Debug logs, etc.            |  
> > |-----------------|-------------------------------|  

---

## 6. UI File & Path Structure

Below is an example Next.js 13 (using the app/ directory) structure. Adjust as needed, but keep it consistent to help developers navigate quickly.

> ./app  
> ├── layout.tsx            # Global layout (header, nav, root providers)  
> ├── global.css            # Tailwind base + custom global styles  
> ├── page.tsx              # Landing page or redirect to /chat  
> │  
> ├── chat  
> │   ├── page.tsx          # Main Chat Page (default export)  
> │   ├── ChatWindow.tsx    # Core chat UI & message rendering  
> │   ├── ChatInput.tsx     # Text input and file upload components  
> │   └── CognitionPanel.tsx# Side panel for system logs  
> │  
> ├── credentials  
> │   ├── page.tsx          # Credentials & Integrations page  
> │   └── CredentialForm.tsx  
> │  
> ├── preferences  
> │   ├── page.tsx          # Values & Preferences page  
> │   └── PreferencesForm.tsx  
> │  
> └── components  
>     ├── MessageBubble.tsx # Reusable component for user/system messages  
>     ├── FeedbackModal.tsx # Inline feedback mechanism for corrections  
>     ├── Navbar.tsx        # Possibly a top nav bar if needed  
>     └── ...others  

### Additional Directories:
- **/lib:** For helper functions, e.g., date/time utilities, custom hooks, or specialized fetch wrappers.
- **/hooks:** For custom React hooks (if not placed under /lib).
- **/styles:** If you prefer to keep a separate directory for styling partials or extended Tailwind configs.
- **/types:** TypeScript definitions/interfaces for message structures, user preferences, etc.

---

## 7. Tools & Libraries (Front-End)

- Next.js (app router)
- React
- TailwindCSS for layout and styling
- ShadCN for pre-built, accessible components
- Zustand (or alternative) for local/global state management
- TanStack Query for server-state management & caching
- Lucide React for icons
- Radix UI (included by ShadCN as needed)

**Notes:**
- Components should be built with accessibility in mind.
- Use ShadCN for modals, popovers, or advanced UI elements.

---

## 8. Example Functional Details

### 8.1. Drag & Drop PDF Upload in Chat
- **Frontend:**  
  A small drop zone in the chat input or a separate region. When user drops a PDF, show a “File Received” preview and an option to confirm or remove. Once confirmed, initiate the upload to the back-end route (/api/upload).
  
- **Backend:**  
  The file is scanned for viruses via ClamAV. If clean, it’s passed to the document parsing system. A reply message is returned once the system is ready to present the next step (e.g., summary).

### 8.2. Cognition Panel Live Updates
- **Trigger:** user toggles the side panel.  
- **Implementation:** Could use server-sent events or WebSockets to stream real-time logs. Or fetch log updates with TanStack Query on a set interval.  
- **UI:** display logs in chronological order, with the most recent at the top.

### 8.3. Preferences Save Workflow
- **Form:** multiple text fields, checkboxes, or toggles for user values (“I want daily summaries”), disclaimers, etc.  
- **Client-Side Validation:** e.g., requiring a valid email or limiting text length.  
- **Submission:** POST /api/preferences with new data.  
- **Success:** brief toast notification “Preferences updated.”

---

## 9. Acceptance Criteria (UI-Specific)

- **Chat Functionality:**  
  Users can send messages and receive responses without errors. File uploads for PDFs and images operate smoothly, with virus scanning indicated if relevant.

- **Cognition Panel:**  
  Toggles open/close quickly. Shows system reasoning logs or debug info in near-real-time.

- **Credentials Page:**  
  Users can add/edit/remove API credentials. Proper form validation ensures only valid inputs are accepted.

- **Preferences Page:**  
  A user can view, modify, and save their personal settings/values. Updates persist after page refresh or re-login.

- **Responsive Design:**  
  The interface scales well on desktop, tablet, and mobile. Chat and side panel remain usable in narrower viewports.

- **Styling & Branding:**  
  Adheres to Tailwind + ShadCN design standards. Looks minimalistic, with appropriate spacing, typography, and color usage.

- **Error Handling:**  
  Clear, user-friendly error messages if an upload fails or credentials can’t be saved. No unhandled exceptions or blank screens.

---

## 10. Constraints & Edge Cases

- **Offline/Slow Connection:** The system should gracefully degrade if the user has poor network conditions (e.g., show spinners or offline notices).
- **Large Files:** Large PDF uploads may take time to scan and parse. The UI should show a progress indicator or confirmation.
- **Security Warnings:** If ClamAV flags a file, the user must see a warning or immediate rejection.
- **Multi-Language:** If future localization is desired, design components to accommodate i18n.

---

## 11. Roadmap / Implementation Steps (UI-Focused)

- **Phase 1:** Basic Skeleton  
  Set up Next.js with TailwindCSS + ShadCN. Create initial Main Chat Page with minimal chat box and message list.

- **Phase 2:** Cognition Panel & File Upload  
  Implement toggling side panel with sample logs. Add file drag-and-drop or attach button logic. Connect to an /api/upload endpoint for actual file scanning and storage.

- **Phase 3:** Credentials & Preferences Pages  
  Build out separate pages with forms and data retrieval. Integrate real data storage calls (Supabase or similar).

- **Phase 4:** Feedback & Polishing  
  Inline feedback components for user corrections. Additional UI refinements, error handling, and QA pass.

---

## 12. Additional Notes / Developer Tips

- **TypeScript** is recommended for type safety (especially for message structures and form states).
- **Zustand** or **Context** can hold global states like user identity, open/closed Cognition Panel, etc.
- **Make it Modular:** Each page should have highly reusable components—especially the chat bubbles, forms, and modals.
- **Testing:** Incorporate unit tests (Jest, React Testing Library) and perhaps Cypress or Playwright for end-to-end flows (like file uploads and preference changes).

---

## Document Version

**Version:** 1.0 – UI-Focused PRD  
**Last Updated:** 25 Jan 2025

