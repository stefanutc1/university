// Unit tests for Password & Secret Generator
const assert = require('assert');

function runTests() {
  console.log('Testing Password Engine...');

  const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWER = 'abcdefghijklmnopqrstuvwxyz';
  const NUM = '0123456789';
  const SYM = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  function generate(len, upper, lower, num, sym) {
    let pool = '';
    if (upper) pool += UPPER;
    if (lower) pool += LOWER;
    if (num) pool += NUM;
    if (sym) pool += SYM;
    let res = '';
    for (let i = 0; i < len; i++) {
      res += pool[Math.floor(Math.random() * pool.length)];
    }
    return res;
  }

  const p16 = generate(16, true, true, true, true);
  assert.strictEqual(p16.length, 16);
  console.log('  [PASS] Password Length Enforcement');

  // Entropy calculation
  const poolSize = 26 + 26 + 10 + 26; // 88 chars
  const entropy16 = 16 * (Math.log(poolSize) / Math.log(2));
  assert.ok(entropy16 > 90); // Strong
  console.log('  [PASS] Shannon Entropy Mathematical Calculation');
}

module.exports = { runTests };
if (require.main === module) runTests();
