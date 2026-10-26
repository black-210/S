# RIPOSTE — Building & Packaging Guide

## Prerequisites
- Node.js 20+ and npm
- TypeScript & tsx

## Build Steps
1. Install dependencies:
   ```bash
   npm install
   ```
2. Build extension bundle and assemble VSIX package:
   ```bash
   npm run build:extension
   ```
3. Output artifact will be created in workspace root:
   `riposte-extension-1.0.0.vsix`

## Automated Tests
Run unit and integration tests:
```bash
npm test
```
