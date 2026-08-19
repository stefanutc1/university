// Unit tests for Debt Simplification Algorithm (Greedy Min-Cash-Flow)
const assert = require('assert');

function calculateNetBalances(participants, expenses) {
  const balances = {};
  participants.forEach(p => (balances[p.id] = 0));
  for (const exp of expenses) {
    balances[exp.payerId] = (balances[exp.payerId] || 0) + exp.amount;
    const splitList = exp.splitBetween || participants.map(p => p.id);
    const share = exp.amount / splitList.length;
    for (const pId of splitList) {
      balances[pId] = (balances[pId] || 0) - share;
    }
  }
  for (const id of Object.keys(balances)) {
    balances[id] = Math.round(balances[id] * 100) / 100;
  }
  return balances;
}

function simplifyDebts(participants, expenses) {
  const balances = calculateNetBalances(participants, expenses);
  const nameMap = new Map();
  participants.forEach(p => nameMap.set(p.id, p.name));

  const creditors = [];
  const debtors = [];
  for (const [id, bal] of Object.entries(balances)) {
    if (bal > 0.009) creditors.push({ id, balance: bal });
    else if (bal < -0.009) debtors.push({ id, balance: bal });
  }

  const transactions = [];
  while (creditors.length > 0 && debtors.length > 0) {
    creditors.sort((a, b) => b.balance - a.balance);
    debtors.sort((a, b) => a.balance - b.balance);

    const creditor = creditors[0];
    const debtor = debtors[0];
    const settle = Math.min(-debtor.balance, creditor.balance);
    const rounded = Math.round(settle * 100) / 100;

    if (rounded > 0) {
      transactions.push({
        from: debtor.id,
        to: creditor.id,
        amount: rounded,
      });
    }
    creditor.balance -= settle;
    debtor.balance += settle;
    if (Math.abs(creditor.balance) < 0.009) creditors.shift();
    if (Math.abs(debtor.balance) < 0.009) debtors.shift();
  }
  return transactions;
}

function runTests() {
  console.log('Testing Debt Simplifier...');

  // Test 1: Alice paid 90 for Alice, Bob, Charlie (each owes 30)
  const p1 = [{ id: 'A', name: 'Alice' }, { id: 'B', name: 'Bob' }, { id: 'C', name: 'Charlie' }];
  const e1 = [{ amount: 90, payerId: 'A', splitBetween: ['A', 'B', 'C'] }];
  const tx1 = simplifyDebts(p1, e1);
  assert.strictEqual(tx1.length, 2);
  assert.strictEqual(tx1.some(t => t.from === 'B' && t.to === 'A' && t.amount === 30), true);
  assert.strictEqual(tx1.some(t => t.from === 'C' && t.to === 'A' && t.amount === 30), true);
  console.log('  [PASS] 3-Person Equal Split');

  // Test 2: Circular debt (A paid 100 for B, B paid 100 for C, C paid 100 for A)
  const e2 = [
    { amount: 100, payerId: 'A', splitBetween: ['B'] },
    { amount: 100, payerId: 'B', splitBetween: ['C'] },
    { amount: 100, payerId: 'C', splitBetween: ['A'] },
  ];
  const tx2 = simplifyDebts(p1, e2);
  assert.strictEqual(tx2.length, 0); // Completely cancels out!
  console.log('  [PASS] Circular Debt Cancellation');

  // Test 3: Complex 5-person ledger
  const p5 = [
    { id: '1', name: 'Dan' }, { id: '2', name: 'Elena' },
    { id: '3', name: 'Mihai' }, { id: '4', name: 'Ioana' }, { id: '5', name: 'Radu' }
  ];
  const e5 = [
    { amount: 250, payerId: '1', splitBetween: ['1', '2', '3', '4', '5'] },
    { amount: 120, payerId: '2', splitBetween: ['2', '3'] },
    { amount: 80, payerId: '3', splitBetween: ['1', '4'] },
  ];
  const tx5 = simplifyDebts(p5, e5);
  assert.ok(tx5.length <= p5.length - 1);
  console.log('  [PASS] 5-Person Complex Ledger Minimization');
}

module.exports = { runTests };
if (require.main === module) runTests();
