// Zustand Store for Audio / Voice Recorder & Transcription Logger
import { create } from 'zustand';

export interface VoiceNote {
  id: string;
  title: string;
  durationSec: number;
  createdAt: string;
  fileUri: string;
  transcription: string;
  category: 'Cursuri' | 'Idei Proiect' | 'Sedinte' | 'Generale';
  sizeKb: number;
}

interface VoiceNotesState {
  notes: VoiceNote[];
  searchQuery: string;
  selectedCategory: string;
  addNote: (note: Omit<VoiceNote, 'id' | 'createdAt'>) => void;
  deleteNote: (id: string) => void;
  updateTranscription: (id: string, text: string) => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: string) => void;
}

const INITIAL_NOTES: VoiceNote[] = [
  {
    id: 'vn1',
    title: 'Idee Arhitectura DAM Licenta',
    durationSec: 84,
    createdAt: '2026-09-08 17:20',
    fileUri: 'file:///records/idea_dam.m4a',
    transcription: 'Am stabilit ca folosim Fiber cu SQLite si WAL mode pe backend. Pe mobil mergem pe Expo cu MMKV si Zustand pentru stocare rapida.',
    category: 'Idei Proiect',
    sizeKb: 672,
  },
  {
    id: 'vn2',
    title: 'Notite Curs Retele & Subnetting',
    durationSec: 145,
    createdAt: '2026-09-07 11:15',
    fileUri: 'file:///records/curs_retele.m4a',
    transcription: 'Retinut pentru examen: masca /30 are doar 2 gazde utilizabile pentru conexiuni point-to-point. Masca /31 conform RFC 3021.',
    category: 'Cursuri',
    sizeKb: 1160,
  },
  {
    id: 'vn3',
    title: 'Specificatii Materiale Apartament',
    durationSec: 42,
    createdAt: '2026-09-05 19:40',
    fileUri: 'file:///records/apartament.m4a',
    transcription: 'Pentru baie gresie 60x60cm, suprafata 8 metri patrati cu 15% marja pierderi la taiere pe diagonala.',
    category: 'Generale',
    sizeKb: 336,
  },
];

export const useVoiceNotesStore = create<VoiceNotesState>((set) => ({
  notes: INITIAL_NOTES,
  searchQuery: '',
  selectedCategory: 'all',

  addNote: (note) =>
    set((state) => ({
      notes: [
        {
          ...note,
          id: `vn_${Date.now()}`,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
        ...state.notes,
      ],
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),

  updateTranscription: (id, text) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, transcription: text } : n)),
    })),

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
}));
