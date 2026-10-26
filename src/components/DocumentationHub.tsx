import React, { useState } from 'react';
import { BookOpen, Search, FileText, Copy, Check, ChevronRight } from 'lucide-react';
import { DOCS_DATA } from '../docs/docContent';

export const DocumentationHub: React.FC = () => {
  const [selectedDocId, setSelectedDocId] = useState('RESEARCH');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const docsList = Object.values(DOCS_DATA);
  const selectedDoc = DOCS_DATA[selectedDocId] || DOCS_DATA['RESEARCH'];

  const filteredDocs = docsList.filter(
    (d) =>
      d.filename.toLowerCase().includes(search.toLowerCase()) ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
  );

  const copyContent = () => {
    navigator.clipboard.writeText(selectedDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            Complete Documentation Hub (24 Technical Specifications)
          </h1>
          <p className="text-sm text-zinc-400">
            Full-length technical manuals for Clang/LLVM, Rust, Gemini 3.8 Flash, Ghost Text, Termux ARM64, and security policies.
          </p>
        </div>

        <button
          onClick={copyContent}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Full Document' : 'Copy Document Markdown'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar Document List */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search all 24 technical manuals..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto no-scrollbar pr-1">
            {filteredDocs.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold shadow-lg shadow-cyan-500/5'
                      : 'text-zinc-300 hover:bg-zinc-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`} />
                    <div className="min-w-0">
                      <div className="font-mono text-xs truncate">{doc.filename}</div>
                      <div className="text-[10px] text-zinc-500 truncate">{doc.category}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-zinc-600 opacity-0 group-hover:opacity-100'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Reader */}
        <div className="lg:col-span-8 p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono border border-cyan-500/20">
                {selectedDoc.category}
              </span>
              <h2 className="text-lg font-bold text-zinc-100 mt-1">{selectedDoc.title}</h2>
            </div>
            <span className="font-mono text-xs text-zinc-500">/{selectedDoc.filename}</span>
          </div>

          <div className="font-mono text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap bg-zinc-950 p-6 rounded-xl border border-zinc-800/80 max-h-[600px] overflow-y-auto select-text">
            {selectedDoc.content}
          </div>
        </div>
      </div>
    </div>
  );
};
