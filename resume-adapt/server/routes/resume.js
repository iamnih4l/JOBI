const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { db } = require('../db');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  }
});

// Helper to determine if text looks like LaTeX
function detectIsLatex(text) {
  return /\\documentclass|\\begin\{document\}|\\section\*?\{/.test(text);
}

// POST /api/resume/upload
router.post('/upload', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No resume file uploaded' });
  }

  const file = req.file;
  let parsedText = '';
  let isLatex = false;

  try {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      const data = await pdfParse(file.buffer);
      parsedText = data.text || '';
      isLatex = false;
    } else {
      parsedText = file.buffer.toString('utf-8');
      isLatex = file.originalname.toLowerCase().endsWith('.tex') || detectIsLatex(parsedText);
    }

    res.json({
      success: true,
      filename: file.originalname,
      text: parsedText,
      isLatex
    });
  } catch (error) {
    console.error('Resume parsing error:', error);
    res.status(500).json({ success: false, error: 'Failed to parse resume: ' + error.message });
  }
});

// GET /api/resume/master
router.get('/master', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM master_resumes ORDER BY id ASC LIMIT 1').get();
    if (!row) {
      return res.json({ success: true, master: null });
    }
    const parsed = row.parsed_json ? (typeof row.parsed_json === 'string' ? JSON.parse(row.parsed_json) : row.parsed_json) : {};
    res.json({
      success: true,
      master: {
        ...row,
        parsed_data: parsed
      }
    });
  } catch (err) {
    console.error('Fetch master resume error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/resume/master (Update or Create Master Resume)
router.post('/master', (req, res) => {
  try {
    const { title, raw_latex, parsed_json } = req.body;
    if (!raw_latex || raw_latex.trim() === '') {
      return res.status(400).json({ success: false, error: 'raw_latex content is required' });
    }

    const masterTitle = title || 'Master Profile';
    const parsedDataStr = typeof parsed_json === 'object' ? JSON.stringify(parsed_json) : (parsed_json || '{}');

    // Check if one exists
    const existing = db.prepare('SELECT id FROM master_resumes ORDER BY id ASC LIMIT 1').get();

    if (existing) {
      db.prepare(`
        UPDATE master_resumes
        SET title = ?, raw_latex = ?, parsed_json = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(masterTitle, raw_latex, parsedDataStr, existing.id);

      const updated = db.prepare('SELECT * FROM master_resumes WHERE id = ?').get(existing.id);
      return res.json({ success: true, master: updated });
    } else {
      const result = db.prepare(`
        INSERT INTO master_resumes (title, raw_latex, parsed_json)
        VALUES (?, ?, ?)
      `).run(masterTitle, raw_latex, parsedDataStr);

      const created = db.prepare('SELECT * FROM master_resumes WHERE id = ?').get(result.lastInsertRowid);
      return res.json({ success: true, master: created });
    }
  } catch (err) {
    console.error('Save master resume error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/resume/versions/:jobId
router.get('/versions/:jobId', (req, res) => {
  try {
    const jobId = Number(req.params.jobId);
    const rows = db.prepare('SELECT * FROM adapted_versions WHERE job_id = ? ORDER BY id DESC').all(jobId);
    const versions = rows.map(r => ({
      ...r,
      diff_summary: r.diff_summary ? (typeof r.diff_summary === 'string' ? JSON.parse(r.diff_summary) : r.diff_summary) : []
    }));
    res.json({ success: true, versions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/resume/version (Create an adapted version without modifying master)
router.post('/version', (req, res) => {
  try {
    const { master_id, job_id, version_name, latex_content, diff_summary, match_score } = req.body;
    if (!latex_content) {
      return res.status(400).json({ success: false, error: 'latex_content is required' });
    }

    const masterId = master_id || 1;
    const jobId = job_id || 1;
    const vName = version_name || `resume_adaptation_${Date.now()}.tex`;
    const diffStr = typeof diff_summary === 'object' ? JSON.stringify(diff_summary) : (diff_summary || '[]');
    const score = Number(match_score) || 0;

    const result = db.prepare(`
      INSERT INTO adapted_versions (master_id, job_id, version_name, latex_content, diff_summary, match_score)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(masterId, jobId, vName, latex_content, diffStr, score);

    const saved = db.prepare('SELECT * FROM adapted_versions WHERE id = ?').get(result.lastInsertRowid);

    res.json({
      success: true,
      version: {
        ...saved,
        diff_summary: typeof diff_summary === 'object' ? diff_summary : JSON.parse(diffStr)
      }
    });
  } catch (err) {
    console.error('Save adapted version error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
