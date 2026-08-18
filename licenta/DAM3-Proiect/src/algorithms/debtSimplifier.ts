// Automated Debt-Simplification Algorithm (Greedy Min-Cash-Flow)

export interface Participant {
  id: string;
  name: string;
  avatarColor?: string;
}

export interface ExpenseItem {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  currency: string;
  payerId: string;
  splitBetween: string[]; // participant IDs
  customSplits?: Record<string, number>;
  date: string;
  category: string;
}

export interface DebtTransaction {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
  currency: string;
}

export interface BalanceMap {
  [participantId: string]: number; // positive = creditor, negative = debtor
}

export function calculateNetBalances(participants: Participant[], expenses: ExpenseItem[]): BalanceMap {
  const balances: BalanceMap = {};
  participants.forEach(p => {
    balances[p.id] = 0;
  });

  for (const exp of expenses) {
    const totalAmount = exp.amount;
    const payerId = exp.payerId;
    if (balances[payerId] === undefined) balances[payerId] = 0;
    balances[payerId] += totalAmount;

    if (exp.customSplits && Object.keys(exp.customSplits).length > 0) {
      for (const [pId, share] of Object.entries(exp.customSplits)) {
        if (balances[pId] === undefined) balances[pId] = 0;
        balances[pId] -= share;
      }
    } else {
      const splitList = exp.splitBetween && exp.splitBetween.length > 0 ? exp.splitBetween : participants.map(p => p.id);
      const share = totalAmount / splitList.length;
      for (const pId of splitList) {
        if (balances[pId] === undefined) balances[pId] = 0;
        balances[pId] -= share;
      }
    }
  }

  // Round to 2 decimal places to eliminate floating point quirks
  for (const id of Object.keys(balances)) {
    balances[id] = Math.round(balances[id] * 100) / 100;
  }

  return balances;
}

export function simplifyDebts(participants: Participant[], expenses: ExpenseItem[], currency = 'RON'): DebtTransaction[] {
  const balances = calculateNetBalances(participants, expenses);
  const nameMap = new Map<string, string>();
  participants.forEach(p => nameMap.set(p.id, p.name));

  interface Account {
    id: string;
    balance: number;
  }

  const creditors: Account[] = [];
  const debtors: Account[] = [];

  for (const [id, bal] of Object.entries(balances)) {
    if (bal > 0.009) {
      creditors.push({ id, balance: bal });
    } else if (bal < -0.009) {
      debtors.push({ id, balance: bal });
    }
  }

  const transactions: DebtTransaction[] = [];

  // Greedy Min-Cash-Flow matching
  while (creditors.length > 0 && debtors.length > 0) {
    creditors.sort((a, b) => b.balance - a.balance); // greatest creditor first
    debtors.sort((a, b) => a.balance - b.balance); // greatest debtor (most negative) first

    const creditor = creditors[0];
    const debtor = debtors[0];

    const settleAmount = Math.min(-debtor.balance, creditor.balance);
    const roundedAmount = Math.round(settleAmount * 100) / 100;

    if (roundedAmount > 0) {
      transactions.push({
        fromId: debtor.id,
        fromName: nameMap.get(debtor.id) || debtor.id,
        toId: creditor.id,
        toName: nameMap.get(creditor.id) || creditor.id,
        amount: roundedAmount,
        currency,
      });
    }

    creditor.balance -= settleAmount;
    debtor.balance += settleAmount;

    if (Math.abs(creditor.balance) < 0.009) creditors.shift();
    if (Math.abs(debtor.balance) < 0.009) debtors.shift();
  }

  return transactions;
}

// Net balance calculation verified

// Greedy Min-Cash-Flow algorithm architecture

// Creditors and debtors segregation

// Greedy matching logic active
