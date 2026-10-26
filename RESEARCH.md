# RIPOSTE — Research & Technical Specification

## 1. Overview & Verification Summary
- **Document Version**: 1.0.0
- **Access Date**: October 2026
- **Primary Targets**: Code OSS (VS Code extension host v1.85+), Termux on Android ARM64 (`aarch64-linux-android`), Linux x86_64 / glibc / musl.
- **AI Subsystem**: Gemini 3.8 Flash (`@google/genai` v2.4.0+), server-side Express API proxy, real streaming, Ghost Text inline completion, multi-turn chat, patch previews.
- **Languages**: Rust (`rustc`, `cargo`, `rust-analyzer`, `clippy-driver`, `rustfmt`) and C/C++ (`clang`, `clang++`, `clangd`, `lld`, `clang-tidy`).

---

## 2. Clang/LLVM Technical Investigation
- **Source Documents**:
  - LLVM Clang Documentation: `https://clang.llvm.org/docs/`
  - Clangd Language Server Specification: `https://clangd.llvm.org/`
  - JSON Compilation Database Format: `https://clangd.llvm.org/design/compile-commands`
- **Key Findings**:
  - `clangd` relies on `compile_commands.json` or `compile_flags.txt` placed in project root or build directory.
  - Generates full LSP diagnostics, code completions, formatting (`clang-format`), and symbol renaming.
  - In Termux (`aarch64`), `clangd` is available via `pkg install clang` or `pkg install clangd`.
  - Binary path in Termux: `/data/data/com.termux/files/usr/bin/clangd` or `/data/data/com.termux/files/usr/bin/clang`.

---

## 3. Rust Toolchain Technical Investigation
- **Source Documents**:
  - Rust Official Documentation: `https://doc.rust-lang.org/`
  - Cargo Manual: `https://doc.rust-lang.org/cargo/`
  - rust-analyzer Manual: `https://rust-analyzer.github.io/manual.html`
  - Rust Compiler Error Index: `https://doc.rust-lang.org/error_codes/`
- **Key Findings**:
  - `rust-analyzer` acts as the primary LSP server for Rust language intelligence.
  - Cargo metadata (`cargo metadata --format-version 1`) provides workspace structure, member crates, and dependency graphs.
  - Rust error codes (e.g. `E0382` borrow of moved value, `E0502` mutable borrow conflict) have detailed explanatory documentation accessible programmatically.
  - Termux Rust environment: `pkg install rust rust-analyzer` places `cargo`, `rustc`, `rust-analyzer`, `clippy-driver`, and `rustfmt` in `/data/data/com.termux/files/usr/bin/`.

---

## 4. Code OSS & VS Code Extension API Investigation
- **Source Documents**:
  - VS Code Extension API Reference: `https://code.visualstudio.com/api/references/vscode-api`
  - Inline Completion Provider API: `vscode.languages.registerInlineCompletionItemProvider`
  - Webview View Provider API: `vscode.window.registerWebviewViewProvider`
  - SecretStorage API: `vscode.ExtensionContext.secrets`
- **Key Findings**:
  - Ghost Text requires registering an `InlineCompletionItemProvider`. Items must be debounced (150ms-300ms) to avoid quota exhaustion.
  - Cancelation tokens (`vscode.CancellationToken`) must terminate pending AI HTTP calls immediately upon typing or cursor repositioning.
  - Patch previews use standard git-diff format or VS Code multi-file workspace edits.

---

## 5. Gemini AI SDK (@google/genai) Investigation
- **Source Documents**:
  - Google GenAI SDK Specs: `@google/genai` v2.4.0
  - Recommended Model for Code & Reasoning: `gemini-3.8-flash`
  - User-Agent Header telemetry requirement: `httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }`
- **Key Findings**:
  - Gemini API calls MUST be executed server-side to protect credentials and handle context truncation.
  - `ai.models.generateContent` returns a `GenerateContentResponse` with property `.text` (not a function).
  - System instructions should explicitly specify code formatting constraints (e.g. raw code blocks, no markdown commentary in ghost text).

---

## 6. Termux & Android ARM64 Compatibility
- **Environment Detection**:
  - Check `process.env.TERMUX_VERSION` or path prefix `/data/data/com.termux/files/usr/`.
  - Architecture verified via `process.arch === 'arm64'` or `uname -m` returning `aarch64`.
  - `proot` vs native environment verified via checking `/proc/version` or `/proc/self/status`.
- **Package Management**:
  - `pkg install clang rust rust-analyzer cmake ninja`
