import React, { useState } from 'react';
import { Sparkles, Send, ShieldAlert, Code2, Cpu, Check, Copy, FileText, Bug, Wrench, Search, Lightbulb, ExternalLink } from 'lucide-react';

export const GeminiAssistantStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [enableGrounding, setEnableGrounding] = useState(true);
  const [activeMode, setActiveMode] = useState<'autofix' | 'blue_ghost' | 'chat' | 'libraries'>('autofix');

  // Auto-Fixer state
  const [codeToFix, setCodeToFix] = useState(
    '// C++ Missing Header & Semicolon Error Example\nvoid process_data() {\n    std::vector<int> nums = {1, 2, 3}\n    std::string name = "RIPOSTE"\n}'
  );
  const [selectedLang, setSelectedLang] = useState<'cpp' | 'rust'>('cpp');
  const [detectedFixes, setDetectedFixes] = useState<any[]>([]);

  // Blue Ghost Text state
  const [ghostPrefix, setGhostPrefix] = useState('std::vector<int> numbers = {1, 2, 3};');
  const [blueGhostResult, setBlueGhostResult] = useState<any>(null);

  // Library Search state
  const [libQuery, setLibQuery] = useState('vector');
  const [libResults, setLibResults] = useState<any>(null);

  const handleRunAutoFix = async () => {
    setLoading(true);
    setDetectedFixes([]);

    // Sample diagnostics for demo
    const diagnostics = selectedLang === 'cpp'
      ? [
          { message: "use of undeclared identifier 'std::vector'", line: 2 },
          { message: "expected ';' after top level declarator", line: 2 },
          { message: "use of undeclared identifier 'std::string'", line: 3 }
        ]
      : [
          { message: "cannot find type `HashMap` in this scope", line: 2 },
          { message: "use of moved value: `v`", line: 4, code: "E0382" }
        ];

    try {
      const res = await fetch('/api/autofix/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentText: codeToFix,
          filePath: selectedLang === 'cpp' ? 'main.cpp' : 'main.rs',
          diagnostics
        })
      });

      const data = await res.json();
      setDetectedFixes(data.fixes || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFix = (fix: any) => {
    setCodeToFix(fix.newContent);
    setDetectedFixes([]);
  };

  const handleBlueGhost = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ghost/blue-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prefix: ghostPrefix,
          suffix: '',
          languageId: selectedLang === 'cpp' ? 'cpp' : 'rust'
        })
      });
      const data = await res.json();
      setBlueGhostResult(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLibrarySearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/libraries/search?q=${encodeURIComponent(libQuery)}`);
      const data = await res.json();
      setLibResults(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async (userPrompt?: string) => {
    const finalPrompt = userPrompt || prompt;
    if (!finalPrompt.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          enableSearchGrounding: enableGrounding,
          systemInstruction: 'You are RIPOSTE AI, an expert C, C++, and Rust engineering assistant.'
        })
      });

      const data = await res.json();
      setResponse(data.text || data.error || 'No response returned');
    } catch (err: any) {
      setResponse(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            Gemini AI C/C++/Rust Assistant & Auto-Fixer
          </h1>
          <p className="text-sm text-zinc-400">
            Automatic compiler error repair, blue inline ghost text suggestions, library search, and web-grounded AI chat.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveMode('autofix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeMode === 'autofix' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            ⚡ Auto Error Fixer
          </button>
          <button
            onClick={() => setActiveMode('blue_ghost')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeMode === 'blue_ghost' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🔷 Blue Ghost Text
          </button>
          <button
            onClick={() => { setActiveMode('libraries'); handleLibrarySearch(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeMode === 'libraries' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📚 Library Knowledge
          </button>
          <button
            onClick={() => setActiveMode('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeMode === 'chat' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            💬 Grounded Chat
          </button>
        </div>
      </div>

      {/* Mode 1: Auto Error Repair Engine */}
      {activeMode === 'autofix' && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" />
              Automatic Code & Compiler Error Repair Engine (C / C++ / Rust)
            </h2>

            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
              <button
                onClick={() => {
                  setSelectedLang('cpp');
                  setCodeToFix('// C++ Missing Header & Semicolon Error Example\nvoid process_data() {\n    std::vector<int> nums = {1, 2, 3}\n    std::string name = "RIPOSTE"\n}');
                }}
                className={`px-2.5 py-1 rounded font-medium ${selectedLang === 'cpp' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400'}`}
              >
                C / C++
              </button>
              <button
                onClick={() => {
                  setSelectedLang('rust');
                  setCodeToFix('// Rust Missing Import Example\nfn main() {\n    let mut map = HashMap::new();\n    map.insert("key", "val");\n}');
                }}
                className={`px-2.5 py-1 rounded font-medium ${selectedLang === 'rust' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400'}`}
              >
                Rust
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400">Source Buffer with Errors:</label>
            <textarea
              value={codeToFix}
              onChange={(e) => setCodeToFix(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 font-mono text-xs text-cyan-300 min-h-[120px]"
            />
          </div>

          <button
            onClick={handleRunAutoFix}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm transition-colors shadow-lg shadow-cyan-500/10 flex items-center gap-2"
          >
            <Wrench className="w-4 h-4" />
            {loading ? 'Analyzing Errors...' : 'Analyze & Auto-Fix Errors Automatically'}
          </button>

          {detectedFixes.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold text-emerald-400 block">Detected Automatic Code Fixes:</span>
              {detectedFixes.map((fix, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" /> {fix.title}
                    </span>
                    <p className="text-xs text-zinc-400">{fix.description}</p>
                  </div>
                  <button
                    onClick={() => applyFix(fix)}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shrink-0"
                  >
                    Apply Auto-Fix
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Blue Ghost Text */}
      {activeMode === 'blue_ghost' && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            Blue Inline Ghost Text Suggestions (C, C++, Rust)
          </h2>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400">Prefix Code at Cursor:</label>
            <textarea
              value={ghostPrefix}
              onChange={(e) => setGhostPrefix(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 font-mono text-xs text-cyan-300 min-h-[100px]"
            />
          </div>

          <button
            onClick={handleBlueGhost}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm"
          >
            Simulate Blue Ghost Text Completion
          </button>

          {blueGhostResult && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-500/40 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-cyan-400" /> Blue Ghost Text Decoration:
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {blueGhostResult.category}
                </span>
              </div>
              <pre className="text-cyan-300 font-semibold bg-cyan-950/30 p-3 rounded-lg border border-cyan-800/30">
                {blueGhostResult.text}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Library Knowledge Base */}
      {activeMode === 'libraries' && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-100">
              Built-in Library & Crate Knowledge Catalog
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={libQuery}
                onChange={(e) => setLibQuery(e.target.value)}
                placeholder="Search C, C++, or Rust library..."
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 font-mono w-60"
              />
              <button
                onClick={handleLibrarySearch}
                className="px-3 py-1.5 bg-cyan-500 text-zinc-950 font-bold rounded-lg text-xs"
              >
                Search
              </button>
            </div>
          </div>

          {libResults && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-1">
              {libResults.cppHeaders?.map((h: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1 font-mono text-xs">
                  <span className="text-cyan-400 font-bold">{h.header}</span>
                  <p className="text-zinc-400 font-sans text-xs">{h.description}</p>
                  <pre className="text-zinc-300 text-[11px] bg-zinc-900 p-2 rounded">{h.commonUsage}</pre>
                </div>
              ))}

              {libResults.rustCrates?.map((c: any, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1 font-mono text-xs">
                  <span className="text-cyan-400 font-bold">crate::{c.name}</span>
                  <p className="text-zinc-400 font-sans text-xs">{c.description}</p>
                  <pre className="text-zinc-300 text-[11px] bg-zinc-900 p-2 rounded">{c.commonUsage}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mode 4: Grounded AI Chat */}
      {activeMode === 'chat' && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-100">
              Web-Grounded Gemini AI Chat for C, C++, and Rust
            </h2>

            <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={enableGrounding}
                onChange={(e) => setEnableGrounding(e.target.checked)}
                className="rounded border-zinc-800 bg-zinc-950 text-cyan-500 focus:ring-0"
              />
              <span>Enable Google Search Grounding for Live Docs</span>
            </label>
          </div>

          <div className="flex gap-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask RIPOSTE about any C, C++, or Rust library, header, or build configuration..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 min-h-[80px]"
            />
            <button
              onClick={() => handleSendChat()}
              disabled={loading}
              className="px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold flex items-center justify-center transition-colors shadow-lg shadow-cyan-500/10"
            >
              {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>

          {response && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-xs font-semibold text-cyan-400 font-mono">Gemini Response:</span>
              <pre className="text-xs font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed">{response}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
