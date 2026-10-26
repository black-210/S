import React from 'react';
import { Shield, Terminal, Download, Cpu, Sparkles, BookOpen, CheckCircle2, Play } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  geminiConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, geminiConnected }) => {
  const tabs = [
    { id: 'vsix', label: 'VSIX Package', icon: Download },
    { id: 'toolchain', label: 'Native Toolchains', icon: Cpu },
    { id: 'gemini', label: 'Gemini AI Assistant', icon: Sparkles },
    { id: 'sandbox', label: 'Compiler Sandbox', icon: Terminal },
    { id: 'docs', label: 'Documentation Hub', icon: BookOpen },
    { id: 'tests', label: 'Test Runner', icon: Play },
  ];

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-mono font-bold text-zinc-950 shadow-lg shadow-cyan-500/20">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-zinc-100 tracking-tight">RIPOSTE</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono border border-cyan-500/20">
                  v1.0.0 VSIX
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">Clang/LLVM + Rust + Gemini AI Extension</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-cyan-400 border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
              <div className={`w-2 h-2 rounded-full ${geminiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-zinc-300 font-mono">
                {geminiConnected ? 'Gemini 3.8 Flash' : 'API Key Check'}
              </span>
            </div>

            <a
              href="/api/vsix/download"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-zinc-950 font-semibold text-sm hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/10"
            >
              <Download className="w-4 h-4" />
              Download VSIX
            </a>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-2 border-t border-zinc-800/60 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-zinc-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
