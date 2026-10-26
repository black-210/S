import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, XCircle } from 'lucide-react';

export const CodeSandbox: React.FC = () => {
  const [language, setLanguage] = useState<'rust' | 'cpp' | 'c'>('rust');
  const [code, setCode] = useState(
    'fn main() {\n    let name = "RIPOSTE ARM64";\n    println!("Hello from {}!", name);\n}'
  );
  const [output, setOutput] = useState<any>(null);
  const [running, setRunning] = useState(false);

  const handleLanguageChange = (lang: 'rust' | 'cpp' | 'c') => {
    setLanguage(lang);
    if (lang === 'rust') {
      setCode('fn main() {\n    let name = "RIPOSTE ARM64";\n    println!("Hello from {}!", name);\n}');
    } else if (lang === 'cpp') {
      setCode('#include <iostream>\n\nint main() {\n    std::cout << "Hello from Clang++ RIPOSTE!" << std::endl;\n    return 0;\n}');
    } else {
      setCode('#include <stdio.h>\n\nint main() {\n    printf("Hello from Clang C!\\n");\n    return 0;\n}');
    }
  };

  const runCode = async () => {
    setRunning(true);
    setOutput(null);

    try {
      const res = await fetch('/api/sandbox/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code })
      });
      const data = await res.json();
      setOutput(data);
    } catch (err: any) {
      setOutput({ success: false, compilationOutput: err.message, runOutput: '' });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-cyan-400" />
            Native Compiler Sandbox (`rustc` / `clang`)
          </h1>
          <p className="text-sm text-zinc-400">
            Write C, C++, or Rust code and compile natively on the system.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => handleLanguageChange('rust')}
              className={`px-3 py-1.5 rounded-lg font-medium ${
                language === 'rust' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400'
              }`}
            >
              Rust
            </button>
            <button
              onClick={() => handleLanguageChange('cpp')}
              className={`px-3 py-1.5 rounded-lg font-medium ${
                language === 'cpp' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400'
              }`}
            >
              C++ (clang++)
            </button>
            <button
              onClick={() => handleLanguageChange('c')}
              className={`px-3 py-1.5 rounded-lg font-medium ${
                language === 'c' ? 'bg-cyan-500 text-zinc-950 font-bold' : 'text-zinc-400'
              }`}
            >
              C (clang)
            </button>
          </div>

          <button
            onClick={runCode}
            disabled={running}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm transition-colors shadow-lg shadow-cyan-500/10"
          >
            <Play className="w-4 h-4" />
            {running ? 'Compiling...' : 'Compile & Run'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-zinc-400">Editor Source Buffer</span>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-80 bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-zinc-400">Compiler & Program Output</span>
          <div className="h-80 bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs overflow-y-auto space-y-3">
            {output ? (
              <>
                <div className="flex items-center gap-2">
                  {output.success ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Compilation Succeeded
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-sans">
                      <XCircle className="w-3.5 h-3.5" /> Compilation / Execution Failed
                    </span>
                  )}
                </div>

                {output.compilationOutput && (
                  <div>
                    <span className="text-zinc-500 block text-[11px]">Compiler Output:</span>
                    <pre className="text-zinc-300 whitespace-pre-wrap">{output.compilationOutput}</pre>
                  </div>
                )}

                {output.runOutput && (
                  <div>
                    <span className="text-cyan-400 block text-[11px]">Program stdout:</span>
                    <pre className="text-emerald-300 font-bold whitespace-pre-wrap">{output.runOutput}</pre>
                  </div>
                )}
              </>
            ) : (
              <span className="text-zinc-600 italic">Click "Compile & Run" to execute code natively.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
