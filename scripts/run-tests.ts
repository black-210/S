import { testExtensionActivation } from '../tests/extension.test.js';
import { testSecurityRedaction } from '../tests/security.test.js';
import { testPatchGeneration } from '../tests/patch.test.js';
import { testRustErrorExplanations } from '../tests/cargo.test.js';
import { testTermuxDetection } from '../tests/termux.test.js';

async function runAllTests() {
  console.log('🧪 Running RIPOSTE Automated Test Suite...\n');
  let passed = 0;
  let failed = 0;

  const runTest = (name: string, fn: () => void) => {
    try {
      console.log(`▶ Executing: ${name}`);
      fn();
      passed++;
    } catch (err: any) {
      console.error(`❌ FAILED: ${name}`);
      console.error(err);
      failed++;
    }
  };

  runTest('Extension Activation', testExtensionActivation);
  runTest('Security & Secret Redaction', testSecurityRedaction);
  runTest('Patch Diff Generator', testPatchGeneration);
  runTest('Rust Error Explanation Lookup', testRustErrorExplanations);
  runTest('Termux & Toolchain Detector', testTermuxDetection);

  console.log(`\n📊 Test Execution Summary: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests();
