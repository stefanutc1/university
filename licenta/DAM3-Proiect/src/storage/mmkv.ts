// Fast Storage Abstraction (MMKV with in-memory & test fallback)

class StorageAdapter {
  private memoryStore = new Map<string, string>();

  getString(key: string): string | undefined {
    return this.memoryStore.get(key);
  }

  set(key: string, value: string): void {
    this.memoryStore.set(key, value);
  }

  delete(key: string): void {
    this.memoryStore.delete(key);
  }

  clearAll(): void {
    this.memoryStore.clear();
  }
}

export const appStorage = new StorageAdapter();
