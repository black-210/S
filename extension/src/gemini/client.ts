import { SecurityRedactor } from '../security/redactor.js';

export interface GeminiRequestOptions {
  prompt: string;
  systemInstruction?: string;
  codeContext?: string;
  language?: string;
  model?: string;
  temperature?: number;
}

export interface GeminiResponse {
  success: boolean;
  text: string;
  error?: string;
  modelUsed: string;
}

export class GeminiClient {
  private apiKey: string | null = null;
  private baseUrl: string;

  constructor(baseUrl: string = '', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey || null;
  }

  public setApiKey(key: string) {
    this.apiKey = key;
  }

  public async generateContent(options: GeminiRequestOptions): Promise<GeminiResponse> {
    const sanitizedPrompt = SecurityRedactor.redactSecrets(options.prompt);
    const sanitizedContext = options.codeContext ? SecurityRedactor.redactSecrets(options.codeContext) : undefined;

    try {
      const response = await fetch(`${this.baseUrl}/api/gemini/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey ? { 'X-Gemini-Api-Key': this.apiKey } : {})
        },
        body: JSON.stringify({
          prompt: sanitizedPrompt,
          systemInstruction: options.systemInstruction,
          codeContext: sanitizedContext,
          language: options.language,
          model: options.model || 'gemini-3.8-flash',
          temperature: options.temperature ?? 0.2
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({ error: response.statusText }));
        return {
          success: false,
          text: '',
          error: errJson.error || `HTTP ${response.status}`,
          modelUsed: options.model || 'gemini-3.8-flash'
        };
      }

      const data = await response.json();
      return {
        success: true,
        text: data.text || '',
        modelUsed: data.modelUsed || options.model || 'gemini-3.8-flash'
      };
    } catch (err: any) {
      return {
        success: false,
        text: '',
        error: err?.message || 'Network request failed',
        modelUsed: options.model || 'gemini-3.8-flash'
      };
    }
  }

  public async generateInlineGhostText(prefix: string, suffix: string, language: string): Promise<string> {
    const sanitizedPrefix = SecurityRedactor.redactSecrets(prefix);
    const sanitizedSuffix = SecurityRedactor.redactSecrets(suffix);

    const prompt = `Complete the following ${language} code at <CURSOR> location. Return ONLY the raw continuation code to be inserted at <CURSOR>. Do not include markdown blocks (\`\`\`), explanations, or comments.
PREFIX:
${sanitizedPrefix}
<CURSOR>
SUFFIX:
${sanitizedSuffix}`;

    const res = await this.generateContent({
      prompt,
      language,
      temperature: 0.1,
      systemInstruction: 'You are an expert low-latency AI inline completion engine. Output ONLY raw executable completion text to insert at cursor location. No markdown, no triple backticks.'
    });

    if (!res.success) return '';

    // Strip any markdown backticks if present
    let code = res.text.trim();
    if (code.startsWith('```')) {
      code = code.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '');
    }
    return code;
  }
}
