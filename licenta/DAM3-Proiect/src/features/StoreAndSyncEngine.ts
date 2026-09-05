import { WebSocketP2PTransport, P2PPacket } from '../network/WebSocketP2PTransport';
import { EncryptedStorage } from '../storage/EncryptedStorage';
import { Message } from '../types';

export interface SyncRequest {
  nodeId: string;
  lastSyncTimestamp: number;
}

export interface SyncResponse {
  nodeId: string;
  missedMessages: Message[];
  syncTimestamp: number;
}

/**
 * Sincronizare Baza de Date la Reconectare (Store & Sync)
 * Daca cineva iese din raza Wi-Fi si revine mai tarziu, aplicatia ii livreaza
 * automat toate mesajele si fisierele trimise in grup cat timp a fost deconectat.
 */
export class StoreAndSyncEngine {
  private static instance: StoreAndSyncEngine;

  private lastKnownOnlineTime: number = Date.now();
  private storage = EncryptedStorage.getInstance();
  private ws = WebSocketP2PTransport.getInstance();

  public static getInstance(): StoreAndSyncEngine {
    if (!StoreAndSyncEngine.instance) {
      StoreAndSyncEngine.instance = new StoreAndSyncEngine();
    }
    return StoreAndSyncEngine.instance;
  }

  /**
   * Apelat automat cand dispozitivul se reconecteaza la un Wi-Fi / Hotspot local.
   * Trimite un pachet SYNC_REQ cu timestamp-ul ultimei deconectari.
   */
  public triggerReconnectionSync(myNodeId: string): void {
    const request: SyncRequest = {
      nodeId: myNodeId,
      lastSyncTimestamp: this.lastKnownOnlineTime,
    };

    const packet: P2PPacket = {
      type: 'SYNC_REQ',
      senderId: myNodeId,
      recipientId: 'BROADCAST',
      payload: request,
      timestamp: Date.now(),
    };

    this.ws.sendPacket(packet);
  }

  /**
   * Un nod online raspunde la SYNC_REQ trimitand mesajele ratate din coada sa locala.
   */
  public handleSyncRequest(req: SyncRequest, responderNodeId: string): void {
    const allConversations = this.storage.getConversations();
    const missed: Message[] = [];

    // Aduna mesajele mai noi decat lastSyncTimestamp
    for (const conv of allConversations) {
      const msgs = this.storage.getMessages(conv.id);
      for (const m of msgs) {
        if (m.timestamp > req.lastSyncTimestamp) {
          missed.push(m);
        }
      }
    }

    if (missed.length === 0) return;

    const response: SyncResponse = {
      nodeId: responderNodeId,
      missedMessages: missed,
      syncTimestamp: Date.now(),
    };

    const packet: P2PPacket = {
      type: 'SYNC_RES',
      senderId: responderNodeId,
      recipientId: req.nodeId,
      payload: response,
      timestamp: Date.now(),
    };

    this.ws.sendPacket(packet);
  }

  /**
   * Nodul reconectat primeste raspunsul si integreaza mesajele ratate in baza locala.
   */
  public async handleSyncResponse(res: SyncResponse): Promise<number> {
    let importedCount = 0;
    for (const msg of res.missedMessages) {
      await this.storage.saveMessage(msg);
      importedCount++;
    }
    this.lastKnownOnlineTime = res.syncTimestamp;
    return importedCount;
  }

  public recordDisconnect(): void {
    this.lastKnownOnlineTime = Date.now();
  }
}
