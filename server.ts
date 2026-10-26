import express from 'express';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { TermuxDetector } from './extension/src/termux/detector.js';
import { CargoManager } from './extension/src/rust/cargo.js';
import { ClangManager } from './extension/src/clang/clangd.js';
import { SecurityRedactor } from './extension/src/security/redactor.js';
import { PatchEngine } from './extension/src/patch/patchEngine.js';
import { execSync } from 'child_process';

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini SDK with User-Agent header telemetry requirement
const getAiClient = (apiKey?: string) => {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// 1. Gemini AI Proxy Endpoint
app.post('/api/gemini/generate', async (req, res) => {
  const { prompt, systemInstruction, codeContext, language, model, temperature } = req.body;
  const customApiKey = req.headers['x-gemini-api-key'] as string;

  const ai = getAiClient(customApiKey);
  if (!ai) {
    return res.status(400).json({ error: 'Gemini API key is not configured.' });
  }

  const modelName = model || 'gemini-3.8-flash';

  try {
    const fullPrompt = codeContext ? `Context:\n${codeContext}\n\nTask:\n${prompt}` : prompt;
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction || 'You are RIPOSTE, an expert software compiler and C/C++ / Rust engineering AI assistant.',
        temperature: temperature ?? 0.2
      }
    });

    const outputText = response.text || '';
    return res.json({ success: true, text: outputText, modelUsed: modelName });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to call Gemini API' });
  }
});

// 2. Gemini Connectivity Test Endpoint
app.get('/api/gemini/test-connection', async (req, res) => {
  const ai = getAiClient();
  if (!ai) {
    return res.json({ connected: false, message: 'GEMINI_API_KEY environment variable is not set.' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Ping test. Reply with PONG.'
    });

    return res.json({
      connected: true,
      text: response.text,
      modelUsed: 'gemini-3.8-flash'
    });
  } catch (err: any) {
    return res.json({
      connected: false,
      message: err?.message || 'Connection failed'
    });
  }
});

// 3. Toolchain & Environment Diagnostics Endpoint
app.get('/api/diagnostics/toolchain', (req, res) => {
  const report = TermuxDetector.detectEnvironment();
  return res.json(report);
});

// 4. Code Execution Sandbox Endpoint (Rust & Clang)
app.post('/api/sandbox/compile', (req, res) => {
  const { language, code } = req.body;
  
  if (language === 'rust') {
    const tempDir = path.join(process.cwd(), 'temp_sandbox_rust');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const file = path.join(tempDir, 'main.rs');
    fs.writeFileSync(file, code, 'utf-8');

    try {
      const out = execSync(`rustc "${file}" -o "${path.join(tempDir, 'main')}"`, { encoding: 'utf-8', timeout: 5000 });
      let runOutput = '';
      if (fs.existsSync(path.join(tempDir, 'main'))) {
        runOutput = execSync(`"${path.join(tempDir, 'main')}"`, { encoding: 'utf-8', timeout: 3000 });
      }
      return res.json({ success: true, compilationOutput: out || 'Compiled successfully', runOutput });
    } catch (err: any) {
      return res.json({ success: false, compilationOutput: err.stderr || err.message, runOutput: '' });
    }
  } else if (language === 'c' || language === 'cpp') {
    const tempDir = path.join(process.cwd(), 'temp_sandbox_cpp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const ext = language === 'c' ? 'c' : 'cpp';
    const compiler = language === 'c' ? 'clang' : 'clang++';
    const file = path.join(tempDir, `main.${ext}`);
    fs.writeFileSync(file, code, 'utf-8');

    try {
      const out = execSync(`${compiler} "${file}" -o "${path.join(tempDir, 'main')}"`, { encoding: 'utf-8', timeout: 5000 });
      let runOutput = '';
      if (fs.existsSync(path.join(tempDir, 'main'))) {
        runOutput = execSync(`"${path.join(tempDir, 'main')}"`, { encoding: 'utf-8', timeout: 3000 });
      }
      return res.json({ success: true, compilationOutput: out || 'Compiled successfully', runOutput });
    } catch (err: any) {
      return res.json({ success: false, compilationOutput: err.stderr || err.message, runOutput: '' });
    }
  }

  return res.status(400).json({ error: 'Unsupported sandbox language' });
});

// 5. VSIX Info & Download Endpoints
app.get('/api/vsix/info', (req, res) => {
  const vsixPath = path.join(process.cwd(), 'riposte-extension-1.0.0.vsix');
  if (!fs.existsSync(vsixPath)) {
    return res.status(404).json({ error: 'VSIX package not found. Run npm run build:extension.' });
  }

  const vsixBuffer = fs.readFileSync(vsixPath);
  const sha256 = crypto.createHash('sha256').update(vsixBuffer).digest('hex');
  
  return res.json({
    fileName: 'riposte-extension-1.0.0.vsix',
    sizeBytes: vsixBuffer.length,
    sha256,
    downloadUrl: '/api/vsix/download'
  });
});

app.get('/api/vsix/download', (req, res) => {
  const vsixPath = path.join(process.cwd(), 'riposte-extension-1.0.0.vsix');
  if (!fs.existsSync(vsixPath)) {
    return res.status(404).send('VSIX package not built.');
  }

  res.setHeader('Content-Type', 'application/vsix');
  res.setHeader('Content-Disposition', 'attachment; filename="riposte-extension-1.0.0.vsix"');
  return res.sendFile(vsixPath);
});

// 6. Test Runner Endpoint
app.post('/api/tests/run', (req, res) => {
  try {
    const out = execSync('npx tsx scripts/run-tests.ts', { encoding: 'utf-8', timeout: 10000 });
    return res.json({ success: true, log: out });
  } catch (err: any) {
    return res.json({ success: false, log: err.stdout || err.stderr || err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 RIPOSTE Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
