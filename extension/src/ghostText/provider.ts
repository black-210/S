import { GeminiClient } from '../gemini/client.js';

export interface InlineCompletionRequest {
  documentText: string;
  cursorOffset: number;
  languageId: string;
}

export class GhostTextEngine {
  private client: GeminiClient;
  private debounceTimer: any = null;

  constructor(client: GeminiClient) {
    this.client = client;
  }

  public async requestCompletion(req: InlineCompletionRequest, debounceMs: number = 250): Promise<string> {
    return new Promise((resolve) => {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(async () => {
        const prefix = req.documentText.slice(Math.max(0, req.cursorOffset - 1500), req.cursorOffset);
        const suffix = req.documentText.slice(req.cursorOffset, req.cursorOffset + 500);

        const completion = await this.client.generateInlineGhostText(prefix, suffix, req.languageId);
        resolve(completion);
      }, debounceMs);
    });
  }
}
