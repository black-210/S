import { CPP_STANDARD_HEADERS } from '../knowledge/cppLibraries.js';
import { RUST_STANDARD_MODULES } from '../knowledge/rustLibraries.js';

export interface ProposedFix {
  title: string;
  kind: string;
  filePath: string;
  newContent: string;
  line: number;
  description: string;
}

export class ErrorFixerEngine {
  /**
   * Analyzes diagnostic errors from clangd / rustc / cargo / clippy and returns auto-repairs
   */
  public static analyzeAndFixDocument(documentText: string, filePath: string, diagnostics: Array<{ message: string; line: number; code?: string }>): ProposedFix[] {
    const fixes: ProposedFix[] = [];
    const isCpp = filePath.endsWith('.cpp') || filePath.endsWith('.hpp') || filePath.endsWith('.c') || filePath.endsWith('.h');
    const isRust = filePath.endsWith('.rs');

    for (const diag of diagnostics) {
      const msg = diag.message.toLowerCase();
      const lineNum = Math.max(0, diag.line);

      if (isCpp) {
        // 1. Missing C/C++ Header Fix
        for (const headerInfo of CPP_STANDARD_HEADERS) {
          for (const sym of headerInfo.symbols) {
            const symShort = sym.replace('std::', '');
            if (msg.includes(symShort.toLowerCase()) || msg.includes(`'${symShort}'`) || msg.includes(`'${sym}'`)) {
              if (!documentText.includes(headerInfo.header)) {
                const lines = documentText.split('\n');
                let insertIdx = 0;
                while (insertIdx < lines.length && (lines[insertIdx].startsWith('#include') || lines[insertIdx].trim() === '')) {
                  insertIdx++;
                }
                lines.splice(insertIdx, 0, `#include ${headerInfo.header}`);
                fixes.push({
                  title: `⚡ Auto-Fix C/C++: Add #include ${headerInfo.header}`,
                  kind: 'quickfix.addInclude',
                  filePath,
                  newContent: lines.join('\n'),
                  line: insertIdx + 1,
                  description: `Automatically included ${headerInfo.header} required for ${symShort}.`
                });
                break;
              }
            }
          }
        }

        // 2. Member Access Fix (. vs ->)
        if (msg.includes('member reference type') && msg.includes('is a pointer') && msg.includes('did you mean to use \'->\'')) {
          const lines = documentText.split('\n');
          if (lines[lineNum]) {
            lines[lineNum] = lines[lineNum].replace(/\.([a-zA-Z0-9_]+)/, '->$1');
            fixes.push({
              title: "⚡ Auto-Fix C++: Replace '.' with '->' for pointer access",
              kind: 'quickfix.replaceDotWithArrow',
              filePath,
              newContent: lines.join('\n'),
              line: lineNum + 1,
              description: "Converted '.' to '->' for pointer member invocation."
            });
          }
        }

        // 3. Missing Semicolon Fix
        if (msg.includes('expected \';\' after') || msg.includes('expected \';\' at end')) {
          const lines = documentText.split('\n');
          if (lines[lineNum]) {
            lines[lineNum] = lines[lineNum].trimEnd() + ';';
            fixes.push({
              title: "⚡ Auto-Fix C/C++: Insert missing semicolon ';'",
              kind: 'quickfix.addSemicolon',
              filePath,
              newContent: lines.join('\n'),
              line: lineNum + 1,
              description: "Appended missing semicolon at line end."
            });
          }
        }
      } else if (isRust) {
        // 1. Missing Rust 'use' import
        for (const mod of RUST_STANDARD_MODULES) {
          for (const sym of mod.symbols) {
            if (msg.includes(`cannot find type \`${sym}\``) || msg.includes(`cannot find value \`${sym}\``) || msg.includes(`\`${sym}\` in this scope`)) {
              if (!documentText.includes(`use ${mod.path}::${sym}`) && !documentText.includes(`use ${mod.path}::*`)) {
                const lines = documentText.split('\n');
                let insertIdx = 0;
                while (insertIdx < lines.length && (lines[insertIdx].startsWith('use ') || lines[insertIdx].trim() === '')) {
                  insertIdx++;
                }
                lines.splice(insertIdx, 0, `use ${mod.path}::${sym};`);
                fixes.push({
                  title: `⚡ Auto-Fix Rust: Add use ${mod.path}::${sym};`,
                  kind: 'quickfix.addRustUse',
                  filePath,
                  newContent: lines.join('\n'),
                  line: insertIdx + 1,
                  description: `Automatically inserted import 'use ${mod.path}::${sym};'.`
                });
                break;
              }
            }
          }
        }

        // 2. Borrow checker E0382 move fix
        if (msg.includes('use of moved value') || (diag.code && diag.code === 'E0382')) {
          const lines = documentText.split('\n');
          if (lines[lineNum]) {
            // Attempt auto .clone()
            lines[lineNum] = lines[lineNum].replace(/([a-zA-Z0-9_]+)(\s*[\),\;])/, '$1.clone()$2');
            fixes.push({
              title: "⚡ Auto-Fix Rust E0382: Insert .clone() to prevent move of value",
              kind: 'quickfix.rustCloneMove',
              filePath,
              newContent: lines.join('\n'),
              line: lineNum + 1,
              description: "Appended .clone() to duplicate value before ownership transfer."
            });
          }
        }

        // 3. Mutable reference fix E0502 / E0596
        if (msg.includes('cannot borrow') && msg.includes('as mutable')) {
          const lines = documentText.split('\n');
          if (lines[lineNum]) {
            lines[lineNum] = lines[lineNum].replace(/\b([a-zA-Z0-9_]+)\b/, 'mut $1');
            fixes.push({
              title: "⚡ Auto-Fix Rust: Mark variable as 'mut'",
              kind: 'quickfix.rustMakeMut',
              filePath,
              newContent: lines.join('\n'),
              line: lineNum + 1,
              description: "Added 'mut' keyword to allow mutable borrows."
            });
          }
        }
      }
    }

    return fixes;
  }
}
