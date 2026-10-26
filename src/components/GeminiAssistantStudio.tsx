import React, { useState } from 'react';
import { Sparkles, Send, ShieldAlert, Code2, Cpu, Check, Copy, FileText, Bug } from 'lucide-react';

export const GeminiAssistantStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'ghost' | 'rust_explain' | 'patch'>('chat');

  // Ghost Text simulator state
  const [prefixCode, setPrefixCode] = useState('fn calculate_fibonacci(n: u32) -> u64 {\n    match n {\n        0 => 0,\n        1 => 1,');
  const [ghostResult, setGhostResult] = useState('');

  // Rust Error explainer state
  const [rustErrorCode, setRustErrorCode] = useState('E0382');
  const [rustExplanation, setRustExplanation] = useState('');

  // Patch engine state
  const [origCode, setOrigCode] = useState('fn main() {\n    let v = vec![1, 2, 3];\n    println!("{:?}", v);\n}');
  const [patchResult, setPatchResult] = useState<{ hunk: string; proposed: string } | null>(null);

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
          systemInstruction: 'You are RIPOSTE AI, an expert C/C++, Rust, Clang, and Gemini engineering assistant.'
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

  const handleGhostSim = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Complete the following Rust code prefix. Return ONLY raw code continuation, no markdown:\n\n${prefixCode}`,
          temperature: 0.1
        })
      });
      const data = await res.json();
      setGhostResult(data.text || 'No completion generated');
    } catch (err: any) {
      setGhostResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRustExplain = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Explain the Rust compiler error code ${rustErrorCode}. Provide idiomatic Rust code examples of how to resolve it cleanly.`,
          systemInstruction: 'You are an expert Rust compiler error diagnostic engine.'
        })
      });
      const data = await res.json();
      setRustExplanation(data.text || 'No explanation found');
    } catch (err: any) {
      setRustExplanation(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProposePatch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Refactor the following Rust snippet to improve safety, performance, and idiomatic style. Return ONLY the refactored code:\n\n${origCode}`,
          temperature: 0.1
        })
      });
      const data = await res.json();
      const proposed = data.text.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();

      // Simple diff hunk representation
      const hunk = `--- a/src/main.rs\n+++ b/src/main.rs\n@@ -1,4 +1,4 @@\n-${origCode.replace(/\n/g, '\n-')}\n+${proposed.replace(/\n/g, '\n+')}`;
      setPatchResult({ hunk, proposed });
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            Gemini 3.8 Flash AI Studio & Sandbox
          </h1>
          <p className="text-sm text-zinc-400">
            Interactive playground for Ghost Text completions, AI Chat, Rust error explanations, and Proposed Patch previews.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveMode('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeMode === 'chat' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            AI Chat
          </button>
          <button
            onClick={() => setActiveMode('ghost')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeMode === 'ghost' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Ghost Text
          </button>
          <button
            onClick={() => setActiveMode('rust_explain')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeMode === 'rust_explain' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Rust Error Explainer
          </button>
          <button
            onClick={() => setActiveMode('patch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeMode === 'patch' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Proposed Patch
          </button>
        </div>
      </div>

      {/* Mode 1: Multi-turn AI Chat */}
      {activeMode === 'chat' && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => handleSendChat('Explain memory safety differences between Rust and C++')}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            >
              C++ vs Rust Memory Safety
            </button>
            <button
              onClick={() => handleSendChat('How to configure clangd compile_commands.json for CMake?')}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            >
              clangd Setup
            </button>
            <button
              onClick={() => handleSendChat('Explain Rust E0382 borrow after move')}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            >
              Rust E0382
            </button>
          </div>

          <div className="flex gap-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask RIPOSTE AI anything about your C/C++ or Rust code..."
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
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
              <span className="text-xs font-semibold text-cyan-400 font-mono">Gemini 3.8 Flash Response:</span>
              <pre className="text-xs font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed">{response}</pre>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Ghost Text Simulator */}
      {activeMode === 'ghost' && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            Ghost Text Inline Completion Simulator
          </h2>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400">Prefix Code at Cursor Location:</label>
            <textarea
              value={prefixCode}
              onChange={(e) => setPrefixCode(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 font-mono text-xs text-cyan-300 min-h-[120px]"
            />
          </div>

          <button
            onClick={handleGhostSim}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm transition-colors"
          >
            {loading ? 'Generating Completion...' : 'Simulate Ghost Text Completion'}
          </button>

          {ghostResult && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs space-y-1">
              <span className="text-zinc-500 block">Suggested Inline Continuation:</span>
              <span className="text-emerald-400 font-semibold">{ghostResult}</span>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Rust Error Explainer */}
      {activeMode === 'rust_explain' && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Bug className="w-5 h-5 text-cyan-400" />
            Rust Compiler Diagnostic Explainer
          </h2>

          <div className="flex gap-3">
            <input
              type="text"
              value={rustErrorCode}
              onChange={(e) => setRustErrorCode(e.target.value)}
              placeholder="e.g. E0382, E0502, E0308"
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 font-mono w-48"
            />
            <button
              onClick={handleRustExplain}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm"
            >
              Explain Error Code
            </button>
          </div>

          {rustExplanation && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs whitespace-pre-wrap text-zinc-200">
              {rustExplanation}
            </div>
          )}
        </div>
      )}

      {/* Mode 4: Proposed Patch Diff */}
      {activeMode === 'patch' && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            AI Refactor & Proposed Patch Preview
          </h2>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400">Original Code File:</label>
            <textarea
              value={origCode}
              onChange={(e) => setOrigCode(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 font-mono text-xs text-zinc-200 min-h-[100px]"
            />
          </div>

          <button
            onClick={handleProposePatch}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm"
          >
            Generate Proposed Patch
          </button>

          {patchResult && (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 font-mono text-xs">
              <span className="text-cyan-400 font-bold block">Unified Diff Hunk:</span>
              <pre className="text-zinc-300 bg-zinc-900 p-3 rounded-lg overflow-x-auto">{patchResult.hunk}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
