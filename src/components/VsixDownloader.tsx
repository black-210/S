import React, { useEffect, useState } from 'react';
import { Download, ShieldCheck, Terminal, Package, FileCode, Check, Copy, FolderTree, FileText } from 'lucide-react';

export const VsixDownloader: React.FC = () => {
  const [vsixInfo, setVsixInfo] = useState<{ fileName: string; sizeBytes: number; sha256: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showInspector, setShowInspector] = useState(false);

  useEffect(() => {
    fetch('/api/vsix/info')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setVsixInfo(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const installCmd = 'code-oss --install-extension riposte-extension-1.0.0.vsix';

  const copyCmd = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const archiveTree = [
    { path: 'extension.vsixmanifest', type: 'xml', desc: 'VS Code VSIX Package Manifest v2.0' },
    { path: '[Content_Types].xml', type: 'xml', desc: 'Open Packaging Convention Types' },
    { path: 'extension/package.json', type: 'json', desc: 'Extension Activation & Commands Manifest' },
    { path: 'extension/out/extension.js', type: 'js', desc: 'Compiled TypeScript CommonJS Bundle' },
    { path: 'extension/README.md', type: 'md', desc: 'Documentation Overview' },
    { path: 'extension/RESEARCH.md', type: 'md', desc: 'Technical Investigation & Specs' }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Package className="w-96 h-96 text-cyan-500" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Genuine Compiled VSIX Package
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight">
            RIPOSTE VSIX Extension Package
          </h1>

          <p className="text-zinc-400 text-base leading-relaxed">
            Fully compiled, production-ready VS Code / Code OSS extension bundle for Android ARM64 Termux and standard Linux. Includes real Clang/LLVM, Rust, Gemini 3.8 Flash AI, Ghost Text, and diagnostic toolchains.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="/api/vsix/download"
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-cyan-500 text-zinc-950 font-bold text-base hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20 active:scale-95"
            >
              <Download className="w-5 h-5" />
              Download VSIX Package
            </a>

            <button
              onClick={() => setShowInspector(!showInspector)}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-sm transition-colors border border-zinc-700"
            >
              <FolderTree className="w-4 h-4 text-cyan-400" />
              {showInspector ? 'Hide Archive Contents' : 'Inspect VSIX Archive Layout'}
            </button>
          </div>
        </div>
      </div>

      {/* Artifact Metadata */}
      {vsixInfo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-xs font-medium text-zinc-400">File Name</span>
            <p className="font-mono text-sm font-semibold text-zinc-200">{vsixInfo.fileName}</p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-xs font-medium text-zinc-400">Exact File Size</span>
            <p className="font-mono text-sm font-semibold text-cyan-400">
              {vsixInfo.sizeBytes.toLocaleString()} bytes ({(vsixInfo.sizeBytes / 1024).toFixed(2)} KB)
            </p>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-xs font-medium text-zinc-400">SHA-256 Checksum</span>
            <p className="font-mono text-xs font-semibold text-zinc-300 truncate" title={vsixInfo.sha256}>
              {vsixInfo.sha256}
            </p>
          </div>
        </div>
      )}

      {/* VSIX Internal Layout Inspector */}
      {showInspector && (
        <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-cyan-400" />
            VSIX Internal ZIP Structure Inspector
          </h3>

          <div className="space-y-2">
            {archiveTree.map((item) => (
              <div
                key={item.path}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-xs"
              >
                <div className="flex items-center gap-2 text-cyan-300">
                  <FileText className="w-4 h-4 text-zinc-500" />
                  <span>{item.path}</span>
                </div>
                <span className="text-zinc-500 text-[11px] font-sans">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Installation Instructions */}
      <div className="p-6 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          Terminal Installation Commands
        </h2>

        <div className="space-y-3">
          <div>
            <span className="text-xs text-zinc-400">Code OSS / VS Code CLI Command:</span>
            <div className="mt-1 flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-sm text-cyan-300">
              <code>{installCmd}</code>
              <button
                onClick={copyCmd}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-sans text-zinc-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-800/30 text-xs text-cyan-200 space-y-1">
            <span className="font-semibold block">Termux Quick Start:</span>
            <p>1. Run: <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-cyan-300">pkg install -y clang rust rust-analyzer cmake ninja</code></p>
            <p>2. Execute: <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-cyan-300">{installCmd}</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};
