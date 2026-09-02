import { WebSocketP2PTransport, P2PPacket } from '../network/WebSocketP2PTransport';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IncidentPin {
  id: string;
  authorName: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: IncidentSeverity;
  timestamp: number;
}

export type OnIncidentPinAdded = (pin: IncidentPin) => void;

/**
 * Harti & Marcaje Offline (Incident Pinning)
 * Salvarea coordonatelor GPS si a descrierii unui incident pe o harta pre-descarcata
 * local (OpenStreetMap), distribuita instant tuturor colegilor din retea.
 */
export class IncidentMapEngine {
  private static instance: IncidentMapEngine;

  private incidents: IncidentPin[] = [];
  private listeners: Set<OnIncidentPinAdded> = new Set();
  private ws = WebSocketP2PTransport.getInstance();

  public static getInstance(): IncidentMapEngine {
    if (!IncidentMapEngine.instance) {
      IncidentMapEngine.instance = new IncidentMapEngine();
    }
    return IncidentMapEngine.instance;
  }

  public getIncidents(): IncidentPin[] {
    return [...this.incidents].sort((a, b) => b.timestamp - a.timestamp);
  }

  public onIncident(listener: OnIncidentPinAdded): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Creeaza si distribuie un nou incident GPS pe retea.
   */
  public addIncident(
    title: string,
    description: string,
    latitude: number,
    longitude: number,
    severity: IncidentSeverity = 'MEDIUM',
    authorName: string = 'Operator'
  ): IncidentPin {
    const pin: IncidentPin = {
      id: 'inc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      authorName,
      title,
      description,
      latitude,
      longitude,
      severity,
      timestamp: Date.now(),
    };

    this.incidents.unshift(pin);

    const packet: P2PPacket = {
      type: 'INCIDENT',
      senderId: authorName,
      recipientId: 'BROADCAST',
      payload: pin,
      timestamp: Date.now(),
    };

    this.ws.sendPacket(packet);
    this.notify(pin);
    return pin;
  }

  /**
   * Proceseaza incidentele primite de la alte noduri.
   */
  public processIncomingIncident(payload: any): void {
    const pin: IncidentPin = payload;
    if (this.incidents.some((i) => i.id === pin.id)) return;

    this.incidents.unshift(pin);
    this.notify(pin);
  }

  private notify(pin: IncidentPin): void {
    this.listeners.forEach((l) => l(pin));
  }
}
