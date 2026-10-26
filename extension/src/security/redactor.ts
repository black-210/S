export class SecurityRedactor {
  private static readonly SECRET_PATTERNS = [
    /AIzaSy[A-Za-z0-9_-]{35}/g,                                     // Google API Key
    /sk-[a-zA-Z0-9]{32,}/g,                                          // OpenAI / Generic Secret Key
    /ghp_[a-zA-Z0-9]{36}/g,                                          // GitHub Personal Access Token
    /gho_[a-zA-Z0-9]{36}/g,                                          // GitHub OAuth Token
    /xox[baprs]-[a-zA-Z0-9]{10,48}/g,                               // Slack Token
    /-----BEGIN (PRIVATE KEY|RSA PRIVATE KEY)-----[\s\S]*?-----END \1-----/g, // SSH Private Key
    /("?api_?key"?\s*:\s*")([^"]+)(")/gi,                            // JSON API Key
    /(GEMINI_API_KEY\s*=\s*)([^\s\n]+)/gi                             // Env GEMINI_API_KEY
  ];

  private static readonly SENSITIVE_FILENAMES = [
    /\.env$/i,
    /\.env\..*$/i,
    /id_rsa$/i,
    /id_ed25519$/i,
    /\.pem$/i,
    /credentials\.json$/i,
    /secrets\.json$/i,
    /\.htpasswd$/i
  ];

  public static redactSecrets(content: string): string {
    let sanitized = content;
    for (const pattern of this.SECRET_PATTERNS) {
      sanitized = sanitized.replace(pattern, '[REDACTED_SECRET]');
    }
    return sanitized;
  }

  public static isSensitiveFile(filePath: string): boolean {
    const fileName = filePath.split(/[/\\]/).pop() || '';
    return this.SENSITIVE_FILENAMES.some(pattern => pattern.test(fileName));
  }
}
