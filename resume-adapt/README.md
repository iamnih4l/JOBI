# JOBI - Resume Adapt

A local-first web application for adapting your LaTeX resume to job descriptions using a local LLM (Ollama). 
This runs entirely on your local machine—no data is sent to the cloud.

## Prerequisites

1. **Node.js** (v18+)
2. **pdflatex** (via MiKTeX on Windows, or TeX Live on Linux/Mac) - Must be available in your system's PATH.
3. **Ollama** - Run locally on `http://127.0.0.1:11434` with an installed model (e.g., `ollama run llama3`).

## Setup

```bash
# 1. Install dependencies for both frontend and backend
npm run setup

# 2. Start the development environment (runs both Vite and Express)
npm run dev
```

## Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite (local file: `resume_adapt.db`)
- **AI Processing**: Ollama (Air-gapped local inference)
