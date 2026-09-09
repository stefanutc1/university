// Zustand Store for Barcode & Inventory / Asset Tracker
import { create } from 'zustand';

export type AssetStatus = 'in_stock' | 'low_stock' | 'lent_out' | 'broken';

export interface InventoryItem {
  id: string;
  barcode: string;
  name: string;
  category: 'Homelab & Retelistica' | 'Componente Electronice' | 'Scule & Unelte' | 'Consumabile' | 'Altele';
  quantity: number;
  minStock: number;
  location: string;
  status: AssetStatus;
  notes: string;
  lastUpdated: string;
}

interface InventoryState {
  items: InventoryItem[];
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
  addItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedStatus: (status: string) => void;
  getItemByBarcode: (barcode: string) => InventoryItem | undefined;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv1',
    barcode: '5949012345678',
    name: 'Switch Gigabit 8 Porturi TP-Link',
    category: 'Homelab & Retelistica',
    quantity: 2,
    minStock: 1,
    location: 'Rack Birou Laborator',
    status: 'in_stock',
    notes: 'Folosit pentru teste VLAN si sniffing mDNS',
    lastUpdated: '2026-09-08 16:30',
  },
  {
    id: 'inv2',
    barcode: '5949098765432',
    name: 'Cablu Patch Cat6 UTP 5m Albastru',
    category: 'Homelab & Retelistica',
    quantity: 1,
    minStock: 3,
    location: 'Cutia 2 Cabluri',
    status: 'low_stock',
    notes: 'Necesita reaprovizionare pentru laborator',
    lastUpdated: '2026-09-07 14:10',
  },
  {
    id: 'inv3',
    barcode: '4001234567890',
    name: 'Microcontroller ESP32-WROOM-32D',
    category: 'Componente Electronice',
    quantity: 4,
    minStock: 2,
    location: 'Organizator Sertar 1',
    status: 'in_stock',
    notes: 'Pentru teste senzori I2C si BLE',
    lastUpdated: '2026-09-06 18:00',
  },
  {
    id: 'inv4',
    barcode: '7332543000000',
    name: 'Multimetru Digital True-RMS',
    category: 'Scule & Unelte',
    quantity: 1,
    minStock: 1,
    location: 'Bancul de Lucru',
    status: 'lent_out',
    notes: 'Imprumutat lui Andrei pentru calibrare sursa',
    lastUpdated: '2026-09-05 12:45',
  },
];

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: INITIAL_INVENTORY,
  searchQuery: '',
  selectedCategory: 'all',
  selectedStatus: 'all',

  addItem: (item) =>
    set((state) => {
      const status: AssetStatus = item.quantity <= item.minStock ? 'low_stock' : item.status || 'in_stock';
      const newItem: InventoryItem = {
        ...item,
        status,
        id: `inv_${Date.now()}`,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      return { items: [newItem, ...state.items] };
    }),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((i) => {
        if (i.id !== id) return i;
        const updated = { ...i, ...updates };
        if (updates.quantity !== undefined) {
          if (updated.quantity <= 0) updated.status = 'low_stock';
          else if (updated.quantity <= updated.minStock) updated.status = 'low_stock';
          else if (updated.status === 'low_stock') updated.status = 'in_stock';
        }
        updated.lastUpdated = new Date().toISOString().replace('T', ' ').substring(0, 16);
        return updated;
      }),
    })),

  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, delta) =>
    set((state) => ({
      items: state.items.map((i) => {
        if (i.id !== id) return i;
        const newQty = Math.max(0, i.quantity + delta);
        let status = i.status;
        if (newQty <= i.minStock) status = 'low_stock';
        else if (status === 'low_stock' && newQty > i.minStock) status = 'in_stock';
        return {
          ...i,
          quantity: newQty,
          status,
          lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
      }),
    })),

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),

  getItemByBarcode: (barcode) => {
    return get().items.find((i) => i.barcode.trim() === barcode.trim());
  },
}));
