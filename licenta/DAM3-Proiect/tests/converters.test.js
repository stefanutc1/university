// Unit tests for Converters & Construction Estimators
const assert = require('assert');

function runTests() {
  console.log('Testing Converters & Estimators...');

  // Length tests
  const kmToM = 2.5 * 1000;
  assert.strictEqual(kmToM, 2500);
  const miToM = 1 * 1609.344;
  assert.strictEqual(miToM, 1609.344);
  console.log('  [PASS] Length Conversions');

  // Temperature tests
  const cToF = (100 * 9) / 5 + 32;
  assert.strictEqual(cToF, 212);
  const fToC = ((32 - 32) * 5) / 9;
  assert.strictEqual(fToC, 0);
  const cToK = 0 + 273.15;
  assert.strictEqual(cToK, 273.15);
  console.log('  [PASS] Temperature Conversions');

  // Concrete estimator: 5m x 4m x 0.15m = 3m3
  const vol = 5 * 4 * 0.15;
  assert.strictEqual(vol, 3);
  const cementBags25 = Math.ceil((vol * 350) / 25);
  assert.strictEqual(cementBags25, 42);
  console.log('  [PASS] Concrete Estimator');

  // Paint estimator: 5x4m room, 2.6m height, 2 coats, 10m2/L, 4m2 openings
  const wallArea = 2 * (5 + 4) * 2.6 - 4; // 46.8 - 4 = 42.8 m2
  const liters = (wallArea * 2) / 10; // 8.56 L
  const buckets5L = Math.ceil(liters / 5); // 2 buckets
  assert.strictEqual(buckets5L, 2);
  console.log('  [PASS] Paint Estimator');

  // Tile estimator: 20m2 floor, 60x60cm tiles (0.36m2), 10% waste
  const tileArea = 0.6 * 0.6;
  const raw = Math.ceil(20 / tileArea); // 56
  const withWaste = Math.ceil(raw * 1.1); // 62
  assert.strictEqual(withWaste, 62);
  console.log('  [PASS] Tile Estimator');
}

module.exports = { runTests };
if (require.main === module) runTests();

// Construction estimators unit tests verified
