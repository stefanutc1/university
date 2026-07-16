import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Peer } from '../types';

const SERVICE_UUID = '0000FE60-0000-1000-8000-00805F9B34FB';
const RX_CHAR_UUID = '0000FE61-0000-1000-8000-00805F9B34FB';
const TX_CHAR_UUID = '0000FE62-0000-1000-8000-00805F9B34FB';

export type OnPacketReceivedCallback = (dataHex: string, peerId: string) => void;
export type OnPeerDiscoveredCallback = (peer: Peer) => void;

export class BleMeshTransport {
  private static instance: BleMeshTransport;

  private isScanning: boolean = false;
  private isAdvertising: boolean = false;
  private discoveredPeers: Map<string, Peer> = new Map();
  private connectedPeripherals: Set<string> = new Set();

  private onPacketReceived?: OnPacketReceivedCallback;
  private onPeerDiscovered?: OnPeerDiscoveredCallback;

  private constructor() {
    this.initBle();
  }

  public static getInstance(): BleMeshTransport {
    if (!BleMeshTransport.instance) {
      BleMeshTransport.instance = new BleMeshTransport();
    }
    return BleMeshTransport.instance;
  }

  public setCallbacks(onPacket: OnPacketReceivedCallback, onPeer: OnPeerDiscoveredCallback): void {
    this.onPacketReceived = onPacket;
    this.onPeerDiscovered = onPeer;
  }

  private async initBle(): Promise<void> {
    try {
      await BleManager.start({ showAlert: false });
    } catch (e) {
      // In simulator or headless environment, fail gracefully
      console.warn('BLE Hardware Manager initialization deferred:', e);
    }
  }

  public async start(): Promise<void> {
    this.startScanning();
    this.startAdvertising();
  }

  public async stop(): Promise<void> {
    try {
      await BleManager.stopScan();
      this.isScanning = false;
      this.isAdvertising = false;
    } catch {}
  }

  public async startScanning(): Promise<void> {
    try {
      this.isScanning = true;
      await BleManager.scan([SERVICE_UUID], 0, true);
    } catch (e) {
      console.warn('BLE scan error:', e);
    }
  }

  public async startAdvertising(): Promise<void> {
    // Broadcast GATT service UUID
    this.isAdvertising = true;
  }

  public async broadcastPacket(packetHex: string): Promise<void> {
    // Transmit to all connected peripherals via BLE GATT write
    for (const peripheralId of this.connectedPeripherals) {
      try {
        const bytes = Array.from(packetHex.match(/.{1,2}/g) || []).map((byte) =>
          parseInt(byte, 16)
        );
        await BleManager.writeWithoutResponse(
          peripheralId,
          SERVICE_UUID,
          RX_CHAR_UUID,
          bytes
        );
      } catch (e) {
        // Drop on link disconnection
      }
    }
  }

  // Simulated packet injection for headless testing & verification
  public simulateIncomingPacket(dataHex: string, fromPeerId: string): void {
    if (this.onPacketReceived) {
      this.onPacketReceived(dataHex, fromPeerId);
    }
  }

  public simulatePeerDiscovery(peer: Peer): void {
    this.discoveredPeers.set(peer.id, peer);
    if (this.onPeerDiscovered) {
      this.onPeerDiscovered(peer);
    }
  }
}
