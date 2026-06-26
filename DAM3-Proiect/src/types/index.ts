export type DeliveryState =
  | 'PENDING'
  | 'SENDING'
  | 'RELAYED'
  | 'DELIVERED'
  | 'FAILED'
  | 'EXPIRED';

export enum MessageType {
  ENVELOPE = 0x01,
  FRAGMENT = 0x02,
  ACK = 0x03,
  SOS_BEACON = 0x04,
  PEER_HELLO = 0x05,
}

export interface Peer {
  id: string;
  publicKeyHex: string;
  shortName: string;
  rssi: number;
  lastSeen: number;
  isConnected: boolean;
  hopCount: number;
  isDirectNeighbor: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderPubkey: string;
  recipientPubkey: string;
  content: string;
  timestamp: number;
  state: DeliveryState;
  isOutgoing: boolean;
  hopCount: number;
  relayNodes: string[];
}

export interface Conversation {
  id: string;
  peerPubkey: string;
  peerName: string;
  lastMessageSnippet: string;
  lastMessageDate: number;
  unreadCount: number;
}

export interface MessageEnvelope {
  version: number;
  messageId: string;
  type: MessageType;
  isBroadcast: boolean;
  hopLimit: number;
  hopCount: number;
  createdAt: number;
  expiresAt: number;
  senderPubkey: string; // hex
  recipientPubkey: string; // hex
  nonce: string; // hex
  authTag: string; // hex
  ciphertext: string; // hex
  signature: string; // hex
}

export interface SOSAlert {
  id: string;
  senderPubkey: string;
  timestamp: number;
  latitude: number | null;
  longitude: number | null;
  accuracyMeters: number | null;
  note: string;
  relayAttempts: number;
}

export interface PacketFragment {
  messageId: string;
  fragmentIndex: number;
  totalFragments: number;
  chunkHex: string;
}

export interface DiagnosticMetrics {
  packetsSent: number;
  packetsReceived: number;
  packetsRelayed: number;
  packetsDroppedDuplicate: number;
  packetsDroppedHopLimit: number;
  packetsDroppedTampered: number;
  activePeersCount: number;
  queueDepth: number;
}
