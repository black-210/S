import { GeminiClient } from '../gemini/client.js';

export class BlueGhostCompletionEngine {
  private geminiClient: GeminiClient;

  constructor(client: GeminiClient) {
    this.geminiClient = client;
  }

  /**
   * Generates blue-styled inline completions for C, C++, and Rust
   */
  public async generateBlueCompletion(
    prefix: string,
    suffix: string,
    languageId: string
  ): Promise<{ text: string; isBlueDecoration: true; category: string }> {
    const lang = languageId.toLowerCase();
    
    // Quick local rule prediction for C/C++ headers
    if (lang === 'c' || lang === 'cpp') {
      if (prefix.trim().endsWith('std::vec')) {
        return { text: 'tor<int> numbers = {1, 2, 3};', isBlueDecoration: true, category: 'C++ STL Suggestion' };
      }
      if (prefix.trim().endsWith('#include <str')) {
        return { text: 'ing>\n#include <vector>\n#include <iostream>', isBlueDecoration: true, category: 'C++ Header Completion' };
      }
      if (prefix.trim().endsWith('std::cout <<')) {
        return { text: ' "Hello from RIPOSTE C++!" << std::endl;', isBlueDecoration: true, category: 'C++ I/O Stream' };
      }
    }

    // Quick local rule prediction for Rust
    if (lang === 'rust') {
      if (prefix.trim().endsWith('use std::col')) {
        return { text: 'lections::HashMap;', isBlueDecoration: true, category: 'Rust Std Import' };
      }
      if (prefix.trim().endsWith('match n {')) {
        return { text: '\n        0 => 0,\n        1 => 1,\n        _ => calculate_fibonacci(n - 1) + calculate_fibonacci(n - 2),\n    }', isBlueDecoration: true, category: 'Rust Pattern Match' };
      }
    }

    // Fallback to Gemini 3.8 Flash AI Completion
    const completion = await this.geminiClient.generateInlineGhostText(prefix, suffix, languageId);
    return {
      text: completion || '/* RIPOSTE Blue Inline Completion */',
      isBlueDecoration: true,
      category: 'AI Generated Ghost Text'
    };
  }
}
