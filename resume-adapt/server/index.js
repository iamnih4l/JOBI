const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Route handlers
const systemRoutes = require('./routes/system');
const jobRoutes = require('./routes/job');
const resumeRoutes = require('./routes/resume');
const latexRoutes = require('./routes/latex');
const ollamaRoutes = require('./routes/ollama');

app.use('/api/system', systemRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/latex', latexRoutes);
app.use('/api/ollama', ollamaRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '2.4.0',
    app: 'Jobi Local-First Web Server',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend in production if built (Express 5 compatible wildcard fallback)
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

const server = app.listen(port, () => {
  console.log(`==================================================`);
  console.log(`⚡ Jobi Local Web Server running on port ${port}`);
  console.log(`🌐 API Ready at http://localhost:${port}/api`);
  console.log(`==================================================`);
});

module.exports = { app, server };
