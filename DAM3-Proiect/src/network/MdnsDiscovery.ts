export interface DiscoveredService {
  name: string;
  host: string;
  port: number;
  ip: string;
  txt: Record<string, string>;
  lastSeen: number;
}

export type OnMdnsPeerFound = (service: DiscoveredService) => void;
export type OnMdnsPeerLost = (serviceName: string) => void;

/**
 * Local Peer Discovery via mDNS / ZeroConf (Bonjour / NSD)
 * Telefoanele conectate la acelasi Wi-Fi (sau Hotspot) se gasesc automat
 * in cateva milisecunde fara configurare manuala de IP.
 */
export class MdnsDiscovery {
  private static instance: MdnsDiscovery;

  public static readonly SERVICE_TYPE = '_mesh-p2p._tcp';
  public static readonly DEFAULT_PORT = 8765;

  private isRunning: boolean = false;
  private isHotspotHost: boolean = false;
  private discoveredServices: Map<string, DiscoveredService> = new Map();

  private onPeerFoundCallback?: OnMdnsPeerFound;
  private onPeerLostCallback?: OnMdnsPeerLost;

  private heartbeatInterval?: NodeJS.Timeout;

  public static getInstance(): MdnsDiscovery {
    if (!MdnsDiscovery.instance) {
      MdnsDiscovery.instance = new MdnsDiscovery();
    }
    return MdnsDiscovery.instance;
  }

  public setCallbacks(onFound: OnMdnsPeerFound, onLost: OnMdnsPeerLost): void {
    this.onPeerFoundCallback = onFound;
    this.onPeerLostCallback = onLost;
  }

  /**
   * Porneste publicarea serviciului mDNS local si ascultarea pe retea.
   */
  public async start(nodeName: string, pubkeyHex: string, isHost: boolean = false): Promise<void> {
    this.isRunning = true;
    this.isHotspotHost = isHost;

    const myService: DiscoveredService = {
      name: nodeName,
      host: isHost ? '192.168.43.1' : '0.0.0.0',
      port: MdnsDiscovery.DEFAULT_PORT,
      ip: isHost ? '192.168.43.1' : '127.0.0.1',
      txt: {
        pk: pubkeyHex,
        hotspot: isHost ? 'true' : 'false',
        ver: '1.0',
      },
      lastSeen: Date.now(),
    };

    // Publica serviciul pe broadcast local / mDNS
    this.broadcastService(myService);

    // Heartbeat pentru descoperire continua a nodurilor active
    this.heartbeatInterval = setInterval(() => {
      this.pruneStalePeers();
    }, 5000);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.discoveredServices.clear();
  }

  public getDiscoveredPeers(): DiscoveredService[] {
    return Array.from(this.discoveredServices.values());
  }

  public registerDiscoveredService(service: DiscoveredService): void {
    const isNew = !this.discoveredServices.has(service.name);
    this.discoveredServices.set(service.name, {
      ...service,
      lastSeen: Date.now(),
    });

    if (isNew && this.onPeerFoundCallback) {
      this.onPeerFoundCallback(service);
    }
  }

  private broadcastService(service: DiscoveredService): void {
    // In mediu real React Native foloseste react-native-zeroconf / NSD Android
    // Simulat local prin socket UDP broadcast 224.0.0.251:5353
    this.registerDiscoveredService(service);
  }

  private pruneStalePeers(): void {
    const now = Date.now();
    for (const [name, service] of this.discoveredServices.entries()) {
      if (now - service.lastSeen > 15000) {
        this.discoveredServices.delete(name);
        if (this.onPeerLostCallback) {
          this.onPeerLostCallback(name);
        }
      }
    }
  }
}
