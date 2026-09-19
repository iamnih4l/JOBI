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

// Default LaTeX Master Resume template (Anthropic-optimized Dr. Ethan Vance from Jobi design)
const DEFAULT_MASTER_LATEX = `\\documentclass[letterpaper,10pt]{article}
\\usepackage{latexsym,fullpage,hyperref,titlesec}
% ------------------ JOBI MASTER RESUME ------------------
\\begin{document}
\\heading{Dr. Ethan Vance}{ethan@vance.ai}{github.com/evance-ml}

\\section{Work Experience}
\\resumeSubheading
    {Senior Systems Engineer}{2022 -- Present}
    {Autonomous AI Lab}{San Francisco, CA}
\\resumeItemListStart
  \\resumeItem{\\textbf{Distributed Inference:} Optimized multi-node vLLM cluster serving 70B parameter models, reducing p99 latency from 140ms to 32ms using custom CUDA kernels.}
  \\resumeItem{\\textbf{Local Architecture:} Architected air-gapped evaluation pipeline eliminating external API calls while preserving deterministic benchmark scoring.}
  \\resumeItem{Implemented pipeline-parallel tensor partitioning over InfiniBand fabric across 64x H100 GPUs.}
\\resumeItemListEnd

\\resumeSubheading
    {Distributed Systems Lead}{2020 -- 2022}
    {Nexus Tensor Core}{Redwood City, CA}
\\resumeItemListStart
  \\resumeItem{Engineered zero-copy streaming protocols in C++ & Rust for continuous token delivery.}
  \\resumeItem{Reduced cold-start VM orchestration overhead by 68% via pre-allocated GPU unified memory.}
\\resumeItemListEnd

\\section{Key Technical Artifacts}
\\resumeSubheading{Flash-Attention Kernel Port}{PyTorch / Triton}{}{}
  \\resumeItem{Synthesized memory-fused backward pass yielding 1.34x compute throughput on Hopper SM90.}

\\section{Core Skills & Competencies}
\\resumeItem{Languages & Frameworks: PyTorch, vLLM, CUDA, Triton, TensorRT-LLM, NCCL, C++, Rust, Python, Docker, Kubernetes.}
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
      'Dr. Ethan Vance — Master Profile',
      DEFAULT_MASTER_LATEX,
      JSON.stringify({
        name: 'Dr. Ethan Vance',
        email: 'ethan@vance.ai',
        github: 'github.com/evance-ml',
        skills: ['pytorch', 'vllm', 'cuda', 'triton', 'c++', 'rust', 'python', 'docker', 'kubernetes', 'infiniband']
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
