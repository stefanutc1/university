import { Peer } from '../types';

export class LocalPeerTransport {
  private static instance: LocalPeerTransport;
  private isRunning: boolean = false;
  private connectedSockets: Map<string, any> = new Map();

  private onPacketReceived?: (dataHex: string, peerId: string) => void;

  public static getInstance(): LocalPeerTransport {
    if (!LocalPeerTransport.instance) {
      LocalPeerTransport.instance = new LocalPeerTransport();
    }
    return LocalPeerTransport.instance;
  }

  public setCallback(callback: (dataHex: string, peerId: string) => void): void {
    this.onPacketReceived = callback;
  }

  public start(): void {
    this.isRunning = true;
  }

  public stop(): void {
    this.isRunning = false;
    this.connectedSockets.clear();
  }

  public broadcast(packetHex: string): void {
    // High-bandwidth local broadcast to nearby Wi-Fi P2P / ad-hoc neighbors
    for (const [peerId, socket] of this.connectedSockets) {
      try {
        if (socket && typeof socket.write === 'function') {
          socket.write(packetHex);
        }
      } catch {}
    }
  }

  public simulateReceive(dataHex: string, peerId: string): void {
    if (this.onPacketReceived) {
      this.onPacketReceived(dataHex, peerId);
    }
  }
}
