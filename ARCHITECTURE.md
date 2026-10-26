# RIPOSTE — Extension Architecture

## 1. System Overview
RIPOSTE connects three core systems:
1. **VS Code / Code OSS Extension Host Layer** (`/extension`): Language intelligence handlers, inline completion provider, webview view provider, command dispatcher.
2. **Native Language Toolchain Layer** (Clang/LLVM + Rust): Asynchronous process execution for `cargo`, `rustc`, `rust-analyzer`, `clang`, `clang++`, `clangd`, and `clang-tidy`.
3. **Gemini AI Engine Layer**: `@google/genai` on Express backend providing low-latency streaming completions, multi-turn chat, patch previews, and diagnostic explanations.

```
+-------------------------------------------------------------------+
|                        Code OSS / Termux UI                       |
|   +---------------------+  +-----------------+  +--------------+  |
|   | Ghost Text Provider |  | AI Chat Webview |  | Commands/LS  |  |
|   +----------+----------+  +--------+--------+  +-------+------+  |
+--------------|----------------------|-------------------|---------+
               |                      |                   |
               v                      v                   v
+-------------------------------------------------------------------+
|                   RIPOSTE Extension Host API                      |
|  +----------------------+  +------------------+  +-------------+  |
|  | Context & Redactor   |  | Patch Diff Engine|  | System Audit|  |
|  +----------+-----------+  +--------+---------+  +------+------+  |
+-------------|-----------------------|-------------------|---------+
              |                       |                   |
              v                       v                   v
+-----------------------------+  +----------------------------------+
| Express / Gemini AI Server  |  | Native System Toolchains         |
|  - Gemini 3.8 Flash SDK     |  |  - Rust: cargo, rustc, analyzer  |
|  - System Prompts & Safety  |  |  - Clang: clang++, clangd, tidy  |
+-----------------------------+  +----------------------------------+
```

## 2. Process & Memory Management
- **Non-blocking Execution**: All child processes (`cargo`, `clang`, `clang-tidy`) use Node `spawn` with streaming stdout/stderr buffers and a configurable execution timeout (5,000ms default).
- **Cancellation Tokens**: Inline Ghost Text completions attach to VS Code `CancellationToken`s. Typing cancels pending network requests immediately to conserve bandwidth.
- **Context Budgeting**: Context sent to Gemini is bounded (max 2000 lines prefix/suffix) with secret filtering applied prior to network dispatch.
