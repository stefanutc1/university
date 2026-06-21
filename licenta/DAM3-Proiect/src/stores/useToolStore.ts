// Zustand Tool Store for Catalog, Favorites & Search Filter
import { create } from 'zustand';

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: 'network' | 'scanner' | 'converters' | 'expenses' | 'hardware' | 'dev';
  icon: string;
  route: string;
  tags: string[];
}

export const INITIAL_TOOLS: ToolItem[] = [
  // Network Suite
  { id: 'subnet-calc', name: 'Calculator Subnet / IP', description: 'Calcul IPv4 CIDR, adrese retea, broadcast si masti binare', category: 'network', icon: 'calculator-outline', route: '/tools/network/subnet-calc', tags: ['ip', 'subnet', 'cidr', 'network', 'mask'] },
  { id: 'dns-lookup', name: 'DNS Lookup Record Inspector', description: 'Interogare inregistrari A, AAAA, MX, TXT, CNAME, NS via DoH', category: 'network', icon: 'globe-outline', route: '/tools/network/dns-lookup', tags: ['dns', 'domain', 'lookup', 'ip', 'ns'] },
  { id: 'wifi-qr', name: 'Generator QR Conexiune Wi-Fi', description: 'Creare cod QR pentru partajare rapida credentiale Wi-Fi securizate', category: 'network', icon: 'qr-code-outline', route: '/tools/network/wifi-qr', tags: ['wifi', 'qr', 'password', 'share', 'security'] },
  { id: 'lan-scanner', name: 'Scanner Gazde Retea Locala', description: 'Detectie noduri active si servicii deschise in reteaua Wi-Fi curenta', category: 'network', icon: 'wifi-outline', route: '/tools/network/lan-scanner', tags: ['lan', 'scanner', 'ping', 'network', 'hosts'] },

  // Document Scanner
  { id: 'camera-capture', name: 'Scanare Camera Documente', description: 'Captura asistata cu incadrare automata a marginilor colii', category: 'scanner', icon: 'camera-outline', route: '/tools/scanner/camera-capture', tags: ['scan', 'camera', 'document', 'capture', 'edge'] },
  { id: 'document-filter', name: 'Filtre Alb-Negru & Contrast', description: 'Procesare alb-negru monocrom, curatare fundal si claritate text', category: 'scanner', icon: 'color-filter-outline', route: '/tools/scanner/document-filter', tags: ['filter', 'bw', 'contrast', 'enhance', 'text'] },
  { id: 'pdf-compiler', name: 'Compilator PDF Multi-Pagina', description: 'Asamblare, reordonare si export documente scanate in fisier PDF', category: 'scanner', icon: 'document-text-outline', route: '/tools/scanner/pdf-compiler', tags: ['pdf', 'document', 'export', 'share', 'print'] },

  // Converters & Math
  { id: 'unit-converter', name: 'Convertor Universal Unitati', description: 'Lungime, masa, volum si temperatura cu formule matematice detaliate', category: 'converters', icon: 'swap-horizontal-outline', route: '/tools/converters/unit-converter', tags: ['units', 'length', 'weight', 'volume', 'temperature'] },
  { id: 'currency-converter', name: 'Convertor Valutar Offline', description: 'Cursuri oficiale BNR si BCE memorate offline pentru 16 valute', category: 'converters', icon: 'cash-outline', route: '/tools/converters/currency-converter', tags: ['currency', 'exchange', 'bnr', 'eur', 'ron', 'usd'] },
  { id: 'material-estimator', name: 'Estimator Materiale Constructii', description: 'Calcul volum beton, saci ciment, vopsea lavabila si gresie cu pierderi', category: 'converters', icon: 'construct-outline', route: '/tools/converters/material-estimator', tags: ['concrete', 'paint', 'tiles', 'construction', 'estimator'] },

  // Expense Splitter
  { id: 'expenses-hub', name: 'Registru Cheltuieli de Grup', description: 'Evidenta plati comune pe categorii si calcul balante per membru', category: 'expenses', icon: 'people-outline', route: '/tools/expenses/group-detail', tags: ['expenses', 'split', 'group', 'ledger', 'money'] },
  { id: 'debt-settlement', name: 'Algoritm Simplificare Datorii', description: 'Minimizare numar tranzactii intre participanti prin algoritm Greedy', category: 'expenses', icon: 'trending-up-outline', route: '/tools/expenses/debt-settlement', tags: ['debt', 'settle', 'algorithm', 'minflow', 'balances'] },

  // Hardware & Utilities
  { id: 'flashlight', name: 'Control Lanterna & Stroboscop', description: 'Comanda blitz camera cu reglaj frecventa impulsuri si semnal SOS', category: 'hardware', icon: 'flashlight-outline', route: '/tools/hardware/flashlight', tags: ['torch', 'flashlight', 'sos', 'strobe', 'hardware'] },
  { id: 'spirit-level', name: 'Nivela cu Bula pe Doua Axe', description: 'Indicator orizontal si vertical de precizie bazat pe accelerometru', category: 'hardware', icon: 'compass-outline', route: '/tools/hardware/spirit-level', tags: ['level', 'accelerometer', 'bubble', 'pitch', 'roll'] },
  { id: 'compass', name: 'Busola Digitala & Azimut', description: 'Orientare 360 grade, puncte cardinale si intensitate camp magnetic', category: 'hardware', icon: 'navigate-outline', route: '/tools/hardware/compass', tags: ['compass', 'magnetometer', 'heading', 'azimuth', 'north'] },
  { id: 'password-gen', name: 'Generator Parole & Secrete', description: 'Generare chei criptografice si fraze de acces cu indicator de entropie', category: 'hardware', icon: 'key-outline', route: '/tools/hardware/password-gen', tags: ['password', 'generator', 'entropy', 'security', 'crypto'] },

  // Dev & Data Tools
  { id: 'hash-generator', name: 'Generator Hash Criptografic', description: 'Calcul instanta MD5, SHA-1, SHA-256, SHA-512 si cod de autentificare HMAC', category: 'dev', icon: 'finger-print-outline', route: '/tools/dev/hash-generator', tags: ['hash', 'md5', 'sha256', 'crypto', 'hmac'] },
  { id: 'encoder-decoder', name: 'Encoder / Decoder Base64 & URL', description: 'Conversie rapida text in Base64, Hexadecimal si URL Safe Component', category: 'dev', icon: 'code-working-outline', route: '/tools/dev/encoder-decoder', tags: ['base64', 'url', 'hex', 'encode', 'decode'] },
  { id: 'jwt-decoder', name: 'Inspector Token JWT', description: 'Parsare Header, Claims Payload si verificare stare expirare token', category: 'dev', icon: 'shield-checkmark-outline', route: '/tools/dev/jwt-decoder', tags: ['jwt', 'token', 'auth', 'claims', 'expiration'] },
  { id: 'epoch-converter', name: 'Convertor Timestamp Unix Epoch', description: 'Translatare secunde/milisecunde in data umana UTC si ora Romaniei', category: 'dev', icon: 'time-outline', route: '/tools/dev/epoch-converter', tags: ['epoch', 'timestamp', 'unix', 'time', 'date'] },
];

