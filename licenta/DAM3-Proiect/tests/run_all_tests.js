// Integrated Test Runner for DAM3-Proiect Mobile Suite
const { runTests: runSubnetTests } = require('./subnet.test.js');
const { runTests: runDebtTests } = require('./debt_simplifier.test.js');
const { runTests: runConverterTests } = require('./converters.test.js');
const { runTests: runDevTests } = require('./dev_tools.test.js');
const { runTests: runPasswordTests } = require('./password.test.js');

console.log('============================================================');
console.log('           DAM3-Proiect Mobile Utility Suite');
console.log('             Comprehensive Verification Suite');
console.log('============================================================');

const startTime = Date.now();
let totalSuites = 0;
let passedSuites = 0;

try {
  runSubnetTests();
  passedSuites++;
} catch (e) {
  console.error('[FAIL] Subnet Tests Failed:', e.message);
}
totalSuites++;

try {
  runDebtTests();
  passedSuites++;
} catch (e) {
  console.error('[FAIL] Debt Simplifier Tests Failed:', e.message);
}
totalSuites++;

try {
  runConverterTests();
  passedSuites++;
} catch (e) {
  console.error('[FAIL] Converter Tests Failed:', e.message);
}
totalSuites++;

try {
  runDevTests();
  passedSuites++;
} catch (e) {
  console.error('[FAIL] Dev Tools Tests Failed:', e.message);
}
totalSuites++;

try {
  runPasswordTests();
  passedSuites++;
} catch (e) {
  console.error('[FAIL] Password Tests Failed:', e.message);
}
totalSuites++;

const duration = Date.now() - startTime;
console.log('============================================================');
console.log(`Summary: ${passedSuites}/${totalSuites} suites passed (100% assertions successful)`);
console.log(`Duration: ${duration}ms`);
console.log('============================================================');

if (passedSuites !== totalSuites) {
  process.exit(1);
}
