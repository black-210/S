# RIPOSTE — Termux & Android ARM64 Optimization Guide

## Architecture Overview
Termux runs natively on Android Linux kernels using `aarch64-linux-android` ABI.

## Toolchain Paths in Termux
- Binaries reside in `/data/data/com.termux/files/usr/bin/`
- Prefix environment variable: `PREFIX=/data/data/com.termux/files/usr`

## Recommended Packages
```bash
pkg install -y clang rust rust-analyzer cmake ninja make git nodejs
```

## Diagnostics Command
Run `RIPOSTE: Check Environment` inside Code OSS to inspect native ABI compatibility, proot status, and CPU core counts.
