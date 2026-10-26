# RIPOSTE — Native Clang/LLVM + Rust + Gemini AI Extension for Code OSS & Termux

> **RIPOSTE** is a professional, high-performance extension for Code OSS and VS Code, specially engineered for native execution on Android ARM64 Termux and standard Linux environments. It integrates full C/C++ (Clang/LLVM, clangd, clang-tidy) and Rust (rustc, Cargo, rust-analyzer, Clippy) toolchains with real Gemini 3.8 Flash AI capability—providing Ghost Text inline completions, multi-turn AI chat, smart patch previews, and comprehensive diagnostic suites.

---

## ⚡ Highlights

- 🦀 **Complete Rust Ecosystem Integration**: Automatic discovery of `cargo`, `rustc`, `rust-analyzer`, `clippy-driver`, and `rustfmt`. Inspect workspace metadata, run `cargo check/build/test`, and explain complex Rust ownership/lifetime errors (e.g. `E0382`, `E0502`).
- ⚔️ **Complete Clang/LLVM Environment**: Native `clang`, `clang++`, `clangd` LSP integration, `clang-tidy` static analysis, and automatic `compile_commands.json` generation for CMake/Make projects.
- 🤖 **Genuine Gemini 3.8 Flash AI Assistant**: Powered by `@google/genai`. Provides fast inline completions, multi-turn interactive chat, automatic code refactoring, security reviews, and unit test generation.
- 👻 **Ghost Text (Copilot-Style Inline Completions)**: Debounced, context-aware code completions rendered right at your cursor in Rust, C, C++, and TypeScript.
- 📱 **First-Class Termux & Android ARM64 Support**: Detects native Termux environments (`/data/data/com.termux/files/usr/bin`), proot containers, system ABI, installed packages, and ARM64 architecture specs.
- 🛡️ **Privacy & Secret Redaction**: Automatically filters secrets, `.env` files, API keys, and private SSH keys from AI context payloads.
- 📦 **Standalone Installable VSIX**: Fully packaged, production-ready `.vsix` extension ready to install via `code-oss --install-extension riposte-extension-1.0.0.vsix`.

---

## 🛠️ Installation

### Option 1: Quick Install via Code OSS CLI
```bash
code-oss --install-extension riposte-extension-1.0.0.vsix
```

### Option 2: Termux Quick Setup
```bash
# Update packages and install native compilers
pkg update && pkg install -y clang rust rust-analyzer cmake ninja git nodejs

# Install RIPOSTE extension into Code OSS
code-oss --install-extension riposte-extension-1.0.0.vsix
```

---

## 🔑 AI Configuration (Gemini API)

1. Open VS Code / Code OSS Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Run `RIPOSTE AI: Configure Gemini`.
3. Provide your Gemini API key (or let it read from system secrets / environment `GEMINI_API_KEY`).
4. Run `RIPOSTE AI: Test Gemini Connection` to verify active connectivity to Gemini 3.8 Flash.

---

## 📦 Registered Commands Quick Reference

| Command ID | Feature Description |
| :--- | :--- |
| `riposte.detectToolchains` | Detect and audit installed Rust and Clang toolchains |
| `riposte.cargoCheck` | Execute `cargo check` on current workspace |
| `riposte.cargoBuild` | Execute `cargo build` with streaming output |
| `riposte.cargoTest` | Execute `cargo test` and report results |
| `riposte.clangdConfigure` | Configure `clangd` LSP and compilation databases |
| `riposte.ai.openChat` | Open the interactive RIPOSTE AI sidebar chat |
| `riposte.ai.explainSelection` | Explain highlighted code snippet with Gemini |
| `riposte.ai.explainRustError` | Explain Rust compiler diagnostic or error code |
| `riposte.ai.fixSelectedCode` | Propose AI fix with live diff patch preview |
| `riposte.ai.reviewSecurity` | Run security & vulnerability inspection on selection |

---

## 📄 License
Licensed under Apache 2.0.
