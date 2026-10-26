import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';

export interface ToolchainStatus {
  name: string;
  path: string | null;
  installed: boolean;
  version: string | null;
}

export interface EnvironmentReport {
  isTermux: boolean;
  isProot: boolean;
  isArm64: boolean;
  arch: string;
  platform: string;
  termuxPrefix: string | null;
  termuxVersion: string | null;
  cpuModel: string;
  tools: {
    rustc: ToolchainStatus;
    cargo: ToolchainStatus;
    rustAnalyzer: ToolchainStatus;
    clippy: ToolchainStatus;
    rustfmt: ToolchainStatus;
    clang: ToolchainStatus;
    clangpp: ToolchainStatus;
    clangd: ToolchainStatus;
    lld: ToolchainStatus;
    clangTidy: ToolchainStatus;
    cmake: ToolchainStatus;
    ninja: ToolchainStatus;
    make: ToolchainStatus;
    git: ToolchainStatus;
    node: ToolchainStatus;
  };
}

export class TermuxDetector {
  public static detectEnvironment(): EnvironmentReport {
    const arch = process.arch;
    const platform = process.platform;
    const isArm64 = arch === 'arm64' || (arch as string) === 'aarch64';
    
    const termuxPrefix = process.env.PREFIX || (fs.existsSync('/data/data/com.termux/files/usr') ? '/data/data/com.termux/files/usr' : null);
    const isTermux = Boolean(process.env.TERMUX_VERSION || termuxPrefix);
    const termuxVersion = process.env.TERMUX_VERSION || null;

    let isProot = false;
    try {
      if (fs.existsSync('/proc/self/status')) {
        const status = fs.readFileSync('/proc/self/status', 'utf-8');
        if (status.includes('proot') || status.includes('tracer')) {
          isProot = true;
        }
      }
    } catch {
      // Ignore read errors
    }

    let cpuModel = 'Unknown CPU';
    try {
      const cpus = os.cpus();
      if (cpus && cpus.length > 0) {
        cpuModel = `${cpus[0].model} (${cpus.length} cores)`;
      }
    } catch {
      // Fallback
    }

    // Bin search helper
    const checkTool = (name: string, customPath?: string): ToolchainStatus => {
      const searchPaths = [
        customPath,
        termuxPrefix ? path.join(termuxPrefix, 'bin', name) : null,
        `/data/data/com.termux/files/usr/bin/${name}`,
        `/usr/bin/${name}`,
        `/usr/local/bin/${name}`
      ].filter(Boolean) as string[];

      for (const p of searchPaths) {
        if (fs.existsSync(p)) {
          let version: string | null = null;
          try {
            const out = execSync(`"${p}" --version`, { encoding: 'utf-8', timeout: 3000 });
            version = out.trim().split('\n')[0];
          } catch {
            version = 'Executable found';
          }
          return { name, path: p, installed: true, version };
        }
      }

      // Check PATH via which
      try {
        const p = execSync(`which ${name}`, { encoding: 'utf-8', timeout: 2000 }).trim();
        if (p && fs.existsSync(p)) {
          let version: string | null = null;
          try {
            const out = execSync(`"${p}" --version`, { encoding: 'utf-8', timeout: 3000 });
            version = out.trim().split('\n')[0];
          } catch {
            version = 'Executable found';
          }
          return { name, path: p, installed: true, version };
        }
      } catch {
        // Not found
      }

      return { name, path: null, installed: false, version: null };
    };

    return {
      isTermux,
      isProot,
      isArm64,
      arch,
      platform,
      termuxPrefix,
      termuxVersion,
      cpuModel,
      tools: {
        rustc: checkTool('rustc'),
        cargo: checkTool('cargo'),
        rustAnalyzer: checkTool('rust-analyzer'),
        clippy: checkTool('clippy-driver'),
        rustfmt: checkTool('rustfmt'),
        clang: checkTool('clang'),
        clangpp: checkTool('clang++'),
        clangd: checkTool('clangd'),
        lld: checkTool('lld'),
        clangTidy: checkTool('clang-tidy'),
        cmake: checkTool('cmake'),
        ninja: checkTool('ninja'),
        make: checkTool('make'),
        git: checkTool('git'),
        node: checkTool('node')
      }
    };
  }
}
