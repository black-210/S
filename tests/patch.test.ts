import assert from 'node:assert';
import { PatchEngine } from '../extension/src/patch/patchEngine.js';

export function testPatchGeneration() {
  const orig = 'fn main() {\n    println!("hello");\n}';
  const prop = 'fn main() {\n    println!("hello world!");\n}';

  const patch = PatchEngine.createProposedPatch('src/main.rs', orig, prop);
  assert.strictEqual(patch.filePath, 'src/main.rs');
  assert.ok(patch.diffHunk.includes('+    println!("hello world!");'));
  assert.ok(patch.diffHunk.includes('-    println!("hello");'));
  console.log('  ✓ Patch diff generation test passed');
}
