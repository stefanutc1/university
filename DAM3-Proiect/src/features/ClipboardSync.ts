import { WebSocketP2PTransport, P2PPacket } from '../network/WebSocketP2PTransport';

export interface ClipboardItem {
  id: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export type OnClipboardSynced = (item: ClipboardItem) => void;

/**
 * Clipboard Sync Local
 * Sincronizare automata sau la cerere a textului copiat in clipboard
 * intre telefoane sau intre telefon si laptopul din aceeasi retea.
 */
export class ClipboardSync {
  private static instance: ClipboardSync;

  private isAutoSyncEnabled: boolean = true;
  private clipboardHistory: ClipboardItem[] = [];
  private listeners: Set<OnClipboardSynced> = new Set();
  private ws = WebSocketP2PTransport.getInstance();

  public static getInstance(): ClipboardSync {
    if (!ClipboardSync.instance) {
      ClipboardSync.instance = new ClipboardSync();
    }
    return ClipboardSync.instance;
  }

  public setAutoSync(enabled: boolean): void {
    this.isAutoSyncEnabled = enabled;
  }

  public getAutoSync(): boolean {
    return this.isAutoSyncEnabled;
  }

  public getHistory(): ClipboardItem[] {
    return [...this.clipboardHistory];
  }

  public onSync(listener: OnClipboardSynced): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Distribuie textul copiat catre toate dispozitivele din reteaua locala.
   */
  public pushClipboard(text: string, senderName: string = 'Device'): ClipboardItem {
    const item: ClipboardItem = {
      id: 'clip_' + Date.now(),
      senderName,
      text,
      timestamp: Date.now(),
    };

    this.clipboardHistory.unshift(item);
    if (this.clipboardHistory.length > 30) this.clipboardHistory.pop();

    const packet: P2PPacket = {
      type: 'CLIPBOARD',
      senderId: senderName,
      recipientId: 'BROADCAST',
      payload: item,
      timestamp: Date.now(),
    };

    this.ws.sendPacket(packet);
    this.notify(item);
    return item;
  }

  /**
   * Proceseaza textul primit din clipboard-ul altui dispozitiv din retea.
   */
  public handleIncomingClipboard(payload: any): void {
    const item: ClipboardItem = payload;
    // Evita bucle daca item-ul exista deja
    if (this.clipboardHistory.some((c) => c.id === item.id)) return;

    this.clipboardHistory.unshift(item);
    if (this.clipboardHistory.length > 30) this.clipboardHistory.pop();

    this.notify(item);
  }

  private notify(item: ClipboardItem): void {
    this.listeners.forEach((l) => l(item));
  }
}
