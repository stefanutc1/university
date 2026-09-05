import { CryptoEngine } from '../crypto/CryptoEngine';
import { BleMeshTransport } from '../network/BleMeshTransport';
import { LocalPeerTransport } from '../network/LocalPeerTransport';
import { PacketFragmenter } from '../network/PacketFragmenter';
import { EncryptedStorage } from '../storage/EncryptedStorage';
import { MeshDiagnostics } from '../diagnostics/MeshDiagnostics';
import { Message, MessageEnvelope, MessageType, Peer, SOSAlert } from '../types';

export class MeshRouter {
  private static instance: MeshRouter;

  private crypto = CryptoEngine.getInstance();
  private ble = BleMeshTransport.getInstance();
  private localP2p = LocalPeerTransport.getInstance();
  private storage = EncryptedStorage.getInstance();
  private diagnostics = MeshDiagnostics.getInstance();
  private fragmenter = new PacketFragmenter();

  private deduplicationCache = new Set<string>();
  private deduplicationQueue: string[] = [];
  private storeAndForwardQueue: MessageEnvelope[] = [];
  private knownPeers = new Map<string, Peer>();

  private onMessageListeners: ((message: Message) => void)[] = [];
  private onSosListeners: ((alert: SOSAlert) => void)[] = [];
  private onPeersListeners: ((peers: Peer[]) => void)[] = [];

  private constructor() {
    this.ble.setCallbacks(
      (dataHex, peerId) => this.ingestPacket(dataHex, peerId),
      (peer) => this.handlePeerDiscovered(peer)
    );
    this.localP2p.setCallback((dataHex, peerId) => this.ingestPacket(dataHex, peerId));
  }

  public static getInstance(): MeshRouter {
    if (!MeshRouter.instance) {
      MeshRouter.instance = new MeshRouter();
    }
    return MeshRouter.instance;
  }

  public onMessage(callback: (msg: Message) => void): () => void {
    this.onMessageListeners.push(callback);
    return () => {
      this.onMessageListeners = this.onMessageListeners.filter((l) => l !== callback);
    };
  }

  public onSos(callback: (alert: SOSAlert) => void): () => void {
    this.onSosListeners.push(callback);
    return () => {
      this.onSosListeners = this.onSosListeners.filter((l) => l !== callback);
    };
  }

  public onPeers(callback: (peers: Peer[]) => void): () => void {
    this.onPeersListeners.push(callback);
    return () => {
      this.onPeersListeners = this.onPeersListeners.filter((l) => l !== callback);
    };
  }

  // --- Outbound Message Creation ---

  public async sendTextMessage(
    recipientPubkeyHex: string,
    recipientAgreementPubkeyHex: string,
    content: string
  ): Promise<Message> {
    const encrypted = this.crypto.encrypt(content, recipientAgreementPubkeyHex);
    const messageId = this.generateUuid();

    // Sign payload
    const payloadToSign = encrypted.ciphertextHex + encrypted.nonceHex + encrypted.authTagHex;
    const signature = this.crypto.sign(payloadToSign);

    const envelope: MessageEnvelope = {
      version: 1,
      messageId,
      type: MessageType.ENVELOPE,
      isBroadcast: false,
      hopLimit: 7,
      hopCount: 0,
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400 * 1000,
      senderPubkey: this.crypto.publicKeyHex,
      recipientPubkey: recipientPubkeyHex,
      nonce: encrypted.nonceHex,
      authTag: encrypted.authTagHex,
      ciphertext: encrypted.ciphertextHex,
      signature,
    };

    const message: Message = {
      id: messageId,
      conversationId: recipientPubkeyHex,
      senderPubkey: this.crypto.publicKeyHex,
      recipientPubkey: recipientPubkeyHex,
      content,
      timestamp: Date.now(),
      state: 'SENDING',
      isOutgoing: true,
      hopCount: 0,
      relayNodes: [],
    };

    await this.storage.saveMessage(message);
    this.notifyMessage(message);

    this.dispatchEnvelope(envelope);
    return message;
  }

  public async broadcastSos(
    latitude: number | null,
    longitude: number | null,
    note: string
  ): Promise<SOSAlert> {
    const messageId = this.generateUuid();
    const payload = JSON.stringify({
      lat: latitude,
      lon: longitude,
      note,
      ts: Date.now(),
    });

    const payloadHex = this.crypto.uint8ArrayToHex(new TextEncoder().encode(payload));
    const signature = this.crypto.sign(payloadHex);

    const envelope: MessageEnvelope = {
      version: 1,
      messageId,
      type: MessageType.SOS_BEACON,
      isBroadcast: true,
      hopLimit: 12,
      hopCount: 0,
      createdAt: Date.now(),
      expiresAt: Date.now() + 86400 * 1000,
      senderPubkey: this.crypto.publicKeyHex,
      recipientPubkey: '00'.repeat(32),
      nonce: '00'.repeat(24),
      authTag: '00'.repeat(16),
      ciphertext: payloadHex,
      signature,
    };

    const alert: SOSAlert = {
      id: messageId,
      senderPubkey: this.crypto.publicKeyHex,
      timestamp: Date.now(),
      latitude,
      longitude,
      accuracyMeters: 5,
      note,
      relayAttempts: 0,
    };

    await this.storage.saveSosAlert(alert);
    this.notifySos(alert);

    this.dispatchEnvelope(envelope);
    return alert;
  }

  // --- Dispatch & Store-and-Forward ---

