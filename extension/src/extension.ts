import { TermuxDetector } from './termux/detector.js';
import { CargoManager } from './rust/cargo.js';
import { ClangManager } from './clang/clangd.js';
import { GeminiClient } from './gemini/client.js';
import { GhostTextEngine } from './ghostText/provider.js';
import { BlueGhostCompletionEngine } from './ghostText/blueGhostEngine.js';
import { ErrorFixerEngine } from './autofix/errorFixerEngine.js';
import { CPP_STANDARD_HEADERS, POPULAR_CPP_LIBRARIES } from './knowledge/cppLibraries.js';
import { RUST_STANDARD_MODULES, POPULAR_RUST_CRATES } from './knowledge/rustLibraries.js';

export class RiposteExtensionHost {
  private detector: TermuxDetector;
  private cargo: CargoManager;
  private clang: ClangManager;
  private gemini: GeminiClient;
  private ghostText: GhostTextEngine;
  private blueGhostEngine: BlueGhostCompletionEngine;

  constructor(baseUrl: string = '', apiKey?: string) {
    this.detector = new TermuxDetector();
    this.cargo = new CargoManager();
    this.clang = new ClangManager();
    this.gemini = new GeminiClient(baseUrl, apiKey);
    this.ghostText = new GhostTextEngine(this.gemini);
    this.blueGhostEngine = new BlueGhostCompletionEngine(this.gemini);
  }

  public activate() {
    const report = TermuxDetector.detectEnvironment();
    return {
      status: 'active',
      extensionName: 'riposte-extension',
      version: '1.0.0',
      environmentReport: report,
      supportedLanguages: ['c', 'cpp', 'objective-c', 'objective-cpp', 'rust'],
      knowledgeBase: {
        cppHeadersCount: CPP_STANDARD_HEADERS.length,
        cppLibrariesCount: POPULAR_CPP_LIBRARIES.length,
        rustStdModulesCount: RUST_STANDARD_MODULES.length,
        rustCratesCount: POPULAR_RUST_CRATES.length
      },
      registeredCommands: [
        'riposte.detectToolchains',
        'riposte.showCompilerInfo',
        'riposte.cargoCheck',
        'riposte.cargoBuild',
        'riposte.cargoTest',
        'riposte.clangdConfigure',
        'riposte.runClangTidy',
        'riposte.autoFixAllErrors',
        'riposte.ai.openChat',
        'riposte.ai.explainSelection',
        'riposte.ai.explainRustError',
        'riposte.ai.fixSelectedCode',
        'riposte.ai.reviewSecurity'
      ]
    };
  }

  public getGeminiClient() { return this.gemini; }
  public getCargoManager() { return this.cargo; }
  public getClangManager() { return this.clang; }
  public getBlueGhostEngine() { return this.blueGhostEngine; }
  public getErrorFixerEngine() { return ErrorFixerEngine; }
}

export function activate(context?: any) {
  const host = new RiposteExtensionHost();
  return host.activate();
}
