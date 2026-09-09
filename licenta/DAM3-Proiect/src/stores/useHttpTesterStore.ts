// Zustand Store for Local HTTP / API Tester (Postman Lite)
import { create } from 'zustand';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface HttpResponseData {
  status: number;
  statusText: string;
  timeMs: number;
  sizeKb: number;
  headers: Record<string, string>;
  body: string;
}

export interface HttpRequestRecord {
  id: string;
  method: HttpMethod;
  url: string;
  headers: Record<string, string>;
  body: string;
  timestamp: string;
  response?: HttpResponseData;
}

interface HttpTesterState {
  currentMethod: HttpMethod;
  currentUrl: string;
  currentHeaders: string; // JSON or raw text
  currentBody: string;
  isLoading: boolean;
  lastResponse: HttpResponseData | null;
  history: HttpRequestRecord[];
  savedPresets: { name: string; method: HttpMethod; url: string; body?: string }[];
  setCurrentMethod: (m: HttpMethod) => void;
  setCurrentUrl: (u: string) => void;
  setCurrentHeaders: (h: string) => void;
  setCurrentBody: (b: string) => void;
  executeRequest: () => Promise<void>;
  clearHistory: () => void;
  loadFromHistory: (record: HttpRequestRecord) => void;
}

const DEFAULT_PRESETS = [
  { name: 'Backend Health Check', method: 'GET' as HttpMethod, url: 'http://localhost:8080/api/v1/health' },
  { name: 'Cursuri Valutare BNR', method: 'GET' as HttpMethod, url: 'http://localhost:8080/api/v1/rates' },
  { name: 'Grupuri Cheltuieli', method: 'GET' as HttpMethod, url: 'http://localhost:8080/api/v1/groups' },
  { name: 'HTTPBin Echo GET', method: 'GET' as HttpMethod, url: 'https://httpbin.org/get' },
];

export const useHttpTesterStore = create<HttpTesterState>((set, get) => ({
  currentMethod: 'GET',
  currentUrl: 'http://localhost:8080/api/v1/health',
  currentHeaders: '{\n  "Accept": "application/json"\n}',
  currentBody: '{\n  "message": "Hello from DAM3"\n}',
  isLoading: false,
  lastResponse: null,
  history: [],
  savedPresets: DEFAULT_PRESETS,

  setCurrentMethod: (currentMethod) => set({ currentMethod }),
  setCurrentUrl: (currentUrl) => set({ currentUrl }),
  setCurrentHeaders: (currentHeaders) => set({ currentHeaders }),
  setCurrentBody: (currentBody) => set({ currentBody }),

  executeRequest: async () => {
    const { currentMethod, currentUrl, currentHeaders, currentBody } = get();
    set({ isLoading: true, lastResponse: null });

    const startTime = Date.now();
    try {
      let parsedHeaders: Record<string, string> = {};
      try {
        parsedHeaders = JSON.parse(currentHeaders || '{}');
      } catch {
        parsedHeaders = { 'Content-Type': 'application/json' };
      }

      const options: RequestInit = {
        method: currentMethod,
        headers: parsedHeaders,
      };

      if (['POST', 'PUT', 'PATCH'].includes(currentMethod) && currentBody) {
        options.body = currentBody;
      }

      const res = await fetch(currentUrl, options);
      const timeMs = Date.now() - startTime;
      const text = await res.text();
      const sizeKb = Math.round((text.length / 1024) * 100) / 100;

      const resHeaders: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        resHeaders[k] = v;
      });

      let formattedBody = text;
      try {
        const json = JSON.parse(text);
        formattedBody = JSON.stringify(json, null, 2);
      } catch {
        // Keep raw text
      }

      const responseData: HttpResponseData = {
        status: res.status,
        statusText: res.statusText || (res.ok ? 'OK' : 'Error'),
        timeMs,
        sizeKb,
        headers: resHeaders,
        body: formattedBody,
      };

      const record: HttpRequestRecord = {
        id: `req_${Date.now()}`,
        method: currentMethod,
        url: currentUrl,
        headers: parsedHeaders,
        body: currentBody,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        response: responseData,
      };

      set((state) => ({
        isLoading: false,
        lastResponse: responseData,
        history: [record, ...state.history].slice(0, 20),
      }));
    } catch (err: any) {
      const timeMs = Date.now() - startTime;
      const errorData: HttpResponseData = {
        status: 0,
        statusText: 'Network / Connection Failed',
        timeMs,
        sizeKb: 0,
        headers: {},
        body: err.message || 'Nu s-a putut stabili conexiunea catre server.',
      };

      set({
        isLoading: false,
        lastResponse: errorData,
      });
    }
  },

  clearHistory: () => set({ history: [] }),

  loadFromHistory: (record) => {
    set({
      currentMethod: record.method,
      currentUrl: record.url,
      currentHeaders: JSON.stringify(record.headers, null, 2),
      currentBody: record.body,
      lastResponse: record.response || null,
    });
  },
}));
