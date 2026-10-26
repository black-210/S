# RIPOSTE — Installation Guide

## Code OSS & VS Code
1. Open terminal in Code OSS or VS Code.
2. Run command:
   ```bash
   code-oss --install-extension riposte-extension-1.0.0.vsix
   ```
3. Reload extension host (`Ctrl+Shift+P` -> `Developer: Reload Window`).

## Termux Android Setup
1. Update Termux packages:
   ```bash
   pkg update -y
   pkg install -y clang rust rust-analyzer cmake ninja nodejs git
   ```
2. Install extension into Code OSS:
   ```bash
   code-oss --install-extension riposte-extension-1.0.0.vsix
   ```
