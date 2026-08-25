import { create } from 'zustand';
export const useScannerStore = create((set) => ({ pages: [], addPage: (p: any) => set((s: any) => ({ pages: [...s.pages, p] })) }));

// Thumbnail list and reordering
