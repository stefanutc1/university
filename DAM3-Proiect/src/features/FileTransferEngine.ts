import { WebSocketP2PTransport } from '../network/WebSocketP2PTransport';

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  totalChunks: number;
  sha256Checksum: string;
  senderPubkey: string;
  timestamp: number;
}

export interface FileChunk {
  fileId: string;
  chunkIndex: number;
  totalChunks: number;
  dataBase64: string;
}

export type OnTransferProgress = (fileId: string, progress: number, isCompleted: boolean) => void;

/**
 * Transfer Rapid de Fisiere & Imagini (Local AirDrop-like)
 * Trimitere directa de fisiere mari, poze si documente direct device-to-device pe Wi-Fi
 * la viteze maxime, fara compresie sau limite de cloud.
 */
export class FileTransferEngine {
  private static instance: FileTransferEngine;

  public static readonly CHUNK_SIZE = 64 * 1024; // 64 KB per chunk

  private pendingTransfers: Map<string, FileMetadata> = new Map();
  private receivedChunks: Map<string, Map<number, string>> = new Map();
  private progressListeners: Set<OnTransferProgress> = new Set();
  private ws = WebSocketP2PTransport.getInstance();

  public static getInstance(): FileTransferEngine {
    if (!FileTransferEngine.instance) {
      FileTransferEngine.instance = new FileTransferEngine();
    }
    return FileTransferEngine.instance;
  }

  public onProgress(listener: OnTransferProgress): () => void {
    this.progressListeners.add(listener);
    return () => this.progressListeners.delete(listener);
  }

  /**
   * Imparte un fisier binar mare in chunk-uri si il transmite prin WebSocket P2P.
   */
  public async sendFile(
    fileData: string, // raw string sau base64
    fileName: string,
    mimeType: string,
    recipientIp?: string
  ): Promise<FileMetadata> {
    const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const size = fileData.length;
    const totalChunks = Math.ceil(size / FileTransferEngine.CHUNK_SIZE);

    const metadata: FileMetadata = {
      id: fileId,
      name: fileName,
      size,
      mimeType,
      totalChunks,
      sha256Checksum: this.simpleHash(fileData),
      senderPubkey: 'local-node',
      timestamp: Date.now(),
    };

    // 1. Notifica meta-informatia fisierului
    this.ws.sendPacket(
      {
        type: 'BINARY_CHUNK',
        senderId: 'local',
        recipientId: 'BROADCAST',
        payload: { isHeader: true, metadata },
        timestamp: Date.now(),
      },
      recipientIp
    );

    // 2. Transmite secvential chunk-urile
    for (let i = 0; i < totalChunks; i++) {
      const chunk = fileData.substring(
        i * FileTransferEngine.CHUNK_SIZE,
        (i + 1) * FileTransferEngine.CHUNK_SIZE
      );
      const chunkPacket: FileChunk = {
        fileId,
        chunkIndex: i,
        totalChunks,
        dataBase64: chunk,
      };

      this.ws.sendPacket(
        {
          type: 'BINARY_CHUNK',
          senderId: 'local',
          recipientId: 'BROADCAST',
          payload: { isHeader: false, chunk: chunkPacket },
          timestamp: Date.now(),
        },
        recipientIp
      );

      const progress = Math.round(((i + 1) / totalChunks) * 100);
      this.notifyProgress(fileId, progress, i + 1 === totalChunks);
    }

    return metadata;
  }

  /**
   * Proceseaza chunk-urile sosite de la alt nod din retea.
   */
  public processIncomingChunk(payload: any): string | null {
    if (payload.isHeader) {
      const meta: FileMetadata = payload.metadata;
      this.pendingTransfers.set(meta.id, meta);
      this.receivedChunks.set(meta.id, new Map());
      this.notifyProgress(meta.id, 0, false);
      return null;
    }

    const chunk: FileChunk = payload.chunk;
    if (!this.receivedChunks.has(chunk.fileId)) {
      this.receivedChunks.set(chunk.fileId, new Map());
    }

    const buffer = this.receivedChunks.get(chunk.fileId)!;
    buffer.set(chunk.chunkIndex, chunk.dataBase64);

    const progress = Math.round((buffer.size / chunk.totalChunks) * 100);
    const isDone = buffer.size === chunk.totalChunks;
    this.notifyProgress(chunk.fileId, progress, isDone);

    if (isDone) {
      let fullContent = '';
      for (let i = 0; i < chunk.totalChunks; i++) {
        fullContent += buffer.get(i) || '';
      }
      this.receivedChunks.delete(chunk.fileId);
      this.pendingTransfers.delete(chunk.fileId);
      return fullContent;
    }

    return null;
  }

  private notifyProgress(fileId: string, progress: number, isDone: boolean): void {
    this.progressListeners.forEach((l) => l(fileId, progress, isDone));
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }
}
