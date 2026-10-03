# FirstPR AI

### Your AI guide to your first open-source contribution.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Open-Weight AI](https://img.shields.io/badge/AI-Open--Weight%20Llama%203%20%2F%20Mistral-indigo)](https://github.com)

---

## 💡 Overview

**FirstPR AI** helps developers, especially beginners, make their first pull request to an unfamiliar open-source GitHub repository.

Entering a new open-source codebase is intimidating:
```
GitHub repository ──> Massive README ──> Hundreds of files ──> Countless issues 
──> Unclear difficulty ──> Unknown architecture ──> Friction & abandoned contribution
```

FirstPR AI transforms that experience:
```
"I want to contribute, but I don't know where to start."
                          │
                          ▼
"Here is the issue that best matches your skills, why it fits, 
 which files to open, and a step-by-step roadmap to submit your PR."
```

---

## 🚀 Key Features

* **Multi-Factor Issue Reasoning**: Open-weight AI evaluates real open issues against your declared skills, experience level, and learning goals.
* **Contribution Match Score**: Displays an interpretable 0–100% Contribution Match score grounded in skill overlap and localized scope.
* **Concrete "Start Here" First Action**: Highlights the immediate next step (e.g., `"Open src/errors.py and inspect format_error()"`).
* **Where You'll Probably Work**: Pinpoints relevant repository files with direct clickable links to the GitHub tree.
* **Contribution Roadmap**: Generates an 8-step chronological roadmap covering environment setup, code modification, testing, and PR submission.
* **Skill Match Matrix**: Clearly separates your existing skills from skills you'll learn during the contribution.
* **Interactive AI Mentor Chat**: Follow-up chat panel grounded strictly in the repository context and recommended issue to answer questions in real time.
* **Prompt Injection Defense**: Repository content is treated strictly as untrusted data using explicit XML boundaries (`<repository_data>`) and defense prompts.
* **Resilient Development Fallback**: Automatically activates a local heuristic analysis engine if running offline or without an active API key.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│                   React + Vite Frontend                │
│  Tailwind CSS • Reusable Components • Live Progress   │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP JSON API
┌───────────────────────────▼────────────────────────────┐
│                    FastAPI Backend                     │
│  Input Validation • Rate Limit Caching • Error Handler │
└──────┬──────────────────────────────────────────┬──────┘
       │                                          │
       ▼                                          ▼
┌──────────────────────────────┐   ┌──────────────────────────────┐
│       GitHub REST API        │   │       Open-Weight AI         │
│  Repository Details          │   │  Llama 3 / Mistral / Qwen    │
│  README & CONTRIBUTING       │   │  Groq / Ollama / OpenRouter  │
│  Git Tree Structure          │   │  Structured JSON Validation  │
│  Filtered Candidate Issues   │   │  Prompt Injection Isolation  │
└──────────────────────────────┘   └──────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React, Vite, JavaScript | Component architecture and fast development |
| **Styling** | Tailwind CSS | Sleek dark-mode developer UI |
| **Icons** | Lucide React | Developer-focused iconography |
| **Backend** | Python 3.11+, FastAPI | High-performance asynchronous API |
| **Validation** | Pydantic v2 | Strict schema validation for inputs and AI outputs |
| **HTTP Client**| httpx | Async HTTP client for GitHub & LLM endpoints |
| **AI Models** | Open-Weight (Llama 3, Mistral, Qwen) | Multi-factor reasoning and candidate ranking |

---

## ⚙️ Quick Start Guide

### Prerequisites

* Python 3.11 or higher
* Node.js v18 or higher & npm

### 1. Clone & Setup Environment

```bash
git clone https://github.com/your-username/firstpr-ai.git
cd firstpr-ai
cp .env.example .env
```

Edit `.env` to configure your AI provider and optional GitHub token:
```env
# Optional: Increases GitHub rate limits from 60 to 5,000 req/hr
GITHUB_TOKEN=ghp_...

# Open-Weight AI Model Settings
AI_PROVIDER=open_weight
MODEL_NAME=llama-3.3-70b-versatile
MODEL_BASE_URL=https://api.groq.com/openai/v1
MODEL_API_KEY=gsk_...
```

> **Note:** If no `MODEL_API_KEY` is provided, FirstPR AI will run using its **Development Heuristic Engine** out of the box so you can test all UI and repository flows immediately.

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# On Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend development server
uvicorn app.main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`. You can test interactive docs at `http://localhost:8000/docs`.

---

### 3. Frontend Setup

In a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install npm packages
npm install

# Start Vite dev server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🧪 Running Tests

Run the full pytest suite for URL validation, issue candidate filtering, AI JSON parsing, and schema validation:

```bash
cd backend
.\.venv\Scripts\python -m pytest tests -v
```

---

## 📡 API Endpoints

### 1. `POST /api/analyze`
Analyzes a repository and developer profile to recommend an optimal first contribution.

**Request:**
```json
{
  "repo_url": "https://github.com/pallets/flask",
  "skills": ["Python", "Testing"],
  "experience": "Beginner",
  "learning_goal": "Learn how Flask tests are organized"
}
```

**Response:**
```json
{
  "repository": {
    "name": "flask",
    "owner": "pallets",
    "stars": 69200
  },
  "recommended_issue": {
    "number": 5421,
    "title": "Improve error message when custom json encoder fails",
    "difficulty": "Beginner",
    "match_score": 93,
    "contribution_type": "Bug Fix / Improvement",
    "relevant_files": [
      {
        "path": "src/flask/json/__init__.py",
        "reason": "Primary source file likely requiring modification."
      }
    ]
  },
  "first_action": "Open `src/flask/json/__init__.py` and inspect custom encoder handling.",
  "why_this_issue": [...],
  "roadmap": [...]
}
```

### 2. `POST /api/chat`
Follow-up mentor chat grounded in the analyzed repository and recommendation.

**Request:**
```json
{
  "question": "What should I do first?",
  "repository_context": { "full_name": "pallets/flask" },
  "recommendation": { "number": 5421, "title": "..." }
}
```

---

## 🔒 Security & Prompt Injection Defense

Repository content (READMEs, issue bodies, source code) is treated as **untrusted data**:
1. All repository inputs are wrapped in `<repository_data>` delimiters.
2. System prompts instruct the model never to treat repository files as executable instructions.
3. No secrets or tokens are ever sent to the React frontend.
4. Input URLs are validated and sanitized before any outbound requests.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
