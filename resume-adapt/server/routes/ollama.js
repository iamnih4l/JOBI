const express = require('express');
const router = express.Router();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';

// Check if Ollama is running
router.get('/status', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(OLLAMA_URL, { signal: controller.signal });
    clearTimeout(timeout);
    res.json(response.ok);
  } catch (error) {
    res.json(false);
  }
});

// Get local models
router.get('/models', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const response = await fetch(`${OLLAMA_URL}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const models = data.models ? data.models.map(m => m.name) : [];
      res.json(models);
    } else {
      res.status(500).json({ error: 'Failed to fetch models' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper to escape LaTeX special characters and fix common LLM formatting errors
function sanitizeLatex(text) {
  if (!text) return text;
  
  let cleaned = text.trim();
  
  // Remove \resumeItem{...} wrapper if the LLM hallucinated it
  if (cleaned.startsWith('\\resumeItem{')) {
    cleaned = cleaned.substring('\\resumeItem{'.length);
    if (cleaned.endsWith('}')) {
      cleaned = cleaned.substring(0, cleaned.length - 1);
    }
  }

  // Remove \item if added
  if (cleaned.startsWith('\\item')) {
    cleaned = cleaned.replace(/^\\item\s*/, '');
  }
  
  // Balance braces (if the model forgot a closing brace for \textbf etc)
  let openBraces = (cleaned.match(/\{/g) || []).length;
  let closeBraces = (cleaned.match(/\}/g) || []).length;
  if (openBraces > closeBraces) {
    cleaned += '}'.repeat(openBraces - closeBraces);
  }
  
  return cleaned
    .replace(/(?<!\\)&/g, '\\&')
    .replace(/(?<!\\)%/g, '\\%');
}

// Deterministic fallback bullet adaptation if Ollama is offline
function deterministicAdaptBullet(originalBullet, jobDescription) {
  const jdLower = jobDescription.toLowerCase();
  const keywords = [];
  const candidates = ['vllm', 'cuda', 'low-latency', 'distributed inference', 'pytorch', 'triton', 'nccl'];

  for (const c of candidates) {
    if (jdLower.includes(c)) keywords.push(c);
  }

  let adapted = originalBullet;
  if (keywords.length > 0 && !originalBullet.toLowerCase().includes(keywords[0])) {
    adapted = originalBullet.replace(/([a-zA-Z\s]+:)/, `$1 Optimized for ${keywords.slice(0, 2).join(' \\& ')}.`);
  }

  return {
    adapted,
    rationale: `Heuristic match: aligned with target keywords (${keywords.slice(0, 3).join(', ')}).`,
    keywords: keywords.slice(0, 3),
    aiUsed: false
  };
}

// POST /api/ollama/adapt
router.post('/adapt', async (req, res) => {
  const { originalBullet, jobDescription, model } = req.body;

  if (!originalBullet) {
    return res.status(400).json({ success: false, error: 'originalBullet is required' });
  }

  const selectedModel = model || 'llama3.1:latest';

  const systemPrompt = `You are Jobi, an air-gapped local-first resume adaptation assistant.
Your goal is to rewrite a single resume bullet point to strongly align with the provided target job description.
CRITICAL RULES:
1. Retain all truthful facts, metrics, and core achievements. Never hallucinate fake degrees, fake companies, or fake metrics.
2. Emphasize matching skills and terminology from the job description.
3. Keep valid LaTeX formatting (e.g. \\textbf{...}).
4. Output strictly valid JSON with the following schema:
{
  "adapted": "Rewritten bullet point string with valid LaTeX formatting",
  "rationale": "One-sentence explanation of what was modified and why",
  "keywords": ["keyword1", "keyword2"]
}`;

  const userPrompt = `TARGET JOB DESCRIPTION:
${jobDescription || 'Standard high-performance software engineering role'}

ORIGINAL RESUME BULLET:
${originalBullet}

Respond ONLY with the JSON object.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 300000); // 5 minute timeout for queued local inference

    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: selectedModel,
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.2
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama returned status ${ollamaResponse.status}`);
    }

    const data = await ollamaResponse.json();
    let parsed;
    try {
      parsed = JSON.parse(data.response);
    } catch (parseErr) {
      // Clean up backticks or markdown wrap if any
      const cleaned = data.response.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      adapted: sanitizeLatex(parsed.adapted || originalBullet),
      rationale: parsed.rationale || 'Tailored to target job description using local Ollama model.',
      keywords: parsed.keywords || [],
      aiUsed: true,
      modelUsed: selectedModel
    });
  } catch (err) {
    console.warn(`Local Ollama adaptation fell back to deterministic engine: ${err.message}`);
    const fallback = deterministicAdaptBullet(originalBullet, jobDescription || '');
    if (fallback.adapted) {
      fallback.adapted = sanitizeLatex(fallback.adapted);
    }
    return res.json({
      success: true,
      ...fallback,
      notice: 'Ollama local inference unavailable. Generated using deterministic local heuristics.'
    });
  }
});

module.exports = router;
