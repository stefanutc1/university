// Zustand Settings Store
import { create } from 'zustand';

interface SettingsStoreState {
  backendUrl: string;
  isDarkMode: boolean;
  hapticsEnabled: boolean;
  telemetryEnabled: boolean;
  setBackendUrl: (url: string) => void;
  toggleDarkMode: () => void;
  toggleHaptics: () => void;
  toggleTelemetry: () => void;
}

export const useSettingsStore = create<SettingsStoreState>((set) => ({
  backendUrl: 'http://192.168.1.100:8080',
  isDarkMode: true,
  hapticsEnabled: true,
  telemetryEnabled: true,

  setBackendUrl: (backendUrl) => set({ backendUrl }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
  toggleTelemetry: () => set((state) => ({ telemetryEnabled: !state.telemetryEnabled })),
}));
