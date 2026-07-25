import { DiagnosticMetrics } from '../types';

export class MeshDiagnostics {
  private static instance: MeshDiagnostics;

  private metrics: DiagnosticMetrics = {
    packetsSent: 0,
    packetsReceived: 0,
    packetsRelayed: 0,
    packetsDroppedDuplicate: 0,
    packetsDroppedHopLimit: 0,
    packetsDroppedTampered: 0,
    activePeersCount: 0,
    queueDepth: 0,
  };

  private eventLog: string[] = [];
  private listeners: Set<() => void> = new Set();

  public static getInstance(): MeshDiagnostics {
    if (!MeshDiagnostics.instance) {
      MeshDiagnostics.instance = new MeshDiagnostics();
    }
    return MeshDiagnostics.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  public getMetrics(): DiagnosticMetrics {
    return { ...this.metrics };
  }

  public getEventLog(): string[] {
    return [...this.eventLog];
  }

  public recordSent(): void {
    this.metrics.packetsSent++;
    this.addLog('TX: Outbound packet emitted');
    this.notify();
  }

  public recordReceived(): void {
    this.metrics.packetsReceived++;
    this.addLog('RX: Inbound packet received');
    this.notify();
  }

  public recordRelayed(): void {
    this.metrics.packetsRelayed++;
    this.addLog('RELAY: Ciphertext forwarded to neighbors');
    this.notify();
  }

  public recordDroppedDuplicate(): void {
    this.metrics.packetsDroppedDuplicate++;
    this.addLog('DROP: Duplicate message ID detected');
    this.notify();
  }

  public recordDroppedHopLimit(): void {
    this.metrics.packetsDroppedHopLimit++;
    this.addLog('DROP: Hop limit exhausted');
    this.notify();
  }

  public recordDroppedTampered(): void {
    this.metrics.packetsDroppedTampered++;
    this.addLog('SECURITY: Tampered payload or MAC verification failure');
    this.notify();
  }

  public updateActivePeers(count: number): void {
    this.metrics.activePeersCount = count;
    this.notify();
  }

  public updateQueueDepth(depth: number): void {
    this.metrics.queueDepth = depth;
    this.notify();
  }

  private addLog(msg: string): void {
    const time = new Date().toTimeString().split(' ')[0];
    this.eventLog.unshift(`[${time}] ${msg}`);
    if (this.eventLog.length > 100) {
      this.eventLog.pop();
    }
  }
}
