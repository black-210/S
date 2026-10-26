import assert from 'node:assert';
import { RiposteExtensionHost } from '../extension/src/extension.js';

export function testExtensionActivation() {
  const host = new RiposteExtensionHost();
  const result = host.activate();

  assert.strictEqual(result.status, 'active');
  assert.strictEqual(result.extensionName, 'riposte-extension');
  assert.strictEqual(result.version, '1.0.0');
  assert.ok(result.registeredCommands.includes('riposte.detectToolchains'));
  assert.ok(result.registeredCommands.includes('riposte.ai.openChat'));
  console.log('  ✓ Extension activation test passed');
}
