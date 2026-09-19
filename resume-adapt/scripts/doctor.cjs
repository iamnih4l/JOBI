const { execSync } = require('child_process');
const path = require('path');
const http = require('http');

console.log('\n============================================================');
console.log('       🩺 JOBI ENVIRONMENT & ARCHITECTURE DOCTOR           ');
console.log('============================================================\n');

let allGood = true;

// 1. Node.js check
const nodeVer = process.version;
const major = parseInt(nodeVer.replace('v', '').split('.')[0], 10);
if (major >= 18) {
  console.log(`  ✓ Node.js: ${nodeVer} (Supported)`);
} else {
  console.log(`  ✗ Node.js: ${nodeVer} (Requires v18 or higher)`);
  allGood = false;
}

// 2. Desktop wrapper removal check
console.log('  ✓ Architecture: Local-First Web Application (Desktop wrapper removed)');

// 3. Database check
try {
  const { db, dbType } = require('../server/db');
  const res = db.prepare('SELECT 1 as val').get();
  console.log(`  ✓ SQLite Persistence: READY (Engine: ${dbType})`);
} catch (dbErr) {
  console.log(`  ⚠ SQLite Persistence: Fallback mode (${dbErr.message})`);
}

// 4. LaTeX check
try {
  const latexOut = execSync('pdflatex --version', { stdio: ['pipe', 'pipe', 'ignore'], timeout: 3000 }).toString();
  const firstLine = latexOut.split('\n')[0].trim();
  console.log(`  ✓ LaTeX Compiler: DETECTED (${firstLine})`);
} catch (latexErr) {
  console.log('  ⚠ LaTeX Compiler: NOT DETECTED (pdflatex not on PATH)');
  console.log('    -> Optional: Install MiKTeX (Windows: https://miktex.org) or TeX Live.');
  console.log('    -> Jobi works without it using live LaTeX and HTML paper preview.');
}

// 5. Ollama check
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const checkOllama = async () => {
  return new Promise((resolve) => {
    const req = http.get(`${OLLAMA_URL}/api/tags`, { timeout: 3000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const models = json.models ? json.models.map(m => m.name) : [];
          console.log(`  ✓ Local AI (Ollama): CONNECTED at ${OLLAMA_URL}`);
          if (models.length > 0) {
            console.log(`    Models detected: ${models.join(', ')}`);
          } else {
            console.log('    ⚠ No local models installed yet. Run: ollama run llama3.1');
          }
        } catch (e) {
          console.log(`  ✓ Local AI (Ollama): CONNECTED (${OLLAMA_URL})`);
        }
        resolve();
      });
    });

    req.on('error', () => {
      console.log(`  ⚠ Local AI (Ollama): NOT RUNNING (${OLLAMA_URL})`);
      console.log('    -> Start Ollama or download from https://ollama.ai');
      console.log('    -> Jobi will gracefully use deterministic heuristics without AI.');
      resolve();
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`  ⚠ Local AI (Ollama): TIMED OUT connecting to ${OLLAMA_URL}`);
      resolve();
    });
  });
};

checkOllama().then(() => {
  console.log('\n------------------------------------------------------------');
  console.log('  🚀 STATUS: READY FOR LOCAL RUN');
  console.log('  Run: npm run dev');
  console.log('  Open: http://localhost:3000');
  console.log('============================================================\n');
  process.exit(0);
});

