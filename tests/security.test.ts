import assert from 'node:assert';
import { SecurityRedactor } from '../extension/src/security/redactor.js';

export function testSecurityRedaction() {
  const secretKey = 'GEMINI_API_KEY=AIzaSyA1234567890BCDEFGHIJKLMNOPQRSTU';
  const redacted = SecurityRedactor.redactSecrets(secretKey);

  assert.ok(!redacted.includes('AIzaSyA1234567890BCDEFGHIJKLMNOPQRSTU'));
  assert.ok(redacted.includes('[REDACTED_SECRET]'));

  assert.ok(SecurityRedactor.isSensitiveFile('/workspace/.env'));
  assert.ok(SecurityRedactor.isSensitiveFile('credentials.json'));
  assert.ok(!SecurityRedactor.isSensitiveFile('main.rs'));
  console.log('  ✓ Security redaction test passed');
}
