import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, XCircle, AlertCircle, RefreshCw, Terminal, Smartphone } from 'lucide-react';

export const ToolchainDiagnostics: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDiagnostics = () => {
    setLoading(true);
    fetch('/api/diagnostics/toolchain')
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            Native Toolchains & Environment Audit
          </h1>
          <p className="text-sm text-zinc-400">
            Real process discovery for Rust (`rustc`, `cargo`, `rust-analyzer`) and Clang/LLVM (`clang`, `clang++`, `clangd`, `lld`).
          </p>
        </div>

        <button
          onClick={fetchDiagnostics}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          Refresh Audit
        </button>
      </div>

      {report && (
        <>
          {/* Environment Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
              <Smartphone className={`w-8 h-8 ${report.isTermux ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <div>
                <span className="text-xs text-zinc-400">Target Environment</span>
                <p className="font-semibold text-sm text-zinc-100">
                  {report.isTermux ? 'Native Termux Android' : 'Standard Linux / POSIX'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
              <Cpu className={`w-8 h-8 ${report.isArm64 ? 'text-cyan-400' : 'text-blue-400'}`} />
              <div>
                <span className="text-xs text-zinc-400">CPU Architecture</span>
                <p className="font-semibold text-sm text-zinc-100 uppercase">{report.arch} ({report.platform})</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
              <Terminal className="w-8 h-8 text-amber-400" />
              <div>
                <span className="text-xs text-zinc-400">PRoot / Container</span>
                <p className="font-semibold text-sm text-zinc-100">{report.isProot ? 'Active PRoot' : 'Bare Native'}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
              <Terminal className="w-8 h-8 text-cyan-400" />
              <div>
                <span className="text-xs text-zinc-400">Prefix Path</span>
                <p className="font-semibold text-xs text-zinc-300 truncate font-mono">
                  {report.termuxPrefix || '/usr'}
                </p>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <h2 className="text-lg font-bold text-zinc-100">Discovered Executables & Toolchains</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(report.tools || {}).map(([key, info]: [string, any]) => (
                <div
                  key={key}
                  className="p-4 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-start justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-zinc-100 capitalize">{key}</span>
                      <span className="font-mono text-xs text-zinc-400">({info.name})</span>
                    </div>
                    <p className="font-mono text-xs text-zinc-400">{info.path || 'Not found in PATH'}</p>
                    {info.version && (
                      <p className="font-mono text-xs text-cyan-400/90 truncate">{info.version}</p>
                    )}
                  </div>

                  {info.installed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
