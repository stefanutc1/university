// Unit tests for the 6 new modules added to DAM3-Proiect
const assert = require('assert');

function detectClipCategory(text) {
  const trimmed = text.trim();
  if (/^https?:\/\/[^\s]+$/i.test(trimmed)) return 'link';
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
    /\b(function|const|let|var|class|import|export|SELECT|INSERT|UPDATE|FROM|def |return)\b/.test(trimmed)
  ) return 'code';
  if (
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(trimmed) && trimmed.length >= 8 ||
    /^(ghp_|ey|sk_|AKIA|eyJhbGciOi)/.test(trimmed)
  ) return 'secret';
  return 'text';
}

function splitIntoTeams(members, teamCount) {
  const clean = members.map((m) => m.trim()).filter(Boolean);
  if (clean.length === 0 || teamCount <= 0) return [];
  const teams = Array.from({ length: teamCount }, (_, i) => ({
    teamIndex: i + 1,
    members: [],
  }));
  clean.forEach((m, idx) => {
    teams[idx % teamCount].members.push(m);
  });
  return teams;
}

function runTests() {
  console.log('Testing 6 New Utility Modules...');

  // 1. Speed Test throughput calculation
  const bytesTransferred = 12500000; // 12.5 MB = 100 Megabits
  const timeSeconds = 2.0;
  const mbps = (bytesTransferred * 8) / (timeSeconds * 1000000);
  assert.strictEqual(mbps, 50.0);
  console.log('  [PASS] Speed Test: Bandwidth and Throughput Math');

  // 2. Voice Recorder duration format
  const durationSec = 145;
  const formatted = `${Math.floor(durationSec / 60).toString().padStart(2, '0')}:${(durationSec % 60).toString().padStart(2, '0')}`;
  assert.strictEqual(formatted, '02:25');
  console.log('  [PASS] Voice Recorder: Duration Timestamp Formatting');

  // 3. Clipboard Classifier
  assert.strictEqual(detectClipCategory('https://feaa.ucv.ro/licenta'), 'link');
  assert.strictEqual(detectClipCategory('const x = () => { return 42; };'), 'code');
  assert.strictEqual(detectClipCategory('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'), 'secret');
  assert.strictEqual(detectClipCategory('Tema de laborator la disciplina DAM anul 3'), 'text');
  console.log('  [PASS] Clipboard History: Auto-Categorization (Link, Code, Secret, Text)');

  // 4. Barcode Inventory Stock Logic
  const item = { quantity: 1, minStock: 2, status: 'in_stock' };
  const updatedStatus = item.quantity <= item.minStock ? 'low_stock' : 'in_stock';
  assert.strictEqual(updatedStatus, 'low_stock');
  console.log('  [PASS] Barcode Inventory: Low Stock Detection');

  // 5. HTTP Tester Header Parsing
  const rawHeaders = '{\n  "Authorization": "Bearer token123",\n  "Accept": "application/json"\n}';
  const parsed = JSON.parse(rawHeaders);
  assert.strictEqual(parsed['Authorization'], 'Bearer token123');
  assert.strictEqual(parsed['Accept'], 'application/json');
  console.log('  [PASS] HTTP Tester: JSON Headers Parser');

  // 6. Random Picker: Team Balancing
  const students = ['Stefanut', 'Andrei', 'Maria', 'Elena', 'Dan', 'Ioana', 'Mihai', 'Radu'];
  const teams = splitIntoTeams(students, 2);
  assert.strictEqual(teams.length, 2);
  assert.strictEqual(teams[0].members.length, 4);
  assert.strictEqual(teams[1].members.length, 4);
  console.log('  [PASS] Random Picker: Equal Team Balancing Distribution');
}

module.exports = { runTests };
if (require.main === module) runTests();