  public dispatchEnvelope(envelope: MessageEnvelope): void {
    const serializedHex = this.serializeEnvelope(envelope);
    this.diagnostics.recordSent();

    const fragments = PacketFragmenter.fragment(serializedHex, envelope.messageId, 180);
    for (const frag of fragments) {
      this.ble.broadcastPacket(JSON.stringify(frag));
    }
    this.localP2p.broadcast(serializedHex);

    // Buffer in store-and-forward queue if no active neighbors
    if (this.knownPeers.size === 0) {
      if (this.storeAndForwardQueue.length < 1000) {
        this.storeAndForwardQueue.push(envelope);
        this.diagnostics.updateQueueDepth(this.storeAndForwardQueue.length);
      }
    }
  }

  // --- Inbound Ingestion & Multi-Hop Relay ---

  public async ingestPacket(rawHex: string, fromPeerId: string): Promise<void> {
    let payloadHex = rawHex;

    // Check if JSON fragment
    if (rawHex.startsWith('{') && rawHex.includes('fragmentIndex')) {
      try {
        const frag = JSON.parse(rawHex);
        const reassembled = this.fragmenter.processFragment(frag);
        if (!reassembled) return; // Wait for remaining fragments
        payloadHex = reassembled;
      } catch {
        return;
      }
    }

    const envelope = this.deserializeEnvelope(payloadHex);
    if (!envelope) return;

    this.diagnostics.recordReceived();

    // 1. Sliding Window Deduplication Check
    if (this.deduplicationCache.has(envelope.messageId)) {
      this.diagnostics.recordDroppedDuplicate();
      return;
    }
    this.addToDeduplicationCache(envelope.messageId);

    // 2. Expiration Check
    if (Date.now() > envelope.expiresAt) {
      return;
    }

    // 3. SOS Broadcast Check
    if (envelope.type === MessageType.SOS_BEACON || envelope.isBroadcast) {
      try {
        const decodedJson = new TextDecoder().decode(
          this.crypto.hexToUint8Array(envelope.ciphertext)
        );
        const parsed = JSON.parse(decodedJson);
        const alert: SOSAlert = {
          id: envelope.messageId,
          senderPubkey: envelope.senderPubkey,
          timestamp: parsed.ts || Date.now(),
          latitude: parsed.lat,
          longitude: parsed.lon,
          accuracyMeters: null,
          note: parsed.note || 'EMERGENCY SOS',
          relayAttempts: envelope.hopCount,
        };
        await this.storage.saveSosAlert(alert);
        this.notifySos(alert);
      } catch {}

      this.relayIfPermitted(envelope, fromPeerId);
      return;
    }

    // 4. Intended Recipient Check
    if (envelope.recipientPubkey === this.crypto.publicKeyHex) {
      try {
        const plaintext = this.crypto.decrypt(
          envelope.ciphertext,
          envelope.nonce,
          envelope.authTag,
          envelope.senderPubkey
        );

        const message: Message = {
          id: envelope.messageId,
          conversationId: envelope.senderPubkey,
          senderPubkey: envelope.senderPubkey,
          recipientPubkey: this.crypto.publicKeyHex,
          content: plaintext,
          timestamp: envelope.createdAt,
          state: 'DELIVERED',
          isOutgoing: false,
          hopCount: envelope.hopCount,
          relayNodes: [fromPeerId],
        };

        await this.storage.saveMessage(message);
        this.notifyMessage(message);
      } catch (e) {
        this.diagnostics.recordDroppedTampered();
      }
      return;
    }

    // 5. Intermediary Relay Node: Forward Ciphertext Blindly
    this.relayIfPermitted(envelope, fromPeerId);
  }

  private relayIfPermitted(envelope: MessageEnvelope, excludePeerId: string): void {
    if (envelope.hopLimit <= 1) {
      this.diagnostics.recordDroppedHopLimit();
      return;
    }

    const forwarded: MessageEnvelope = {
      ...envelope,
      hopLimit: envelope.hopLimit - 1,
      hopCount: envelope.hopCount + 1,
    };

    this.diagnostics.recordRelayed();
    this.dispatchEnvelope(forwarded);
  }

  // --- Peer Discovery & Queue Flush ---

  private handlePeerDiscovered(peer: Peer): void {
    this.knownPeers.set(peer.id, peer);
    this.diagnostics.updateActivePeers(this.knownPeers.size);
    this.notifyPeers();

    // Flush Store-and-Forward Queue on link establishment
    this.flushQueue();
  }

  private flushQueue(): void {
    if (this.storeAndForwardQueue.length === 0) return;
    const queued = [...this.storeAndForwardQueue];
    this.storeAndForwardQueue = [];
    this.diagnostics.updateQueueDepth(0);

    for (const env of queued) {
      this.dispatchEnvelope(env);
    }
  }

  private addToDeduplicationCache(messageId: string): void {
    this.deduplicationCache.add(messageId);
    this.deduplicationQueue.push(messageId);
    if (this.deduplicationQueue.length > 10000) {
      const oldest = this.deduplicationQueue.shift();
      if (oldest) this.deduplicationCache.delete(oldest);
    }
  }

  private serializeEnvelope(env: MessageEnvelope): string {
    return JSON.stringify(env);
  }

  private deserializeEnvelope(str: string): MessageEnvelope | null {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  private generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private notifyMessage(msg: Message): void {
    this.onMessageListeners.forEach((l) => l(msg));
  }

  private notifySos(alert: SOSAlert): void {
    this.onSosListeners.forEach((l) => l(alert));
  }

  private notifyPeers(): void {
    const list = Array.from(this.knownPeers.values());
    this.onPeersListeners.forEach((l) => l(list));
  }
}
