# RIPOSTE — Gemini AI Architecture & SDK Specification

## Model Selection
RIPOSTE utilizes **Gemini 3.8 Flash** (`gemini-3.8-flash`) via `@google/genai` v2.4.0+.

## Capabilities
1. **Ghost Text Inline Completions**: Low-latency code completions at cursor.
2. **Multi-Turn Interactive Chat**: Code refactoring, error debugging, unit test generation.
3. **Patch Preview & Diff Engine**: Preview proposed AI edits before applying changes.
