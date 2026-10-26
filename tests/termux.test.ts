import assert from 'node:assert';
import { TermuxDetector } from '../extension/src/termux/detector.js';

export function testTermuxDetection() {
  const report = TermuxDetector.detectEnvironment();
  assert.ok(typeof report.isTermux === 'boolean');
  assert.ok(typeof report.isArm64 === 'boolean');
  assert.ok(report.tools.rustc !== undefined);
  assert.ok(report.tools.clang !== undefined);
  console.log('  ✓ Termux environment detector test passed');
}
