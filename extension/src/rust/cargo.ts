import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface CargoMetadata {
  workspaceRoot: string;
  packages: Array<{
    name: string;
    version: string;
    manifestPath: string;
    targets: Array<{ name: string; kind: string[] }>;
  }>;
}

export class CargoManager {
  private cargoPath: string;

  constructor(cargoPath: string = 'cargo') {
    this.cargoPath = cargoPath;
  }

  public isCargoWorkspace(cwd: string): boolean {
    return fs.existsSync(path.join(cwd, 'Cargo.toml'));
  }

  public getMetadata(cwd: string): CargoMetadata | null {
    if (!this.isCargoWorkspace(cwd)) return null;
    try {
      const output = execSync(`"${this.cargoPath}" metadata --format-version 1 --no-deps`, { cwd, encoding: 'utf-8', timeout: 5000 });
      const raw = JSON.parse(output);
      return {
        workspaceRoot: raw.workspace_root,
        packages: raw.packages.map((p: any) => ({
          name: p.name,
          version: p.version,
          manifestPath: p.manifest_path,
          targets: p.targets.map((t: any) => ({ name: t.name, kind: t.kind }))
        }))
      };
    } catch {
      return null;
    }
  }

  public async runCargoCommand(command: 'check' | 'build' | 'test' | 'clippy' | 'fmt', cwd: string, onData?: (chunk: string) => void): Promise<{ exitCode: number; output: string }> {
    return new Promise((resolve) => {
      let fullOutput = '';
      const args = command === 'clippy' ? ['clippy'] : command === 'fmt' ? ['fmt'] : [command];
      const proc = spawn(this.cargoPath, args, { cwd, shell: true });

      proc.stdout.on('data', (data) => {
        const text = data.toString();
        fullOutput += text;
        if (onData) onData(text);
      });

      proc.stderr.on('data', (data) => {
        const text = data.toString();
        fullOutput += text;
        if (onData) onData(text);
      });

      proc.on('close', (code) => {
        resolve({ exitCode: code ?? 1, output: fullOutput });
      });

      proc.on('error', (err) => {
        const errMsg = `Failed to start cargo: ${err.message}`;
        fullOutput += errMsg;
        if (onData) onData(errMsg);
        resolve({ exitCode: 127, output: fullOutput });
      });
    });
  }

  public static getRustErrorExplanation(errorCode: string): string {
    const code = errorCode.toUpperCase();
    const commonExplanations: Record<string, string> = {
      'E0382': 'E0382 occurs when a value is used after being moved to another variable or function. In Rust, types that do not implement Copy transfer ownership upon assignment or parameter passing. Resolution: Use .clone(), pass by reference (&), or derive Copy on the struct.',
      'E0502': 'E0502 occurs when a mutable borrow exists while an immutable borrow is still active in the same scope. Rust aliasing rules enforce either one mutable reference XOR multiple immutable references. Resolution: End the lifetime of the immutable borrow before mutably borrowing.',
      'E0308': 'E0308 represents a mismatched types error. The compiler expected one concrete type but encountered a different type. Resolution: Ensure function return signatures, assignments, and match arms evaluate to compatible types.'
    };

    return commonExplanations[code] || `Rust Compiler Error ${code}: Check official Rust Error Index (https://doc.rust-lang.org/error_codes/${code}.html) for detailed diagnostics.`;
  }
}
