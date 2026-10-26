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
import { ErrorFixerEngine } from './extension/src/autofix/errorFixerEngine.js';
import { BlueGhostCompletionEngine } from './extension/src/ghostText/blueGhostEngine.js';
import { CPP_STANDARD_HEADERS, POPULAR_CPP_LIBRARIES } from './extension/src/knowledge/cppLibraries.js';
import { RUST_STANDARD_MODULES, POPULAR_RUST_CRATES } from './extension/src/knowledge/rustLibraries.js';
import { execSync } from 'child_process';

const app = express();
app.use(express.json());

const PORT = 3000;

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

// 1. Gemini AI Proxy Endpoint with Optional Search Grounding for Live Web Documentation Search
app.post('/api/gemini/generate', async (req, res) => {
  const { prompt, systemInstruction, codeContext, language, model, temperature, enableSearchGrounding } = req.body;
  const customApiKey = req.headers['x-gemini-api-key'] as string;

  const ai = getAiClient(customApiKey);
  if (!ai) {
    return res.status(400).json({ error: 'Gemini API key is not configured.' });
  }

  const modelName = model || 'gemini-3.8-flash';

  try {
    const fullPrompt = codeContext ? `Context:\n${codeContext}\n\nTask:\n${prompt}` : prompt;
    
    const config: any = {
      systemInstruction: systemInstruction || 'You are RIPOSTE, an expert software compiler and C/C++ / Rust engineering AI assistant with deep knowledge of all libraries.',
      temperature: temperature ?? 0.2
    };

    if (enableSearchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: fullPrompt,
      config
    });

    const outputText = response.text || '';
    return res.json({ success: true, text: outputText, modelUsed: modelName });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to call Gemini API' });
  }
});

// 2. Auto-Fix Diagnostic Errors Endpoint for C, C++, and Rust
app.post('/api/autofix/analyze', (req, res) => {
  const { documentText, filePath, diagnostics } = req.body;
  if (!documentText || !filePath || !diagnostics) {
    return res.status(400).json({ error: 'Missing documentText, filePath, or diagnostics' });
  }

  const fixes = ErrorFixerEngine.analyzeAndFixDocument(documentText, filePath, diagnostics);
  return res.json({ success: true, fixesCount: fixes.length, fixes });
});

// 3. Blue Ghost Text Completion Endpoint
app.post('/api/ghost/blue-completion', async (req, res) => {
  const { prefix, suffix, languageId } = req.body;
  const ai = getAiClient();
  const engine = new BlueGhostCompletionEngine(ai as any);
  const result = await engine.generateBlueCompletion(prefix || '', suffix || '', languageId || 'cpp');
  return res.json(result);
});

// 4. Library Knowledge Search Endpoint (C, C++, Rust)
app.get('/api/libraries/search', (req, res) => {
  const query = ((req.query.q as string) || '').toLowerCase();

  const cppHeaders = CPP_STANDARD_HEADERS.filter(
    h => h.header.toLowerCase().includes(query) || h.description.toLowerCase().includes(query) || h.symbols.some(s => s.toLowerCase().includes(query))
  );

  const cppLibs = POPULAR_CPP_LIBRARIES.filter(
    l => l.name.toLowerCase().includes(query) || l.desc.toLowerCase().includes(query) || l.headers.some(h => h.toLowerCase().includes(query))
  );

  const rustModules = RUST_STANDARD_MODULES.filter(
    m => m.path.toLowerCase().includes(query) || m.desc.toLowerCase().includes(query) || m.symbols.some(s => s.toLowerCase().includes(query))
  );

  const rustCrates = POPULAR_RUST_CRATES.filter(
    c => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query) || c.modules.some(m => m.toLowerCase().includes(query))
  );

  return res.json({
    cppHeaders,
    cppLibs,
    rustModules,
    rustCrates
  });
});

// 5. Connectivity Test
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

    return res.json({ connected: true, text: response.text, modelUsed: 'gemini-3.8-flash' });
  } catch (err: any) {
    return res.json({ connected: false, message: err?.message || 'Connection failed' });
  }
});

// 6. Environment Diagnostics Endpoint
app.get('/api/diagnostics/toolchain', (req, res) => {
  const report = TermuxDetector.detectEnvironment();
  return res.json(report);
});

// 7. Compiler Sandbox
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

// 8. VSIX Download & Info
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
