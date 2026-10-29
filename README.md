# Gemini AI Workspace • Boutique Full-Stack Engineering Assistant

An award-winning, boutique AI assistant and engineering workspace built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Google Gemini 2.5 Flash API**, designed under the **Human-Crafted UI Standards** and **UI/UX Pro Design System**.

---

## 🎨 Architectural Design Highlights

- **3-Token Color Restraint (60/30/10 Rule):**
  - **60% Paper:** Deep Obsidian (`#0a0a0b`), surface glass (`#121216`), subtle cards (`#18181d`).
  - **30% Ink:** Crisp typography (`#ededed` headlines, `#a1a1aa` body, `#71717a` captions).
  - **10% Scarcity Accent:** Radiant Ember Glow (`#ff331f`) reserved strictly for primary action CTAs, active thread indicator, and streaming states.
- **Master Button & Interaction Architecture:**
  - **Radiant Ember Glow CTA:** Physics-based lift, specular shimmer sweep, and tactile mechanical depression.
  - **Frosted Obsidian Glass Buttons:** Double-border depth with inner rim highlights.
  - **3-Tier Elevation Shadows:** Level 1 (resting cards), Level 2 (hover/floating docks), Level 3 (modals/dialogs).
- **7 Scientific Spacing Rules:** Strict mathematical spacing (4px/8px multiples), semantic clustering, and generous internal card breathing room.
- **Production Polish:** Zero horizontal overflow (`overflow-x-hidden`), 100% mobile touch targets (>= 44x44px), dynamic copyright year, and authentic developer copy.

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Connect Google Gemini API
1. Open the app in your browser (default `http://localhost:5173`).
2. Click **Connect API Key** or press **Cmd+K** / **Ctrl+K** to open Settings.
3. Paste your free Google AI Studio API key from [aistudio.google.com](https://aistudio.google.com/).
4. Select your persona: **Senior Full-Stack Mentor**, **AI & Systems Architect**, or **Engineering Career Strategist**.

---

## 🛠️ Tech Stack
- **Frontend Framework:** React 18 with TypeScript
- **Styling & Design Tokens:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Motion & Physics:** Framer Motion & CSS hardware-accelerated transforms
- **AI Engine:** Google Gemini 2.5 Flash & 1.5 Pro via Server-Sent Events (SSE) streaming

---

## 🚀 Build & Production
```bash
npm run build
npm run preview
```
Deploy instantly to **Vercel**, **Netlify**, or **Cloudflare Pages**.

---

## 🧪 Testing & Quality Assurance

The project does not currently include an automated test runner. Use this checklist for manual QA before a release; run checks with a valid Gemini API key unless noted otherwise.

### Functional & API Checks
- **Connectivity and authentication:** Confirm a valid API key connects successfully. Try a missing or invalid key and verify the UI explains the problem and how to resolve it.
- **Streaming:** Send a prompt that generates a long response. Check that streamed text appears smoothly, with no missing characters, excessive buffering, or broken Markdown rendering.
- **Cancellation:** Stop a response while it is generating. Confirm generation ends cleanly and the chat remains usable.
- **Conversation context:** Ask a question, then follow up with a contextual prompt such as “How do I fix that in TypeScript?” Confirm the response uses the earlier turn.

### Prompt & Persona Checks
- **Persona adherence:** Try each available persona with the same prompt and confirm its tone, depth, and formatting reflect its role.
- **Instruction following:** Request constrained output, such as exactly three bullet points or pure JSON without Markdown fences, and check the result.
- **Temperature:** If temperature is configurable, compare repeated prompts at a low setting (0.0–0.2) with a higher setting (0.7–1.0). Low settings should tend toward consistency; higher settings may be more varied.

### Edge Cases & Robustness
- Try a blank message, a single punctuation mark, malformed code, and a very long prompt. Confirm invalid input is handled clearly and long content remains usable in the UI.
- Test an instruction attempting to override the assistant's role. Confirm the assistant continues to follow its configured instructions and does not disclose hidden instructions.
- Ask about a fictional API, such as `useHyperSpaceMatrix`. Check that the assistant expresses uncertainty rather than inventing unsupported facts.

### UI, Responsive Design & Accessibility
- Check code-block syntax highlighting and use **Copy** to verify the clipboard contains the code without Markdown fences.
- Inspect desktop (1920px), laptop (1024px), and mobile (390px/430px) viewports. Confirm navigation remains usable, touch targets are at least 44×44px, and there is no horizontal overflow.
- Test keyboard navigation, **Enter** to send, **Shift+Enter** for a newline, and **Ctrl+K**/**Cmd+K** to open Settings.
- Enable `prefers-reduced-motion` in the operating system or browser and confirm animations respect the preference.

### Optional Automated Evaluation
- Maintain a golden dataset of 20–50 representative prompts and expected answer criteria to compare behavior across model changes.
- Optionally use an LLM-as-a-judge to score factual accuracy, relevance, and formatting adherence. Review scores alongside human evaluation rather than treating them as definitive.
