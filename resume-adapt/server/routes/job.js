const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Heuristic keyword database for deterministic extraction
const KNOWN_KEYWORDS = [
  'python', 'c++', 'rust', 'go', 'golang', 'typescript', 'javascript', 'react', 'node.js',
  'pytorch', 'vllm', 'cuda', 'triton', 'tensorrt', 'tensorrt-llm', 'nccl', 'infiniband',
  'distributed training', 'distributed inference', 'low latency', 'docker', 'kubernetes',
  'aws', 'gcp', 'azure', 'slurm', 'linux', 'ebpf', 'sql', 'nosql', 'postgres', 'sqlite',
  'mongodb', 'git', 'ci/cd', 'transformers', 'huggingface', 'rag', 'embeddings', 'onnx',
  'api design', 'system design', 'machine learning', 'deep learning', 'nlp', 'computer vision'
];

function extractKeywords(text) {
  const lower = text.toLowerCase();
  const matched = new Set();
  for (const kw of KNOWN_KEYWORDS) {
    if (lower.includes(kw)) {
      matched.add(kw);
    }
  }
  return Array.from(matched);
}

// POST /api/job/analyze
router.post('/analyze', (req, res) => {
  try {
    const { title, company, text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, error: 'Job description text is required' });
    }

    const jobTitle = title && title.trim() ? title.trim() : 'Software Engineer';
    const companyName = company && company.trim() ? company.trim() : 'Target Company';
    const skills = extractKeywords(text);

    const insertStmt = db.prepare(`
      INSERT INTO job_targets (title, company, raw_text, required_skills)
      VALUES (?, ?, ?, ?)
    `);

    const result = insertStmt.run(jobTitle, companyName, text, JSON.stringify(skills));
    const newId = result.lastInsertRowid;

    const savedJob = db.prepare('SELECT * FROM job_targets WHERE id = ?').get(newId);

    res.json({
      success: true,
      job: {
        ...savedJob,
        required_skills: skills
      }
    });
  } catch (err) {
    console.error('Job analysis error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/job/list
router.get('/list', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM job_targets ORDER BY id DESC').all();
    const jobs = rows.map(r => ({
      ...r,
      required_skills: typeof r.required_skills === 'string' ? JSON.parse(r.required_skills) : (r.required_skills || [])
    }));
    res.json({ success: true, jobs });
  } catch (err) {
    console.error('Job listing error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/job/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM job_targets WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(400).json({ success: false, error: 'Job target not found' });
    }
    row.required_skills = typeof row.required_skills === 'string' ? JSON.parse(row.required_skills) : (row.required_skills || []);
    res.json({ success: true, job: row });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

