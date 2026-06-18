# Architecture Overview — Secure Offline Mesh Messenger (React Native)

## 1. System Philosophy

The Secure Offline Mesh Messenger is engineered in React Native (TypeScript) from the ground up for strict offline resilience. It provides peer-to-peer authenticated messaging, store-and-forward routing, and emergency distress beaconing across nearby mobile devices without reliance on the Internet, cellular data, base stations, or central servers.

```text
+-------------------------------------------------------------------------------+
|                      Presentation (UI) Layer (React Native)                   |
|   ConversationsScreen | ChatScreen | NearbyPeersScreen | StatusScreen | SOS   |
+-------------------------------------------------------------------------------+
                                      |
+-------------------------------------------------------------------------------+
|                       State & Routing Layer (TypeScript)                      |
|          MeshRouter: Store-and-Forward, Deduplication, Multi-Hop Relay        |
+-------------------------------------------------------------------------------+
                                      |
+-------------------------------------+-----------------------------------------+
|                  |                  |                    |                    |
|       v          |        v         |         v          |          v         |
|  Crypto Engine   |  Encrypted DB    |  Packet Fragmenter |   SOS Controller   |
| (Curve25519/Ed)  | (Local Storage)  | (MTU Slicing)      | (Geolocation API)  |
+------------------+------------------+--------------------+--------------------+
                            |
+-------------------------------------------------------------------------------+
|                           Mesh Transport Layer                                |
|        BleMeshTransport (react-native-ble-manager / GATT 0xFE60)               |
|        LocalPeerTransport (Direct P2P Ad-hoc Transport)                       |
+-------------------------------------------------------------------------------+
```

---

## 2. Core Components

### 2.1 Cryptographic Sovereign Identity (`src/crypto/CryptoEngine.ts`)
- On-device key generation using Curve25519 (ECDH) and Ed25519 (signatures).
- Authenticated symmetric encryption: ChaCha20-Poly1305 / XSalsa20-Poly1305.
- Relay opacity: intermediate forwarding nodes carry ciphertext envelopes without possessing the keys to decrypt.

### 2.2 Routing Engine (`src/routing/MeshRouter.ts`)
- Sliding window LRU deduplication cache (10,000 entries) preventing broadcast storms.
- Hop count increment and Hop limit decrement (max 16, default 7).
- Store-and-Forward queue (up to 1,000 envelopes) buffered while peers are offline and automatically flushed upon reconnection.

### 2.3 BLE & Local Peer Transports (`src/network/`)
- BLE GATT service UUID `0000FE60-0000-1000-8000-00805F9B34FB`.
- Packet fragmenter chunking envelopes into MTU-safe slices (180 bytes) and assembling them out-of-order.
- High-bandwidth local ad-hoc peer transport.
