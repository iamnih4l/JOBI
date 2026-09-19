const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'resume_adapt.db');

let dbInstance = null;
let dbType = 'none';

// Attempt 1: Node.js built-in node:sqlite (Node 22.5+, 23+)
try {
  const { DatabaseSync } = require('node:sqlite');
  dbInstance = new DatabaseSync(dbPath);
  dbType = 'node:sqlite';
  console.log('[DB] Connected using Node.js built-in node:sqlite at', dbPath);
} catch (e1) {
  // Attempt 2: better-sqlite3 (only if not on Node 23+ where native addon ABI crashes)
  const isNode23Plus = parseInt(process.versions.node.split('.')[0], 10) >= 23;
  if (!isNode23Plus) {
    try {
      const Database = require('better-sqlite3');
      dbInstance = new Database(dbPath);
      dbType = 'better-sqlite3';
      console.log('[DB] Connected using better-sqlite3 at', dbPath);
    } catch (e2) {
      console.warn('[DB] SQLite native engines unavailable, falling back to local JSON store.');
    }
  }
}

// Fallback JSON-backed storage engine if native SQLite fails
class JsonStoreFallback {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = {
      master_resumes: [],
      job_targets: [],
      adapted_versions: [],
      settings: []
    };
    if (fs.existsSync(filePath)) {
      try {
        this.data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (err) {
        console.error('Failed reading existing json store, initializing fresh:', err);
      }
    }
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed saving json store:', err);
    }
  }

  exec(sql) {
    // No-op for CREATE TABLE in JSON fallback
    return;
  }

  prepare(sql) {
    const self = this;
    const lower = sql.toLowerCase().trim();

    return {
      run(...params) {
        if (lower.startsWith('insert into master_resumes')) {
          const id = self.data.master_resumes.length + 1;
          const [title, raw_latex, parsed_json] = params;
          const row = { id, title, raw_latex, parsed_json, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
          self.data.master_resumes.push(row);
          self.save();
          return { lastInsertRowid: id, changes: 1 };
        }
        if (lower.startsWith('update master_resumes')) {
          const [title, raw_latex, parsed_json, id] = params;
          const row = self.data.master_resumes.find(r => r.id === Number(id));
          if (row) {
            row.title = title;
            row.raw_latex = raw_latex;
            row.parsed_json = parsed_json;
            row.updated_at = new Date().toISOString();
            self.save();
            return { changes: 1 };
          }
          return { changes: 0 };
        }
        if (lower.startsWith('insert into job_targets')) {
          const id = self.data.job_targets.length + 1;
          const [title, company, raw_text, required_skills] = params;
          const row = { id, title, company, raw_text, required_skills, created_at: new Date().toISOString() };
          self.data.job_targets.push(row);
          self.save();
          return { lastInsertRowid: id, changes: 1 };
        }
        if (lower.startsWith('insert into adapted_versions')) {
          const id = self.data.adapted_versions.length + 1;
          const [master_id, job_id, version_name, latex_content, diff_summary, match_score] = params;
          const row = { id, master_id, job_id, version_name, latex_content, diff_summary, match_score, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
          self.data.adapted_versions.push(row);
          self.save();
          return { lastInsertRowid: id, changes: 1 };
        }
        if (lower.startsWith('insert or replace into settings')) {
          const [key, value] = params;
          const idx = self.data.settings.findIndex(s => s.key === key);
          if (idx >= 0) self.data.settings[idx].value = value;
          else self.data.settings.push({ key, value });
          self.save();
          return { changes: 1 };
        }
        return { changes: 0 };
      },

      get(...params) {
        if (lower.includes('from master_resumes') && lower.includes('where id =')) {
          return self.data.master_resumes.find(r => r.id === Number(params[0])) || null;
        }
        if (lower.includes('from master_resumes') && lower.includes('limit 1')) {
          return self.data.master_resumes[0] || null;
        }
        if (lower.includes('from job_targets') && lower.includes('where id =')) {
          return self.data.job_targets.find(r => r.id === Number(params[0])) || null;
        }
        if (lower.includes('from settings') && lower.includes('where key =')) {
          return self.data.settings.find(s => s.key === params[0]) || null;
        }
        if (lower.includes('from adapted_versions') && lower.includes('where id =')) {
          return self.data.adapted_versions.find(r => r.id === Number(params[0])) || null;
        }
        return null;
      },

      all(...params) {
        if (lower.includes('from master_resumes')) {
          return [...self.data.master_resumes];
        }
        if (lower.includes('from job_targets')) {
          return [...self.data.job_targets];
        }
        if (lower.includes('from adapted_versions')) {
          if (params.length > 0 && lower.includes('where job_id =')) {
            return self.data.adapted_versions.filter(v => v.job_id === Number(params[0]));
          }
          return [...self.data.adapted_versions];
        }
        if (lower.includes('from settings')) {
          return [...self.data.settings];
        }
        return [];
      }
    };
  }
}

if (!dbInstance) {
  const jsonPath = path.join(__dirname, '..', 'resume_adapt_store.json');
  dbInstance = new JsonStoreFallback(jsonPath);
  dbType = 'json-fallback';
  console.log('[DB] Initialized JSON persistence store at', jsonPath);
}

// Initialize tables
dbInstance.exec(`
  CREATE TABLE IF NOT EXISTS master_resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    raw_latex TEXT NOT NULL,
    parsed_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

dbInstance.exec(`
  CREATE TABLE IF NOT EXISTS job_targets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    raw_text TEXT NOT NULL,
    required_skills TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

dbInstance.exec(`
  CREATE TABLE IF NOT EXISTS adapted_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    master_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    version_name TEXT NOT NULL,
    latex_content TEXT NOT NULL,
    diff_summary TEXT,
    match_score INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

dbInstance.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Default LaTeX Master Resume template (Anonymized User Template)
const DEFAULT_MASTER_LATEX = `\\documentclass[11pt, a4paper]{article}

% --- PACKAGES & GEOMETRY ---
% Aggressively tightened margins to force a single-page layout
\\usepackage[a4paper, top=0.5cm, bottom=0.5cm, left=0.6cm, right=0.6cm]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{helvet}
\\renewcommand{\\familydefault}{\\sfdefault}

\\usepackage{enumitem}
% Tightened list spacing to save vertical space
\\setlist[itemize]{label=-, leftmargin=*, nosep, itemsep=0pt, parsep=0pt, topsep=1pt}

\\usepackage{titlesec}
\\usepackage{tabularx}
\\usepackage[dvipsnames]{xcolor}
\\usepackage{hyperref}

\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    filecolor=black,
    urlcolor=black,
}

% --- CUSTOM COMMANDS ---
% Reduced spacing around section headers
\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0pt}{}[\\vspace{1pt}\\titlerule\\vspace{3pt}]
\\titlespacing{\\section}{0pt}{4pt}{2pt} 

\\newcommand{\\resumeItem}[1]{\\item \\small{#1}}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{1pt}\\noindent
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{#2} \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-4pt}
}
\\newcommand{\\resumeProjectHeading}[2]{
  \\vspace{1pt}\\noindent
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{#2} \\\\
    \\end{tabular*}\\vspace{-4pt}
}

\\setlength{\\tabcolsep}{0in}

\\begin{document}

% --- HEADER ---
\\begin{center}
    {\\Huge \\textbf{Jane Doe}} \\\\ \\vspace{2pt}
    \\small 
    Software Engineer \\\\ \\vspace{2pt}
    \\href{mailto:jane.doe@example.com}{jane.doe@example.com} $\\cdot$ +1 555-0100 $\\cdot$ San Francisco, CA \\\\ \\vspace{2pt}
    \\href{https://linkedin.com/in/janedoe}{linkedin.com/in/janedoe} $\\cdot$ 
    \\href{https://github.com/janedoe}{github.com/janedoe} $\\cdot$
    \\href{https://janedoe.dev}{janedoe.dev}
\\end{center}

% --- PROFESSIONAL SUMMARY ---
\\section{Professional Summary}
\\small{Results-driven Software Engineer with experience in building scalable backend services and distributed systems. Proficient in cloud architecture and optimizing data pipelines. Passionate about applying modern software engineering principles to solve complex, high-impact problems.}

% --- EDUCATION ---
\\section{Education}
\\begin{itemize}[leftmargin=0in, label={}]
    \\resumeSubheading
      {State University of Technology}{Sep 2020 -- Jun 2024}
      {Bachelor of Science in Computer Science}{San Francisco, CA}
      \\begin{itemize}
        \\resumeItem{\\textbf{Involvement:} President of the Computer Science Society, Open Source Club.}
      \\end{itemize}
\\end{itemize}

% --- SKILLS ---
\\section{Technical Expertise}
\\begin{itemize}[leftmargin=0in, label={}]
    \\item \\textbf{Languages:} Python, Java, C++, TypeScript, SQL, Bash
    \\item \\textbf{Frameworks \\& Libraries:} React, Node.js, Spring Boot, PyTorch, TensorFlow
    \\item \\textbf{Backend \\& Systems:} REST API Development, Distributed Architecture, Vector Databases
    \\item \\textbf{Developer Tools:} Git, Docker, Kubernetes, AWS, GCP, CI/CD
\\end{itemize}

% --- ENGINEERING PROJECTS ---
\\section{Engineering \\& Projects}
\\begin{itemize}[leftmargin=0in, label={}]

    \\resumeProjectHeading
      {Distributed Task Scheduler $|$ \\normalfont\\textit{Go, gRPC, Redis, Docker}}{2024}
      \\begin{itemize}
        \\resumeItem{Architected a scalable, distributed task scheduling system capable of processing 10,000+ jobs per second across multiple worker nodes.}
        \\resumeItem{Implemented a fault-tolerant message queue using Redis streams to guarantee at-least-once delivery semantics for critical backend workflows.}
      \\end{itemize}

    \\resumeProjectHeading
      {Real-time Analytics Dashboard $|$ \\normalfont\\textit{React, TypeScript, WebSockets, Node.js}}{2023}
      \\begin{itemize}
        \\resumeItem{Built a high-performance analytics dashboard supporting live data visualization of streaming metrics with sub-second latency.}
        \\resumeItem{Optimized React rendering cycles and implemented virtualization to smoothly display thousands of concurrent data points without UI blocking.}
      \\end{itemize}

\\end{itemize}

% --- PROFESSIONAL EXPERIENCE ---
\\section{Professional Experience}
\\begin{itemize}[leftmargin=0in, label={}]

    \\resumeSubheading
      {Software Engineering Intern}{Jun 2023 -- Aug 2023}
      {Tech Innovations Inc.}{San Francisco, CA}
      \\begin{itemize}
        \\resumeItem{Developed and deployed microservices in Go, reducing legacy system processing times by 40\\% through concurrent execution.}
        \\resumeItem{Collaborated closely with cross-functional teams to integrate new RESTful endpoints into the primary customer-facing application.}
      \\end{itemize}

    \\resumeSubheading
      {Backend Developer (Freelance)}{Jan 2022 -- Dec 2022}
      {Global Solutions}{Remote}
      \\begin{itemize}
        \\resumeItem{Automated digital workflows to streamline asset scheduling and deployment, optimizing content delivery pipelines for 50+ clients.}
        \\resumeItem{Analyzed system performance metrics to enhance database queries, resulting in a 25\\% reduction in API response times.}
      \\end{itemize}

\\end{itemize}

% --- CERTIFICATIONS & PROGRAMS ---
\\section{Certifications \\& Job Simulations}
\\begin{itemize}[leftmargin=0in, label={}]
    \\item \\textbf{Certifications:} AWS Certified Developer Associate $\\cdot$ Google Cloud Professional Cloud Architect
    \\item \\textbf{Simulations:} JPMorgan Chase \\& Co. (Software Engineering) $\\cdot$ Electronic Arts (Data Structures)
\\end{itemize}

\\enlargethispage{1.5cm}
\\end{document}`;

// Seed default records if empty
try {
  const existingMaster = dbInstance.prepare('SELECT id FROM master_resumes LIMIT 1').get();
  if (!existingMaster) {
    console.log('[DB] Seeding default master resume...');
    dbInstance.prepare(`
      INSERT INTO master_resumes (title, raw_latex, parsed_json)
      VALUES (?, ?, ?)
    `).run(
      'Jane Doe — Master Profile',
      DEFAULT_MASTER_LATEX,
      JSON.stringify({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        github: 'github.com/janedoe',
        skills: ['python', 'java', 'c++', 'typescript', 'react', 'node.js', 'go', 'docker', 'kubernetes', 'aws']
      })
    );
  }

  const existingJob = dbInstance.prepare('SELECT id FROM job_targets LIMIT 1').get();
  if (!existingJob) {
    console.log('[DB] Seeding default job target...');
    dbInstance.prepare(`
      INSERT INTO job_targets (title, company, raw_text, required_skills)
      VALUES (?, ?, ?, ?)
    `).run(
      'Staff ML Engineer',
      'Anthropic',
      'Anthropic is seeking a Staff ML Engineer to build low-latency distributed inference systems for frontier AI models. Key requirements: expertise in multi-node clusters, vLLM, custom CUDA kernels, PyTorch, Triton, and low-latency C++ tensor streaming.',
      JSON.stringify(['pytorch', 'vllm', 'cuda', 'triton', 'c++', 'distributed inference', 'low latency', 'nccl'])
    );
  }
} catch (seedErr) {
  console.error('[DB] Seeding notice:', seedErr.message);
}

module.exports = {
  db: dbInstance,
  dbType
};
