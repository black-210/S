# RIPOSTE — Clang & LLVM C/C++ Integration

## Core Features
- `clangd`: Modern LSP server for C, C++, Objective-C, and Objective-C++
- `clang-tidy`: Static analysis linter
- Compilation Databases: Auto-detects `compile_commands.json` or generates `compile_flags.txt` for CMake and Make builds

## Commands
- `RIPOSTE: Configure clangd`: Sets up LSP flags and include pathways
- `RIPOSTE: Generate Compilation Database`: Runs CMake export or generates default flags
- `RIPOSTE: Run Clang-Tidy`: Runs static checks on active document
