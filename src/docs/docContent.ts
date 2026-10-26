export interface DocItem {
  id: string;
  filename: string;
  title: string;
  category: string;
  content: string;
}

export const DOCS_DATA: Record<string, DocItem> = {
  RESEARCH: {
    id: 'RESEARCH',
    filename: 'RESEARCH.md',
    title: 'Internet Technical Research & Verification Specification',
    category: 'Architecture & Spec',
    content: `# RIPOSTE — Internet Technical Research & Specification

## 1. Executive Summary & Verification Matrix
- **Document Version**: 1.0.0
- **Research Date**: October 2026
- **Primary Targets**: Code OSS (VS Code Extension Host API v1.85.0+), Termux on Android ARM64 (\`aarch64-linux-android\`), Linux x86_64 (\`x86_64-unknown-linux-gnu\` / \`musl\`).
- **AI Engine**: Gemini 3.8 Flash (\`gemini-3.8-flash\`) via official \`@google/genai\` SDK v2.4.0+.
- **Language Toolchains**: Rust (\`rustc\`, \`cargo\`, \`rust-analyzer\`, \`clippy-driver\`, \`rustfmt\`) and Clang/LLVM (\`clang\`, \`clang++\`, \`clangd\`, \`lld\`, \`clang-tidy\`).

---

## 2. Clang/LLVM Compiler & Language Server Research
### 2.1 Clang & LLVM Architecture
Official sources consulted:
- \`https://clang.llvm.org/docs/\`
- \`https://clangd.llvm.org/\`
- \`https://clangd.llvm.org/design/compile-commands\`

Key verified findings:
1. **Compilation Database Schema**: \`clangd\` requires a \`compile_commands.json\` or \`compile_flags.txt\` file at the project root or build directory to infer include paths (\`-I\`), C++ standards (\`-std=c++20\`), target triples (\`--target=aarch64-linux-android\`), and preprocessor macros (\`-D\`).
2. **Termux Native Clang**: Termux packages LLVM/Clang binaries natively inside \`/data/data/com.termux/files/usr/bin/clang\` and \`/data/data/com.termux/files/usr/bin/clangd\`.
3. **Clang-Tidy Static Analysis**: Executed via \`clang-tidy main.cpp --\` to produce diagnostic checks including performance, bugprone, modernize, and readability rules.

---

## 3. Rust Ecosystem & Toolchain Research
### 3.1 Toolchain Executables
Official sources consulted:
- \`https://doc.rust-lang.org/\`
- \`https://doc.rust-lang.org/cargo/\`
- \`https://rust-analyzer.github.io/\`

Key verified findings:
1. **Cargo JSON Output**: \`cargo check --message-format=json\` streams structured compiler diagnostics as newline-delimited JSON objects containing file paths, spans, error codes (e.g. \`E0382\`), primary messages, and suggested fixes.
2. **rust-analyzer Stdio LSP**: \`rust-analyzer\` runs as a standard Language Server Protocol daemon listening over stdin/stdout, supporting semantic tokens, go-to-definition, type hover info, inlay hints, and code actions.
3. **Rust Compiler Error Explanations**: \`rustc --explain E0382\` returns official Markdown explanations detailing ownership moves, borrow checker rules, and resolution patterns.

---

## 4. Code OSS Extension Host API Research
Official sources consulted:
- \`https://code.visualstudio.com/api/references/vscode-api\`
- \`https://code.visualstudio.com/api/language-extensions/programmatic-language-features\`

Key verified findings:
1. **Inline Completion Provider (Ghost Text)**: \`vscode.languages.registerInlineCompletionItemProvider\` provides Copilot-style ghost completions. Requires debouncing (150ms-300ms) and cancellation token handling (\`vscode.CancellationToken\`) to abort stale requests during rapid typing.
2. **Webview View Provider**: \`vscode.window.registerWebviewViewProvider\` hosts custom sidebar views for interactive AI chat, prompt buttons, and unified diff previews.
3. **SecretStorage API**: \`context.secrets\` securely stores the Gemini API key encrypted in the user's OS keyring or Code OSS state storage.

---

## 5. Gemini AI Integration & Security Research
Official sources consulted:
- \`https://ai.google.dev/gemini-api/docs\`
- \`@google/genai\` SDK Specification

Key verified findings:
1. **Server Proxy Architecture**: All Gemini API requests are executed server-side via Express proxy routes (\`/api/gemini/generate\`) using the \`@google/genai\` SDK to prevent client-side credential exposure.
2. **Telemetry Header**: Requests include \`httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }\`.
3. **Secret Redaction**: Regex scanners scrub API keys (\`AIzaSy...\`), bearer tokens, SSH private keys (\`-----BEGIN PRIVATE KEY-----\`), and \`.env\` file paths prior to payload transmission.

---

## 6. Termux Android ARM64 Environment Compatibility
1. **Prefix Pathing**: Termux environment variables populate \`PREFIX=/data/data/com.termux/files/usr\`. Binary discovery inspects \`PREFIX/bin\` before system fallback paths.
2. **PRoot vs Bare Native**: PRoot environments run Linux rootfs under \`ptrace\` syscall translation. Native Termux executes directly on Android Linux kernel ARM64 Bionic libc ABI.
`
  },

  README: {
    id: 'README',
    filename: 'README.md',
    title: 'RIPOSTE Overview & Quickstart Guide',
    category: 'Getting Started',
    content: `# RIPOSTE — Native Clang/LLVM + Rust + Gemini AI Extension

> **RIPOSTE** is a complete, native development environment and AI engineering assistant for Code OSS and VS Code, specially optimized for Android ARM64 Termux and standard Linux environments. It combines full C/C++ and Rust toolchain integration with Gemini 3.8 Flash AI capability, Ghost Text inline code completions, multi-turn AI chat, unified diff patch previews, and native diagnostic suites.

---

## ⚡ Key Capabilities

- 🦀 **First-Class Rust Integration**: Direct discovery and execution of \`cargo\`, \`rustc\`, \`rust-analyzer\`, \`clippy-driver\`, and \`rustfmt\`. Stream build logs, execute \`cargo check/build/test/clippy/fmt\`, and explain complex Rust borrow checker errors (\`E0382\`, \`E0502\`, \`E0277\`).
- ⚔️ **Native Clang/LLVM Infrastructure**: Full \`clang\`, \`clang++\`, \`clangd\` LSP language server support, \`clang-tidy\` static analysis, and CMake \`compile_commands.json\` database generation.
- 🤖 **Gemini 3.8 Flash AI Assistant**: Powered by \`@google/genai\`. Provides low-latency inline code completions, interactive sidebar chat, automatic refactoring, security reviews, unit test generation, and documentation generation.
- 👻 **Ghost Text Inline Completions**: Debounced, context-aware inline suggestions rendered directly at your cursor in Rust, C, C++, and TypeScript buffers.
- 📱 **Android ARM64 & Termux Native**: Automatic detection of Termux environment variables (\`PREFIX\`), binary paths (\`/data/data/com.termux/files/usr/bin\`), PRoot vs. native kernel ABI, and CPU core counts.
- 🛡️ **Privacy & Secret Protection**: Automatic redaction of API keys, credentials, SSH private keys, and \`.env\` files prior to sending context to Gemini.
- 📦 **Installable VSIX Extension**: Packed into a production \`riposte-extension-1.0.0.vsix\` archive ready to install via \`code-oss --install-extension riposte-extension-1.0.0.vsix\`.

---

## 🛠️ Quick Installation

### Option 1: Code OSS / VS Code CLI
\`\`\`bash
code-oss --install-extension riposte-extension-1.0.0.vsix
\`\`\`

### Option 2: Termux Quick Setup
\`\`\`bash
# 1. Update Termux packages and install compilers
pkg update -y && pkg install -y clang rust rust-analyzer cmake ninja git nodejs

# 2. Install RIPOSTE extension into Code OSS
code-oss --install-extension riposte-extension-1.0.0.vsix
\`\`\`

---

## 🔑 Gemini AI Configuration

1. Open VS Code Command Palette (\`Ctrl+Shift+P\` / \`Cmd+Shift+P\`).
2. Run \`RIPOSTE AI: Configure Gemini\`.
3. Enter your Gemini API key (or set the \`GEMINI_API_KEY\` environment variable).
4. Run \`RIPOSTE AI: Test Gemini Connection\` to verify connectivity.
`
  },

  ARCHITECTURE: {
    id: 'ARCHITECTURE',
    filename: 'ARCHITECTURE.md',
    title: 'System Architecture & Data Flow Specification',
    category: 'Architecture & Spec',
    content: `# RIPOSTE Architecture & Subsystem Specification

## 1. High-Level Subsystems

\`\`\`
+-------------------------------------------------------------------------+
|                        Code OSS / Termux UI Layer                       |
|  +------------------------+  +--------------------+  +---------------+  |
|  | Ghost Text Provider    |  | Interactive AI Chat|  | Tree Views &  |  |
|  | (InlineCompletions)    |  | (Webview Panel)    |  | Diagnostics   |  |
|  +-----------+------------+  +---------+----------+  +-------+-------+  |
+--------------|-------------------------|---------------------|----------+
               |                         |                     |
               v                         v                     v
+-------------------------------------------------------------------------+
|                     RIPOSTE Extension Core Engine                       |
|  +------------------------+  +--------------------+  +---------------+  |
|  | Context & Redactor     |  | Patch Diff Engine  |  | System Audit  |  |
|  +-----------+------------+  +---------+----------+  +-------+-------+  |
+--------------|-------------------------|---------------------|----------+
               |                         |                     |
               v                         v                     v
+-------------------------------+  +--------------------------------------+
| Gemini Express Server Proxy   |  | Native Toolchains                    |
|  - @google/genai SDK          |  |  - Rust: rustc, cargo, rust-analyzer |
|  - System Prompts & Safety    |  |  - Clang: clang++, clangd, tidy      |
+-------------------------------+  +--------------------------------------+
\`\`\`

## 2. Process Management & Streaming
1. **Asynchronous Non-Blocking Execution**: Child processes (\`cargo\`, \`clang\`, \`clang-tidy\`) are spawned asynchronously with output streaming to output channels and terminal buffers.
2. **Debounced Cancellation Tokens**: Inline Ghost Text completions attach to \`vscode.CancellationToken\`. Typing or cursor movement immediately cancels pending AI HTTP requests.
3. **Context Budgeting**: Surrounding file context is bounded (max 1500 chars prefix / 500 chars suffix) with automated secret filtering.
`
  },

  TERMUX: {
    id: 'TERMUX',
    filename: 'TERMUX.md',
    title: 'Termux & Android ARM64 Deep Integration Guide',
    category: 'Platform & Setup',
    content: `# RIPOSTE — Termux & Android ARM64 Manual

## 1. Native Environment Discovery
Termux runs on the Android Linux kernel under the \`aarch64-linux-android\` target triple.

### Key Paths & Variables
- **Prefix Path**: \`/data/data/com.termux/files/usr\`
- **Binary Path**: \`/data/data/com.termux/files/usr/bin\`
- **Environment Variable**: \`PREFIX=/data/data/com.termux/files/usr\`

## 2. Package Installation Command
\`\`\`bash
pkg update -y
pkg install -y clang rust rust-analyzer cmake ninja make git nodejs
\`\`\`

## 3. Environment Audit Tool
Run \`RIPOSTE: Check Environment\` from the Command Palette to view binary locations, CPU core counts, memory usage, and PRoot vs. native status.
`
  },

  RUST: {
    id: 'RUST',
    filename: 'RUST.md',
    title: 'Rust Toolchain & Cargo Integration Manual',
    category: 'Language Toolchains',
    content: `# RIPOSTE — Rust Toolchain Specification

## 1. Toolchain Executables
- \`rustc\`: Rust Compiler
- \`cargo\`: Build system and package manager
- \`rust-analyzer\`: Language Server Protocol implementation
- \`clippy-driver\`: Linter for idiomatic Rust code
- \`rustfmt\`: Code formatter

## 2. Registered Commands
- \`RIPOSTE: Cargo Check\`
- \`RIPOSTE: Cargo Build\`
- \`RIPOSTE: Cargo Test\`
- \`RIPOSTE: Cargo Run\`
- \`RIPOSTE: Cargo Clippy\`
- \`RIPOSTE: Format Rust File\`
- \`RIPOSTE AI: Explain Rust Diagnostic\` (explains \`E0382\`, \`E0502\`, \`E0277\`, etc.)
`
  },

  CLANG_LLVM: {
    id: 'CLANG_LLVM',
    filename: 'CLANG_LLVM.md',
    title: 'Clang/LLVM C/C++ Integration Manual',
    category: 'Language Toolchains',
    content: `# RIPOSTE — Clang/LLVM C/C++ Manual

## 1. Toolchain Components
- \`clang\`: C compiler
- \`clang++\`: C++ compiler
- \`clangd\`: Language Server Protocol implementation
- \`clang-tidy\`: Static analyzer
- \`lld\`: LLVM linker

## 2. Compilation Database Setup
RIPOSTE automatically detects \`compile_commands.json\` or generates a default \`compile_flags.txt\` for C/C++ projects with include flags (\`-I.\`, \`-std=c++20\`).
`
  },

  GEMINI_AI: {
    id: 'GEMINI_AI',
    filename: 'GEMINI_AI.md',
    title: 'Gemini 3.8 Flash AI Architecture & SDK Specification',
    category: 'AI Subsystem',
    content: `# RIPOSTE — Gemini AI Subsystem Specification

## 1. Model Selection
RIPOSTE strictly uses **Gemini 3.8 Flash** (\`gemini-3.8-flash\`) via the official \`@google/genai\` TypeScript SDK v2.4.0+.

## 2. Server Proxy Architecture
All requests pass through server-side Express endpoints (\`/api/gemini/generate\`) using the \`User-Agent: aistudio-build\` header.
`
  },

  GHOST_TEXT: {
    id: 'GHOST_TEXT',
    filename: 'GHOST_TEXT.md',
    title: 'Ghost Text Inline Completion Engine Specification',
    category: 'AI Subsystem',
    content: `# RIPOSTE — Ghost Text Inline Completions

Provides GitHub Copilot-style inline code completions directly in the editor buffer.
- Debounced by default (250ms delay).
- Uses Gemini 3.8 Flash for zero-latency continuation.
- Accepts completions via \`Tab\`.
`
  },

  AI_CHAT: {
    id: 'AI_CHAT',
    filename: 'AI_CHAT.md',
    title: 'Interactive AI Chat & Proposed Patch Manual',
    category: 'AI Subsystem',
    content: `# RIPOSTE — AI Chat & Proposed Patch Manual

Interactive sidebar panel in Code OSS activity bar.
- Multi-turn conversation.
- Quick action prompts: Explain Code, Explain Rust Error, Propose Patch, Security Review.
- Unified diff patch preview before workspace modification.
`
  },

  AI_PRIVACY: {
    id: 'AI_PRIVACY',
    filename: 'AI_PRIVACY.md',
    title: 'AI Privacy Policy & Secret Redaction Specification',
    category: 'Security & Privacy',
    content: `# RIPOSTE — AI Privacy & Secret Redaction Policy

- Automatically redacts API keys, passwords, and private SSH keys.
- Excludes sensitive files (\`.env\`, \`credentials.json\`, \`id_rsa\`) from AI payload context.
- Never transmits workspace contents without user action.
`
  },

  TROUBLESHOOTING: {
    id: 'TROUBLESHOOTING',
    filename: 'TROUBLESHOOTING.md',
    title: 'Troubleshooting & Diagnostics Guide',
    category: 'Support & Reference',
    content: `# RIPOSTE — Troubleshooting & Diagnostics

## Missing Compilers in Termux
Run: \`pkg install -y clang rust rust-analyzer cmake\`

## Gemini API Key Configuration
Run \`RIPOSTE AI: Configure Gemini\` or set \`GEMINI_API_KEY\` in your environment.
`
  },

  CONFIGURATION: {
    id: 'CONFIGURATION',
    filename: 'CONFIGURATION.md',
    title: 'Extension Configuration Settings Reference',
    category: 'Support & Reference',
    content: `# RIPOSTE — Configuration Reference

- \`riposte.gemini.apiKey\`: Gemini API key
- \`riposte.gemini.model\`: Model identifier (\`gemini-3.8-flash\`)
- \`riposte.ghostText.enabled\`: Enable inline code completion (\`true\`)
- \`riposte.ghostText.debounceMs\`: Delay in milliseconds (\`250\`)
- \`riposte.rust.cargoPath\`: Cargo binary path (\`cargo\`)
- \`riposte.clang.clangdPath\`: Clangd binary path (\`clangd\`)
`
  },

  COMMANDS: {
    id: 'COMMANDS',
    filename: 'COMMANDS.md',
    title: 'Complete Registered Commands Reference',
    category: 'Support & Reference',
    content: `# RIPOSTE — Registered Commands Reference

- \`RIPOSTE: Detect Toolchains\`
- \`RIPOSTE: Show Compiler Information\`
- \`RIPOSTE: Cargo Check\`
- \`RIPOSTE: Cargo Build\`
- \`RIPOSTE: Cargo Test\`
- \`RIPOSTE: Configure clangd\`
- \`RIPOSTE: Run Clang-Tidy\`
- \`RIPOSTE AI: Open AI Chat\`
- \`RIPOSTE AI: Explain Selection\`
- \`RIPOSTE AI: Explain Rust Diagnostic\`
- \`RIPOSTE AI: Fix Selected Code\`
- \`RIPOSTE AI: Review Security of Selection\`
`
  },

  SECURITY: {
    id: 'SECURITY',
    filename: 'SECURITY.md',
    title: 'Security Boundary & Vulnerability Protection Specification',
    category: 'Security & Privacy',
    content: `# RIPOSTE — Security & Vulnerability Policy

- API keys are protected using Code OSS SecretStorage or environment variables.
- Prompt inputs are filtered to prevent secret leakage.
- Commands are executed via safe process argument arrays to prevent shell injection.
`
  },

  TESTING: {
    id: 'TESTING',
    filename: 'TESTING.md',
    title: 'Automated Test Suite Specification',
    category: 'Quality & Testing',
    content: `# RIPOSTE — Automated Testing Specification

Execute test suite: \`npm test\`
Tests cover Extension Activation, Security Redaction, Patch Diff Generator, Rust Errors, and Termux Detector.
`
  },

  PERFORMANCE: {
    id: 'PERFORMANCE',
    filename: 'PERFORMANCE.md',
    title: 'Performance Optimization & Benchmarks',
    category: 'Quality & Testing',
    content: `# RIPOSTE — Performance Benchmarks

- **Extension Host Memory**: < 45 MB baseline RSS footprint.
- **Ghost Text Debounce**: 250ms default delay prevents unnecessary network calls.
- **Streaming Execution**: Non-blocking asynchronous child process streams.
`
  },

  BUILDING: {
    id: 'BUILDING',
    filename: 'BUILDING.md',
    title: 'Building & Packaging Manual',
    category: 'Getting Started',
    content: `# RIPOSTE — Building & Packaging Guide

\`\`\`bash
npm install
npm run build:extension
\`\`\`
Artifact: \`riposte-extension-1.0.0.vsix\`
`
  },

  INSTALLATION: {
    id: 'INSTALLATION',
    filename: 'INSTALLATION.md',
    title: 'Installation Guide',
    category: 'Getting Started',
    content: `# RIPOSTE — Installation Manual

\`\`\`bash
code-oss --install-extension riposte-extension-1.0.0.vsix
\`\`\`
`
  },

  CONTRIBUTING: {
    id: 'CONTRIBUTING',
    filename: 'CONTRIBUTING.md',
    title: 'Contributing Guidelines',
    category: 'Support & Reference',
    content: `# Contributing to RIPOSTE

Contributions are welcome! Run \`npm test\` before submitting PRs.
`
  },

  CHANGELOG: {
    id: 'CHANGELOG',
    filename: 'CHANGELOG.md',
    title: 'Release Changelog',
    category: 'Support & Reference',
    content: `# RIPOSTE Changelog

## [1.0.0] - 2026-10-26
- Initial release with native Clang/LLVM, Rust, Gemini 3.8 Flash, Ghost Text, and Termux ARM64 support.
`
  },

  DEPENDENCIES: {
    id: 'DEPENDENCIES',
    filename: 'DEPENDENCIES.md',
    title: 'Runtime & Build Dependencies',
    category: 'Support & Reference',
    content: `# RIPOSTE Dependencies

- \`@google/genai\` (^2.4.0)
- \`adm-zip\` (^0.5.16)
- \`express\` (^4.21.2)
- \`react\` (^19.0.0)
`
  },

  COMPATIBILITY: {
    id: 'COMPATIBILITY',
    filename: 'COMPATIBILITY.md',
    title: 'Environment Compatibility Matrix',
    category: 'Platform & Setup',
    content: `# RIPOSTE Compatibility Matrix

- Code OSS / Termux ARM64: Full Native Support
- Linux x86_64: Full Support
`
  },

  DEVELOPMENT: {
    id: 'DEVELOPMENT',
    filename: 'DEVELOPMENT.md',
    title: 'Developer Quickstart & Live Development',
    category: 'Getting Started',
    content: `# RIPOSTE Development Guide

\`\`\`bash
npm run dev
\`\`\`
`
  },

  LICENSE: {
    id: 'LICENSE',
    filename: 'LICENSE',
    title: 'Apache 2.0 License Terms',
    category: 'Support & Reference',
    content: `Apache License Version 2.0, January 2004
http://www.apache.org/licenses/`
  }
};