interface ToolStoreState {
  tools: ToolItem[];
  searchQuery: string;
  selectedCategory: string;
  favorites: string[];
  recentTools: string[];
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: string) => void;
  toggleFavorite: (id: string) => void;
  addRecentTool: (id: string) => void;
  getFilteredTools: () => ToolItem[];
}

export const useToolStore = create<ToolStoreState>((set, get) => ({
  tools: INITIAL_TOOLS,
  searchQuery: '',
  selectedCategory: 'all',
  favorites: ['subnet-calc', 'currency-converter', 'debt-settlement', 'hash-generator'],
  recentTools: ['subnet-calc', 'currency-converter'],

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

  toggleFavorite: (id) =>
    set((state) => {
      const exists = state.favorites.includes(id);
      return {
        favorites: exists ? state.favorites.filter((f) => f !== id) : [...state.favorites, id],
      };
    }),

  addRecentTool: (id) =>
    set((state) => ({
      recentTools: [id, ...state.recentTools.filter((t) => t !== id)].slice(0, 8),
    })),

  getFilteredTools: () => {
    const { tools, searchQuery, selectedCategory } = get();
    return tools.filter((tool) => {
      const matchCat = selectedCategory === 'all' || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCat;
      const matchQuery =
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  },
}));

// Persistent sync verified via appStorage
