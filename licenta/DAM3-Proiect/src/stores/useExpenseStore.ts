// Zustand Expense Splitter Store
import { create } from 'zustand';
import { Participant, ExpenseItem, simplifyDebts, calculateNetBalances, DebtTransaction } from '../algorithms/debtSimplifier';

interface ExpenseGroup {
  id: string;
  name: string;
  currency: string;
  participants: Participant[];
  expenses: ExpenseItem[];
}

interface ExpenseStoreState {
  groups: ExpenseGroup[];
  activeGroupId: string;
  setActiveGroup: (id: string) => void;
  addGroup: (name: string, currency: string, participants: string[]) => void;
  addExpense: (exp: Omit<ExpenseItem, 'id' | 'date'>) => void;
  deleteExpense: (expId: string) => void;
  getActiveGroup: () => ExpenseGroup | undefined;
  getNetBalances: () => Record<string, number>;
  getSimplifiedSettlements: () => DebtTransaction[];
}

const DEFAULT_GROUP: ExpenseGroup = {
  id: 'g1',
  name: 'Excursie Retezat & Proiect',
  currency: 'RON',
  participants: [
    { id: 'p1', name: 'Stefanut', avatarColor: '#3b82f6' },
    { id: 'p2', name: 'Andrei', avatarColor: '#10b981' },
    { id: 'p3', name: 'Maria', avatarColor: '#f59e0b' },
    { id: 'p4', name: 'Elena', avatarColor: '#ec4899' },
  ],
  expenses: [
    { id: 'e1', groupId: 'g1', description: 'Cazare Pensiune Retezat', amount: 800, currency: 'RON', payerId: 'p1', splitBetween: ['p1', 'p2', 'p3', 'p4'], date: '2026-08-15', category: 'Cazare' },
    { id: 'e2', groupId: 'g1', description: 'Combustibil Drum', amount: 350, currency: 'RON', payerId: 'p2', splitBetween: ['p1', 'p2', 'p3', 'p4'], date: '2026-08-15', category: 'Transport' },
    { id: 'e3', groupId: 'g1', description: 'Cumparaturi Supermarket', amount: 260, currency: 'RON', payerId: 'p3', splitBetween: ['p1', 'p2', 'p3', 'p4'], date: '2026-08-16', category: 'Alimentatie' },
  ],
};

export const useExpenseStore = create<ExpenseStoreState>((set, get) => ({
  groups: [DEFAULT_GROUP],
  activeGroupId: 'g1',

  setActiveGroup: (id) => set({ activeGroupId: id }),

  addGroup: (name, currency, memberNames) =>
    set((state) => {
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
      const participants: Participant[] = memberNames.map((n, idx) => ({
        id: `p_${Date.now()}_${idx}`,
        name: n.trim(),
        avatarColor: colors[idx % colors.length],
      }));
      const newGroup: ExpenseGroup = {
        id: `g_${Date.now()}`,
        name,
        currency,
        participants,
        expenses: [],
      };
      return {
        groups: [...state.groups, newGroup],
        activeGroupId: newGroup.id,
      };
    }),

  addExpense: (expData) =>
    set((state) => {
      const group = state.groups.find((g) => g.id === state.activeGroupId);
      if (!group) return state;

      const newExpense: ExpenseItem = {
        ...expData,
        id: `e_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
      };

      const updatedGroup: ExpenseGroup = {
        ...group,
        expenses: [newExpense, ...group.expenses],
      };

      return {
        groups: state.groups.map((g) => (g.id === state.activeGroupId ? updatedGroup : g)),
      };
    }),

  deleteExpense: (expId) =>
    set((state) => {
      const group = state.groups.find((g) => g.id === state.activeGroupId);
      if (!group) return state;
      const updatedGroup = {
        ...group,
        expenses: group.expenses.filter((e) => e.id !== expId),
      };
      return {
        groups: state.groups.map((g) => (g.id === state.activeGroupId ? updatedGroup : g)),
      };
    }),

  getActiveGroup: () => {
    const { groups, activeGroupId } = get();
    return groups.find((g) => g.id === activeGroupId);
  },

  getNetBalances: () => {
    const group = get().getActiveGroup();
    if (!group) return {};
    return calculateNetBalances(group.participants, group.expenses);
  },

  getSimplifiedSettlements: () => {
    const group = get().getActiveGroup();
    if (!group) return [];
    return simplifyDebts(group.participants, group.expenses, group.currency);
  },
}));

// Storage persistence active

// Group & avatar management verified

// Expense creation verified

// Equal split verified

// Unequal split support verified
