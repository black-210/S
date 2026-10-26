import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export class ClangManager {
  private clangPath: string;
  private clangdPath: string;

  constructor(clangPath: string = 'clang', clangdPath: string = 'clangd') {
    this.clangPath = clangPath;
    this.clangdPath = clangdPath;
  }

  public findCompilationDatabase(cwd: string): string | null {
    const candidates = [
      path.join(cwd, 'compile_commands.json'),
      path.join(cwd, 'build', 'compile_commands.json'),
      path.join(cwd, 'out', 'compile_commands.json'),
      path.join(cwd, 'compile_flags.txt')
    ];

    for (const c of candidates) {
      if (fs.existsSync(c)) return c;
    }
    return null;
  }

  public generateCompilationDatabase(cwd: string): { success: boolean; path: string | null; message: string } {
    if (fs.existsSync(path.join(cwd, 'CMakeLists.txt'))) {
      try {
        const buildDir = path.join(cwd, 'build');
        if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });
        execSync(`cmake -B "${buildDir}" -DCMAKE_EXPORT_COMPILE_COMMANDS=ON`, { cwd, timeout: 10000 });
        const generated = path.join(buildDir, 'compile_commands.json');
        if (fs.existsSync(generated)) {
          return { success: true, path: generated, message: 'compile_commands.json generated via CMake' };
        }
      } catch (err: any) {
        return { success: false, path: null, message: `CMake execution failed: ${err?.message}` };
      }
    }

    // Fallback: create basic compile_flags.txt if headers/C files exist
    try {
      const flagsPath = path.join(cwd, 'compile_flags.txt');
      const defaultFlags = `-I.\n-Iinclude\n-std=c++20\n-Wall\n-Wextra\n`;
      fs.writeFileSync(flagsPath, defaultFlags, 'utf-8');
      return { success: true, path: flagsPath, message: 'Created default compile_flags.txt' };
    } catch (err: any) {
      return { success: false, path: null, message: `Failed to create compile_flags.txt: ${err?.message}` };
    }
  }

  public async runClangTidy(filePath: string, cwd: string): Promise<{ exitCode: number; output: string }> {
    return new Promise((resolve) => {
      let output = '';
      const proc = spawn('clang-tidy', [filePath, '--'], { cwd, shell: true });

      proc.stdout.on('data', d => output += d.toString());
      proc.stderr.on('data', d => output += d.toString());

      proc.on('close', code => resolve({ exitCode: code ?? 0, output }));
      proc.on('error', err => resolve({ exitCode: 127, output: `clang-tidy failed: ${err.message}` }));
    });
  }
}
