import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, RefreshCw, ShieldCheck } from 'lucide-react';

export const TestRunnerView: React.FC = () => {
  const [log, setLog] = useState('');
  const [running, setRunning] = useState(false);
  const [passed, setPassed] = useState<boolean | null>(null);

  const handleRunTests = async () => {
    setRunning(true);
    setLog('');
    setPassed(null);

    try {
      const res = await fetch('/api/tests/run', { method: 'POST' });
      const data = await res.json();
      setLog(data.log || 'Test runner completed.');
      setPassed(data.success);
    } catch (err: any) {
      setLog(`Error executing tests: ${err.message}`);
      setPassed(false);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <Play className="w-6 h-6 text-cyan-400" />
            Automated Extension Test Suite (`npm test`)
          </h1>
          <p className="text-sm text-zinc-400">
            Executes verification tests for Extension Activation, Secret Redaction, Patch Diff Engine, Rust Errors, and Termux Detector.
          </p>
        </div>

        <button
          onClick={handleRunTests}
          disabled={running}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-sm transition-colors shadow-lg shadow-cyan-500/10"
        >
          <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
          {running ? 'Running Test Suite...' : 'Execute Automated Tests'}
        </button>
      </div>

      <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-400">Execution Output Log:</span>
          {passed !== null && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                passed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {passed ? 'All Test Suites Passed' : 'Test Failures Detected'}
            </span>
          )}
        </div>

        <div className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-4 font-mono text-xs min-h-[300px] max-h-[500px] overflow-y-auto">
          {log ? (
            <pre className="text-cyan-300 whitespace-pre-wrap">{log}</pre>
          ) : (
            <span className="text-zinc-600 italic">Click "Execute Automated Tests" to run the test suite live.</span>
          )}
        </div>
      </div>
    </div>
  );
};
