// Zustand Store for Clipboard History Manager
import { create } from 'zustand';

export type ClipCategory = 'link' | 'code' | 'secret' | 'text';

export interface ClipItem {
  id: string;
  text: string;
  category: ClipCategory;
  copiedAt: string;
  isPinned: boolean;
  charCount: number;
}

export function detectClipCategory(text: string): ClipCategory {
  const trimmed = text.trim();
  if (/^https?:\/\/[^\s]+$/i.test(trimmed)) {
    return 'link';
  }
  if (
    trimmed.startsWith('{') && trimmed.endsWith('}') ||
    trimmed.startsWith('[') && trimmed.endsWith(']') ||
    /\b(function|const|let|var|class|import|export|SELECT|INSERT|UPDATE|FROM|def |return)\b/.test(trimmed)
  ) {
    return 'code';
  }
  if (
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(trimmed) && trimmed.length >= 8 ||
    /^(ghp_|ey|sk_|AKIA|eyJhbGciOi)/.test(trimmed)
  ) {
    return 'secret';
  }
  return 'text';
}

interface ClipboardState {
  items: ClipItem[];
  searchQuery: string;
  selectedCategory: string;
  addClip: (text: string) => void;
  removeClip: (id: string) => void;
  togglePin: (id: string) => void;
  clearUnpinned: () => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: string) => void;
}

const INITIAL_CLIPS: ClipItem[] = [
  {
    id: 'c1',
    text: 'https://github.com/Projects-FEAA-UCV/proiecte.git',
    category: 'link',
    copiedAt: '2026-09-09 11:20',
    isPinned: true,
    charCount: 51,
  },
  {
    id: 'c2',
    text: 'curl -X POST http://localhost:8080/api/v1/rates/refresh -H "Content-Type: application/json"',
    category: 'code',
    copiedAt: '2026-09-09 10:14',
    isPinned: true,
    charCount: 91,
  },
  {
    id: 'c3',
    text: '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',
    category: 'secret',
    copiedAt: '2026-09-08 22:45',
    isPinned: false,
    charCount: 40,
  },
  {
    id: 'c4',
    text: 'Dezvoltarea Aplicatiilor Mobile (DAM) - Examen Sesiune Toamna UCV 2026',
    category: 'text',
    copiedAt: '2026-09-08 19:30',
    isPinned: false,
    charCount: 70,
  },
];

export const useClipboardStore = create<ClipboardState>((set) => ({
  items: INITIAL_CLIPS,
  searchQuery: '',
  selectedCategory: 'all',

  addClip: (text) =>
    set((state) => {
      const trimmed = text.trim();
      if (!trimmed) return state;
      // If already exists, move to top
      const existing = state.items.find((i) => i.text === trimmed);
      if (existing) {
        return {
          items: [existing, ...state.items.filter((i) => i.id !== existing.id)],
        };
      }
      const newItem: ClipItem = {
        id: `c_${Date.now()}`,
        text: trimmed,
        category: detectClipCategory(trimmed),
        copiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        isPinned: false,
        charCount: trimmed.length,
      };
      return {
        items: [newItem, ...state.items].slice(0, 50),
      };
    }),

  removeClip: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  togglePin: (id) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, isPinned: !i.isPinned } : i)),
    })),

  clearUnpinned: () =>
    set((state) => ({
      items: state.items.filter((i) => i.isPinned),
    })),

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
}));
