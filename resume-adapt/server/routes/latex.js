const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const crypto = require('crypto');

// Ensure builds cache directory exists
const buildsDir = path.join(__dirname, '..', 'builds');
if (!fs.existsSync(buildsDir)) {
  fs.mkdirSync(buildsDir, { recursive: true });
}

// POST /api/latex/compile
router.post('/compile', (req, res) => {
  const { latexStr } = req.body;
  if (!latexStr || typeof latexStr !== 'string' || latexStr.trim() === '') {
    return res.status(400).json({ success: false, error: 'latexStr is required' });
  }

  // Create isolated temp workspace
  const buildId = crypto.randomUUID();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `jobi-latex-${buildId}-`));
  const texFile = path.join(tempDir, 'resume.tex');

  try {
    fs.writeFileSync(texFile, latexStr, 'utf8');
  } catch (writeErr) {
    return res.status(500).json({ success: false, error: 'Failed writing LaTeX source: ' + writeErr.message });
  }

  // Execute pdflatex safely with 15s timeout
  exec('pdflatex -interaction=nonstopmode -halt-on-error resume.tex', { cwd: tempDir, timeout: 15000 }, (error, stdout, stderr) => {
    const pdfPath = path.join(tempDir, 'resume.pdf');
    const logPath = path.join(tempDir, 'resume.log');

    let logContent = '';
    if (fs.existsSync(logPath)) {
      try {
        logContent = fs.readFileSync(logPath, 'utf8');
      } catch (e) {
        logContent = '';
      }
    }

    if (error || !fs.existsSync(pdfPath)) {
      let friendlyError = stderr || stdout || (error ? error.message : 'Unknown LaTeX error');

      // Extract LaTeX error lines from log if available
      if (logContent) {
        const errorLines = logContent.split('\n').filter(line => line.startsWith('!') || line.includes('Error:') || line.startsWith('l.'));
        if (errorLines.length > 0) {
          friendlyError = errorLines.slice(0, 10).join('\n');
        }
      }

      // Check if pdflatex itself is missing
      const isMissing = error && (error.code === 'ENOENT' || error.message.includes('not recognized') || error.message.includes('not found'));

      // Clean up tempDir
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (rmErr) {}

      return res.json({
        success: false,
        compilerMissing: isMissing,
        error: isMissing
          ? 'LaTeX compiler (pdflatex) not found on your system PATH. Please install MiKTeX (Windows) or TeX Live (Mac/Linux).'
          : friendlyError,
        rawLog: logContent.slice(0, 2000)
      });
    }

    // Success: copy PDF to builds directory
    const finalPdfPath = path.join(buildsDir, `${buildId}.pdf`);
    try {
      fs.copyFileSync(pdfPath, finalPdfPath);
      // Clean up tempDir
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (copyErr) {
      console.error('Failed saving compiled PDF:', copyErr);
    }

    return res.json({
      success: true,
      buildId,
      pdfUrl: `/api/latex/preview/${buildId}`,
      output: 'PDF compiled successfully.'
    });
  });
});

// GET /api/latex/preview/:id
router.get('/preview/:id', (req, res) => {
  const buildId = req.params.id;
  // Sanitize buildId to prevent path traversal
  if (!/^[a-zA-Z0-9_-]+$/.test(buildId)) {
    return res.status(400).send('Invalid build ID');
  }

  const pdfPath = path.join(buildsDir, `${buildId}.pdf`);
  if (!fs.existsSync(pdfPath)) {
    return res.status(404).send('PDF build not found or expired.');
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');
  fs.createReadStream(pdfPath).pipe(res);
});

// GET /api/latex/download-pdf/:id
router.get('/download-pdf/:id', (req, res) => {
  const buildId = req.params.id;
  if (!/^[a-zA-Z0-9_-]+$/.test(buildId)) {
    return res.status(400).send('Invalid build ID');
  }

  const pdfPath = path.join(buildsDir, `${buildId}.pdf`);
  if (!fs.existsSync(pdfPath)) {
    return res.status(404).send('PDF build not found.');
  }

  res.download(pdfPath, 'resume.pdf');
});

// POST /api/latex/download-tex
router.post('/download-tex', (req, res) => {
  const { latexStr, filename } = req.body;
  if (!latexStr) {
    return res.status(400).send('No LaTeX content provided');
  }

  const safeFilename = filename ? filename.replace(/[^a-zA-Z0-9_.-]/g, '_') : 'resume.tex';
  res.setHeader('Content-Type', 'application/x-tex; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
  res.send(latexStr);
});

module.exports = router;
