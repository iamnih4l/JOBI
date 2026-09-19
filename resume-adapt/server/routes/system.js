const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const { db, dbType } = require('../db');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';

// GET /api/system/status
router.get('/status', async (req, res) => {
  const result = {
    ollama: {
      connected: false,
      url: OLLAMA_URL,
      models: []
    },
    latex: {
      available: false,
      version: null,
      error: null
    },
    database: {
      ready: false,
      type: dbType
    }
  };

  // 1. Check Database
  try {
    const test = db.prepare('SELECT 1 as test').get();
    if (test && (test.test === 1 || test['1'] === 1)) {
      result.database.ready = true;
    }
  } catch (err) {
    result.database.error = err.message;
  }

  // 2. Check Ollama
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const pingRes = await fetch(OLLAMA_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (pingRes.ok) {
      result.ollama.connected = true;

      const tagsRes = await fetch(`${OLLAMA_URL}/api/tags`);
      if (tagsRes.ok) {
        const data = await tagsRes.json();
        result.ollama.models = data.models ? data.models.map(m => m.name) : [];
      }
    }
  } catch (err) {
    result.ollama.connected = false;
  }

  // 3. Check LaTeX Compiler
  const checkLatex = () => {
    return new Promise((resolve) => {
      exec('pdflatex --version', { timeout: 2500 }, (error, stdout) => {
        if (!error && stdout) {
          const firstLine = stdout.split('\n')[0].trim();
          result.latex.available = true;
          result.latex.version = firstLine;
        } else {
          result.latex.available = false;
          result.latex.error = 'pdflatex not found on PATH. Install MiKTeX or TeX Live for local PDF generation.';
        }
        resolve();
      });
    });
  };

  await checkLatex();

  res.json(result);
});

module.exports = router;

