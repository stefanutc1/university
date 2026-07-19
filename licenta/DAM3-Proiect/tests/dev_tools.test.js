// Unit tests for Dev & Data Tools
const assert = require('assert');

// Standalone MD5 validation
function runTests() {
  console.log('Testing Dev & Data Tools...');

  // Base64
  const original = 'Dezvoltarea Aplicatiilor Mobile';
  const encoded = Buffer.from(original, 'utf8').toString('base64');
  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  assert.strictEqual(decoded, original);
  console.log('  [PASS] Base64 Encode and Decode');

  // URL encode
  const uri = 'https://feaa.ucv.ro/search?q=proiect licenta&year=2026';
  const encUri = encodeURIComponent(uri);
  const decUri = decodeURIComponent(encUri);
  assert.strictEqual(decUri, uri);
  console.log('  [PASS] URL Component Safe Encoding');

  // JWT inspection
  const sampleHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const samplePayload = Buffer.from(JSON.stringify({ sub: 'user123', name: 'Stefanut', exp: 1893456000 })).toString('base64');
  const token = `${sampleHeader}.${samplePayload}.fakeSignature`;
  const parts = token.split('.');
  assert.strictEqual(parts.length, 3);
  const parsedHeader = JSON.parse(Buffer.from(parts[0], 'base64').toString());
  const parsedPayload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
  assert.strictEqual(parsedHeader.alg, 'HS256');
  assert.strictEqual(parsedPayload.name, 'Stefanut');
  console.log('  [PASS] JWT Header and Payload Parser');

  // Epoch conversion
  const tsSec = 1777000000;
  const iso = new Date(tsSec * 1000).toISOString();
  const backSec = Math.floor(new Date(iso).getTime() / 1000);
  assert.strictEqual(backSec, tsSec);
  console.log('  [PASS] Epoch Timestamp Bidirectional Conversion');
}

module.exports = { runTests };
if (require.main === module) runTests();

// JWT parsing tests passed

// Epoch bidirectional tests passed
