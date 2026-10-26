import { TermuxDetector } from './termux/detector.js';
import { CargoManager } from './rust/cargo.js';
import { ClangManager } from './clang/clangd.js';
import { GeminiClient } from './gemini/client.js';
import { GhostTextEngine } from './ghostText/provider.js';
import { PatchEngine } from './patch/patchEngine.js';
import { SecurityRedactor } from './security/redactor.js';

export class RiposteExtensionHost {
  private detector: TermuxDetector;
  private cargo: CargoManager;
  private clang: ClangManager;
  private gemini: GeminiClient;
  private ghostText: GhostTextEngine;

  constructor(baseUrl: string = '', apiKey?: string) {
    this.detector = new TermuxDetector();
    this.cargo = new CargoManager();
    this.clang = new ClangManager();
    this.gemini = new GeminiClient(baseUrl, apiKey);
    this.ghostText = new GhostTextEngine(this.gemini);
  }

  public activate() {
    const report = TermuxDetector.detectEnvironment();
    return {
      status: 'active',
      extensionName: 'riposte-extension',
      version: '1.0.0',
      environmentReport: report,
      registeredCommands: [
        'riposte.detectToolchains',
        'riposte.showCompilerInfo',
        'riposte.cargoCheck',
        'riposte.cargoBuild',
        'riposte.cargoTest',
        'riposte.clangdConfigure',
        'riposte.runClangTidy',
        'riposte.ai.openChat',
        'riposte.ai.explainSelection',
        'riposte.ai.explainRustError',
        'riposte.ai.fixSelectedCode',
        'riposte.ai.reviewSecurity'
      ]
    };
  }

  public getGeminiClient() {
    return this.gemini;
  }

  public getCargoManager() {
    return this.cargo;
  }

  public getClangManager() {
    return this.clang;
  }

  public getGhostTextEngine() {
    return this.ghostText;
  }
}

// Default export / activation function
export function activate(context?: any) {
  const host = new RiposteExtensionHost();
  return host.activate();
}
