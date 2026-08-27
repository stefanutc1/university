import { MdnsDiscovery } from './MdnsDiscovery';
import { WebSocketP2PTransport, P2PPacket } from './WebSocketP2PTransport';

export class LocalPeerTransport {
  private static instance: LocalPeerTransport;
  private isRunning: boolean = false;
  private mdns = MdnsDiscovery.getInstance();
  private ws = WebSocketP2PTransport.getInstance();

  private onPacketReceived?: (dataHex: string, peerId: string) => void;

  public static getInstance(): LocalPeerTransport {
    if (!LocalPeerTransport.instance) {
      LocalPeerTransport.instance = new LocalPeerTransport();
    }
    return LocalPeerTransport.instance;
  }

  public setCallback(callback: (dataHex: string, peerId: string) => void): void {
    this.onPacketReceived = callback;
    this.ws.setCallback((packet, senderIp) => {
      if (this.onPacketReceived) {
        this.onPacketReceived(JSON.stringify(packet.payload), senderIp);
      }
    });
  }

  public start(isHotspotHost: boolean = false, nodeName: string = 'MeshNode', pubkey: string = ''): void {
    this.isRunning = true;
    this.mdns.start(nodeName, pubkey, isHotspotHost);
    this.ws.start(isHotspotHost);
  }

  public stop(): void {
    this.isRunning = false;
    this.mdns.stop();
    this.ws.stop();
  }

  public broadcast(packetHex: string): void {
    const packet: P2PPacket = {
      type: 'TEXT',
      senderId: 'local',
      recipientId: 'BROADCAST',
      payload: packetHex,
      timestamp: Date.now(),
    };
    this.ws.sendPacket(packet);
  }

  public simulateReceive(dataHex: string, peerId: string): void {
    if (this.onPacketReceived) {
      this.onPacketReceived(dataHex, peerId);
    }
  }
}
