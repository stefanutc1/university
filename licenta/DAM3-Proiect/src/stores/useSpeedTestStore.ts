// Zustand Store for Speed Test & Latency Monitor
import { create } from 'zustand';

export interface SpeedTestResult {
  id: string;
  timestamp: string;
  pingMs: number;
  jitterMs: number;
  downloadMbps: number;
  uploadMbps: number;
  networkType: 'Wi-Fi' | '5G' | '4G' | 'LAN';
  serverName: string;
}

interface SpeedTestState {
  history: SpeedTestResult[];
  isTesting: boolean;
  currentPhase: 'idle' | 'ping' | 'download' | 'upload' | 'complete';
  currentPing: number;
  currentDownload: number;
  currentUpload: number;
  selectedServer: string;
  servers: { id: string; name: string; url: string }[];
  setSelectedServer: (id: string) => void;
  addResult: (res: Omit<SpeedTestResult, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
}

const DEFAULT_SERVERS = [
  { id: 'cloudflare', name: 'Cloudflare Edge (București)', url: 'https://1.1.1.1' },
  { id: 'google', name: 'Google DNS Anycast', url: 'https://dns.google' },
  { id: 'homelab', name: 'Nod Local Homelab / Gateway', url: 'http://192.168.1.1' },
];

const INITIAL_HISTORY: SpeedTestResult[] = [
  { id: 'st1', timestamp: '2026-09-08 18:30', pingMs: 8, jitterMs: 1.2, downloadMbps: 485.4, uploadMbps: 310.2, networkType: 'Wi-Fi', serverName: 'Cloudflare Edge (București)' },
  { id: 'st2', timestamp: '2026-09-08 14:15', pingMs: 24, jitterMs: 4.8, downloadMbps: 120.6, uploadMbps: 42.1, networkType: '5G', serverName: 'Cloudflare Edge (București)' },
  { id: 'st3', timestamp: '2026-09-07 21:05', pingMs: 3, jitterMs: 0.5, downloadMbps: 940.2, uploadMbps: 890.5, networkType: 'LAN', serverName: 'Nod Local Homelab / Gateway' },
];

export const useSpeedTestStore = create<SpeedTestState>((set) => ({
  history: INITIAL_HISTORY,
  isTesting: false,
  currentPhase: 'idle',
  currentPing: 0,
  currentDownload: 0,
  currentUpload: 0,
  selectedServer: 'cloudflare',
  servers: DEFAULT_SERVERS,

  setSelectedServer: (selectedServer) => set({ selectedServer }),

  addResult: (res) =>
    set((state) => ({
      history: [
        {
          ...res,
          id: `st_${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
        ...state.history,
      ].slice(0, 30), // keep last 30 tests
    })),

  clearHistory: () => set({ history: [] }),
}));
