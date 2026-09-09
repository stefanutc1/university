// Zustand Store for Random Picker & Decision Maker
import { create } from 'zustand';

export type PickerMode = 'dice' | 'list' | 'coin' | 'teams';

export interface DecisionRecord {
  id: string;
  mode: PickerMode;
  title: string;
  result: string;
  timestamp: string;
}

interface RandomPickerState {
  currentMode: PickerMode;
  diceSides: number;
  diceCount: number;
  diceResults: number[];
  listItemsText: string;
  listWinner: string;
  coinResult: 'Cap' | 'Pajura' | null;
  teamMembersText: string;
  teamCount: number;
  generatedTeams: { teamIndex: number; members: string[] }[];
  history: DecisionRecord[];

  setCurrentMode: (m: PickerMode) => void;
  setDiceSides: (s: number) => void;
  setDiceCount: (c: number) => void;
  rollDice: () => void;
  setListItemsText: (t: string) => void;
  pickFromList: () => void;
  flipCoin: () => void;
  setTeamMembersText: (t: string) => void;
  setTeamCount: (c: number) => void;
  generateTeams: () => void;
  clearHistory: () => void;
}

export function splitIntoTeams(members: string[], teamCount: number): { teamIndex: number; members: string[] }[] {
  const cleanMembers = members.map((m) => m.trim()).filter(Boolean);
  if (cleanMembers.length === 0 || teamCount <= 0) return [];

  // Shuffle array using Fisher-Yates algorithm
  const shuffled = [...cleanMembers];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const teams: { teamIndex: number; members: string[] }[] = Array.from({ length: teamCount }, (_, i) => ({
    teamIndex: i + 1,
    members: [],
  }));

  shuffled.forEach((member, idx) => {
    teams[idx % teamCount].members.push(member);
  });

  return teams;
}

export const useRandomPickerStore = create<RandomPickerState>((set, get) => ({
  currentMode: 'dice',
  diceSides: 6,
  diceCount: 2,
  diceResults: [4, 6],
  listItemsText: 'Pizza\nPaste\nBurger\nSalata\nSushi',
  listWinner: '',
  coinResult: null,
  teamMembersText: 'Stefanut\nAndrei\nMaria\nElena\nDan\nIoana\nMihai\nRadu',
  teamCount: 2,
  generatedTeams: [],
  history: [],

  setCurrentMode: (currentMode) => set({ currentMode }),
  setDiceSides: (diceSides) => set({ diceSides }),
  setDiceCount: (diceCount) => set({ diceCount }),

  rollDice: () => {
    const { diceCount, diceSides } = get();
    const results: number[] = [];
    for (let i = 0; i < diceCount; i++) {
      results.push(Math.floor(Math.random() * diceSides) + 1);
    }
    const sum = results.reduce((a, b) => a + b, 0);
    const rec: DecisionRecord = {
      id: `rec_${Date.now()}`,
      mode: 'dice',
      title: `${diceCount}d${diceSides}`,
      result: `Rezultat: ${results.join(', ')} (Total: ${sum})`,
      timestamp: new Date().toLocaleTimeString(),
    };
    set((state) => ({
      diceResults: results,
      history: [rec, ...state.history].slice(0, 15),
    }));
  },

  setListItemsText: (listItemsText) => set({ listItemsText }),

  pickFromList: () => {
    const { listItemsText } = get();
    const items = listItemsText.split('\n').map((s) => s.trim()).filter(Boolean);
    if (items.length === 0) return;
    const winner = items[Math.floor(Math.random() * items.length)];
    const rec: DecisionRecord = {
      id: `rec_${Date.now()}`,
      mode: 'list',
      title: 'Alegere din Lista',
      result: `Castigator: ${winner}`,
      timestamp: new Date().toLocaleTimeString(),
    };
    set((state) => ({
      listWinner: winner,
      history: [rec, ...state.history].slice(0, 15),
    }));
  },

  flipCoin: () => {
    const res = Math.random() < 0.5 ? 'Cap' : 'Pajura';
    const rec: DecisionRecord = {
      id: `rec_${Date.now()}`,
      mode: 'coin',
      title: 'Moneda (Heads/Tails)',
      result: res,
      timestamp: new Date().toLocaleTimeString(),
    };
    set((state) => ({
      coinResult: res,
      history: [rec, ...state.history].slice(0, 15),
    }));
  },

  setTeamMembersText: (teamMembersText) => set({ teamMembersText }),
  setTeamCount: (teamCount) => set({ teamCount }),

  generateTeams: () => {
    const { teamMembersText, teamCount } = get();
    const members = teamMembersText.split('\n');
    const teams = splitIntoTeams(members, teamCount);
    const summary = teams.map((t) => `Echipa ${t.teamIndex}: ${t.members.join(', ')}`).join(' | ');
    const rec: DecisionRecord = {
      id: `rec_${Date.now()}`,
      mode: 'teams',
      title: `Impartire in ${teamCount} Echipe`,
      result: summary,
      timestamp: new Date().toLocaleTimeString(),
    };
    set((state) => ({
      generatedTeams: teams,
      history: [rec, ...state.history].slice(0, 15),
    }));
  },

  clearHistory: () => set({ history: [] }),
}));
