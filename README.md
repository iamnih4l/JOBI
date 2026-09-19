# Jobi

> Your resume. Adapted for every job.

<p align="center">
  <img src="resume-adapt/public/jobi-logo.svg" alt="Jobi Logo" width="96" height="96" />
</p>

Jobi is an open-source, privacy-first, local web application designed to tailor your authentic master resume for every job description. Powered by on-device AI via Ollama and perfect mathematical typography via LaTeX, Jobi runs entirely on your own machine. 

**Adapt. Don't fabricate.**

```text
              ┌───────────────────────┐
              │     MASTER RESUME     │
              └───────────┬───────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │  JOB DESCRIPTION │
                 └────────┬───────┘
                          │
                          ▼
                ┌──────────────────┐
                │   JOBI ENGINE    │
                │                  │
                │ Parse            │
                │ Analyze          │
                │ Match            │
                │ Adapt            │
                │ Review           │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │ ADAPTED RESUME   │
                └────────┬─────────┘
                         │
                 ┌───────┴────────┐
                 ▼                ▼
              .TEX              .PDF
```

## Quick Navigation

- [Overview](#overview)
- [Why Jobi?](#why-jobi)
- [Features](#features)
- [How Jobi Works](#how-jobi-works)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Installation](#installation)
- [First Run](#first-run)
- [Local AI](#local-ai)
- [Privacy](#privacy)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Testing](#testing)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Why Jobi?

Maintaining multiple resumes is tedious. Manually tailoring bullet points to match job requirements is time-consuming. 

While generic cloud-based AI resume generators exist, they often fabricate information, compromise privacy by uploading your data to third-party servers, and charge for API usage. Furthermore, LaTeX users often want to preserve their finely-tuned typographic templates rather than relying on a web builder.

Jobi's philosophy is strict: it uses your *existing* master resume and only modifies what is necessary to align with a specific job description. Your raw experience remains yours.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Features

### Resume Management
- **Master Resume Source**: Maintains an immutable master version of your career history.
- **Multiple Adaptations**: Create unique versions tailored to different job descriptions without losing your original content.

### Job Analysis
- **Job Description Parsing**: Automatically extracts critical keywords and requirements from any job posting.

### Adaptation Pipeline
- **Locally Generated Adaptations**: Rewrites bullet points to highlight the most relevant skills.
- **Review Before Applying**: Granular accept/reject/edit interface for every AI-proposed change.

### LaTeX Support
- **Local Compilation**: Builds production-grade `.pdf` files directly on your machine.
- **Template Preservation**: Maintains your exact LaTeX styling and structure.

### Privacy
- **100% Local Processing**: No cloud APIs, no network calls to external LLMs.
- **Local SQLite Storage**: All parsing, matching, and data persistence happens locally on your drive.
- **No Accounts**: Runs entirely on your hardware without authentication or subscriptions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## How Jobi Works

```text
MASTER RESUME
      │
      ▼
IMPORT / PARSE
      │
      ▼
JOB DESCRIPTION
      │
      ▼
ANALYZE REQUIREMENTS
      │
      ▼
MATCH RESUME ↔ JOB
      │
      ▼
GENERATE ADAPTATION
      │
      ▼
REVIEW CHANGES
      │
      ├── Accept
      ├── Reject
      └── Edit
      │
      ▼
LATEX EDITOR
      │
      ▼
LOCAL COMPILATION
      │
      ▼
PDF
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Architecture

Jobi runs entirely on your local machine using a modern client-server architecture. 

```text
┌──────────────────────────────────────┐
│              BROWSER                 │
│                                      │
│        Jobi Web Interface            │
│        (React / Vite: 3000)          │
└──────────────────┬───────────────────┘
                   │ HTTP / REST API
                   ▼
┌──────────────────────────────────────┐
│          JOBI LOCAL SERVER           │
│         (Express: 3001)              │
│                                      │
│  Resume Processing                   │
│  Job Analysis                        │
│  Matching                            │
│  Adaptation                          │
│  File Management                     │
│  LaTeX Compilation                   │
└──────────┬──────────┬──────────┬─────┘
           │          │          │
           ▼          ▼          ▼
       SQLite      Ollama      LaTeX
       Storage     Local AI    Compiler
```

- **Frontend**: React application built with Vite and Tailwind CSS.
- **Backend**: Express (Node.js) server orchestrating the local logic.
- **Database**: Local SQLite instance for persistent storage.
- **AI**: Ollama for local LLM inference.
- **Typesetting**: Native `pdflatex` binary.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Requirements

### Required
- **OS**: Windows, macOS, or Linux
- **Node.js**: v18 or higher
- **Git**: For cloning the repository

### Optional (Recommended)
- **Ollama**: For AI-powered bullet adaptation.
- **LaTeX Compiler**: For generating physical `.pdf` files.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Installation

### Step 1 — Clone the repository

```bash
git clone https://github.com/iamnih4l/JOBI.git
cd JOBI
```

### Step 2 — Install dependencies

The setup script automatically installs all dependencies for both the frontend and the backend.

```bash
npm run setup
```

### Step 3 — Configure the local environment

*(Optional)* By default, Jobi runs flawlessly without configuration. If you need to change ports or point to a remote Ollama instance, create a `.env` file in the server directory:

```bash
cd resume-adapt/server
cp .env.example .env
```

| Variable | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| `PORT` | No | `3001` | The port the Express backend runs on. |
| `OLLAMA_URL` | No | `http://127.0.0.1:11434` | The endpoint for your Ollama instance. |

Values remain completely local to your machine.

### Step 4 — Install Ollama (Optional)

Jobi utilizes Ollama to rewrite and adapt your resume bullets.

1. Install [Ollama](https://ollama.ai).
2. Verify installation:
   ```bash
   ollama --version
   ```
3. Download the recommended model (Jobi defaults to `llama3.1`):
   ```bash
   ollama run llama3.1
   ```

*Note: If Ollama is unavailable, Jobi falls back to deterministic heuristic parsing and matching.*

### Step 5 — Install LaTeX (Optional)

To compile your adapted resume into a PDF, Jobi requires a local LaTeX distribution. 

> **Note:** *LaTeX not found on PATH. You can still write, edit, and preview resumes. To compile real PDFs locally, install [MiKTeX](https://miktex.org/) (Windows) or TeX Live.*

- **Windows**: Install [MiKTeX](https://miktex.org/download) or TeX Live.
- **macOS**: `brew install --cask mactex`
- **Linux (Ubuntu/Debian)**: `sudo apt-get update && sudo apt-get install texlive-latex-base texlive-latex-extra`

Verify it is on your PATH:
```bash
pdflatex --version
```

### Step 6 — Run Diagnostics

Ensure your environment is healthy before starting:

```bash
npm run doctor
```

Expect output similar to:
```text
✓ Node.js: v23.0.0 (Supported)
✓ Architecture: Local-First Web Application
✓ SQLite Persistence: READY
✓ LaTeX Compiler: DETECTED (pdfTeX)
✓ Local AI (Ollama): CONNECTED at http://127.0.0.1:11434
```

### Step 7 — Start Jobi

Start both the client and server concurrently:

```bash
npm run dev
```

**Open your browser to: [http://localhost:3000](http://localhost:3000)**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## First Run

1. **Open Jobi**: Navigate to `http://localhost:3000`.
2. **Import Master Resume**: Upload your existing `.tex` or `.pdf` resume.
3. **Add Job Description**: Paste the text of the job you are targeting.
4. **Analyze**: Jobi will extract required skills, keywords, and tone.
5. **Match**: The engine matches your existing resume experience against the requirements.
6. **Adapt**: Trigger the local LLM to rewrite your bullet points to emphasize relevant skills.
7. **Review Changes**: Inspect every proposed change. Accept, reject, or manually edit modifications.
8. **Compile**: Preview your `.pdf` right in the browser.
9. **Export**: Download the final `.tex` source and the `.pdf` binary.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Local AI

Jobi guarantees air-gapped inference by connecting directly to Ollama. 

```text
                 Jobi
                  │
        ┌─────────┴─────────┐
        │                   │
 Deterministic          Local AI
 Processing             via Ollama
        │                   │
        │              llama3.1
        │                   │
        └─────────┬─────────┘
                  ▼
             Final Result
```

- **Deterministic**: ATS scoring, keyword extraction, and file management run natively in Node.js.
- **Local AI**: Complex bullet rewriting and semantic alignment are sent to your local Ollama server.
- **Fallback**: If Ollama crashes or is uninstalled, Jobi gracefully continues functioning without AI rewriting.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Privacy

```text
YOUR COMPUTER
────────────────────────────────────
 Master Resume
 Job Description
 SQLite Database
 Jobi Express Server
 Ollama Inference
 LaTeX Compilation
────────────────────────────────────
             NO CLOUD
```

Your career history is personal. Jobi processes and persists all data locally. There are no telemetry endpoints, no analytics tracking, no cloud database syncing, and no API keys required.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Project Structure

```text
JOBI/
├── README.md                 # You are here
├── package.json              # Root setup commands
└── resume-adapt/             # The core application
    ├── src/                  # React Frontend (Vite)
    ├── server/               # Express Backend
    │   ├── db.js             # SQLite Database Initialization
    │   ├── index.js          # API Server Entry
    │   └── routes/           # API endpoints
    ├── scripts/              # Diagnostics and setup
    ├── resume_adapt.db       # Local SQLite Database (auto-generated)
    └── package.json          # App dependencies
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Configuration

Jobi's backend can be configured via `resume-adapt/server/.env`:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PORT` | `3001` | The backend Express API port. |
| `OLLAMA_URL` | `http://127.0.0.1:11434` | Target endpoint for local LLM requests. |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Troubleshooting

<details>
<summary><strong>Jobi won't start</strong></summary>

Ensure you have run `npm run setup` in the root directory and you are using Node.js v18+.
</details>

<details>
<summary><strong>Port already in use</strong></summary>

If port 3000 or 3001 is occupied, kill the blocking process, or change the `PORT` in the `.env` file and update `vite.config.ts`.
</details>

<details>
<summary><strong>Ollama unavailable / Model missing</strong></summary>

If `npm run doctor` warns about Ollama, ensure the Ollama app is running on your machine. You must pull the model manually at least once by running `ollama run llama3.1` in your terminal.
</details>

<details>
<summary><strong>LaTeX compiler missing or PDF compilation fails</strong></summary>

Jobi looks for `pdflatex` in your system `PATH`. Restart your terminal or computer after installing MiKTeX or MacTeX. If compilation fails, ensure your `.tex` file doesn't require packages missing from your local distribution.
</details>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Development

Want to modify Jobi?

```bash
# Start dev servers (Vite on 3000, Express on 3001)
npm run dev
```

- **Frontend changes**: HMR is handled by Vite. Modify files in `resume-adapt/src`.
- **Backend changes**: Restart the server manually when modifying files in `resume-adapt/server`.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Testing

Testing is currently handled via manual verification workflows:

1. Import a test resume.
2. Add a dummy job description.
3. Analyze and trigger an adaptation.
4. Verify LaTeX compilation succeeds and PDF is correctly output.

Run `npm run doctor` to ensure the local environment is sound before testing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Security

Jobi relies heavily on isolated system execution:
- **Subprocess Execution**: LaTeX compilation is strictly isolated using temporary directories.
- **Path Traversal Prevention**: Strict sanitization prevents directory climbing during file reads/writes.
- **Local-Only Processing**: No outbound connections are initiated by the server. 
- **File Validation**: Upload limits (`20mb`) are strictly enforced.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Contributing

Small improvements are welcome. Please keep Jobi local-first, privacy-conscious, and honest about user experience.

1. Fork the repository
2. Clone locally
3. Install dependencies (`npm run setup`)
4. Create a feature branch (`git checkout -b feature/amazing-feature`)
5. Make your changes and test them
6. Commit (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## License

Jobi is open-source software licensed under the [MIT License](LICENSE).
