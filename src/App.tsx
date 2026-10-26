import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VsixDownloader } from './components/VsixDownloader';
import { ToolchainDiagnostics } from './components/ToolchainDiagnostics';
import { GeminiAssistantStudio } from './components/GeminiAssistantStudio';
import { CodeSandbox } from './components/CodeSandbox';
import { DocumentationHub } from './components/DocumentationHub';
import { TestRunnerView } from './components/TestRunnerView';

export default function App() {
  const [activeTab, setActiveTab] = useState('vsix');
  const [geminiConnected, setGeminiConnected] = useState(false);

  useEffect(() => {
    fetch('/api/gemini/test-connection')
      .then((res) => res.json())
      .then((data) => {
        if (data.connected) setGeminiConnected(true);
      })
      .catch(() => setGeminiConnected(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} geminiConnected={geminiConnected} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'vsix' && <VsixDownloader />}
        {activeTab === 'toolchain' && <ToolchainDiagnostics />}
        {activeTab === 'gemini' && <GeminiAssistantStudio />}
        {activeTab === 'sandbox' && <CodeSandbox />}
        {activeTab === 'docs' && <DocumentationHub />}
        {activeTab === 'tests' && <TestRunnerView />}
      </main>

      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500 font-mono">
        RIPOSTE v1.0.0 — Native Clang/LLVM + Rust + Gemini AI Extension for Code OSS & Termux ARM64
      </footer>
    </div>
  );
}
