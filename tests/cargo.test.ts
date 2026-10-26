import assert from 'node:assert';
import { CargoManager } from '../extension/src/rust/cargo.js';

export function testRustErrorExplanations() {
  const expE0382 = CargoManager.getRustErrorExplanation('E0382');
  assert.ok(expE0382.includes('moved'));
  
  const expE0502 = CargoManager.getRustErrorExplanation('E0502');
  assert.ok(expE0502.includes('borrow'));

  console.log('  ✓ Rust compiler error explanations test passed');
}
