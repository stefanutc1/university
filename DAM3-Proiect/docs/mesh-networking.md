# Mesh Networking Specification

## 1. Peer Discovery

### 1.1 Bluetooth Low Energy (BLE)
- **Service UUID**: `0000FE60-0000-1000-8000-00805F9B34FB`
- **Advertisement Payload**: Contains the custom 128-bit service UUID and a compact 8-byte device identifier (`Mesh-XXXXXX`).
- **Scanning Strategy**: Intermittent low-power background scanning coupled with low-latency active bursts upon user interaction to preserve device battery life.

### 1.2 Local Peer Direct Networking
- High-bandwidth zero-configuration transport for devices sharing local Wi-Fi radios (ad-hoc P2P without router or infrastructure internet).
- iOS uses `MultipeerConnectivity` (`serviceType: mesh-p2p`).
- Android uses `WifiP2pManager` Direct sockets.

---

## 2. Store-and-Forward Routing

When a message is addressed to a non-neighbor peer or a neighbor temporarily goes out of radio range:
1. The packet is placed into the persistent **Store-and-Forward Queue**.
2. The queue is bounded to 1,000 entries (FIFO eviction under extreme memory pressure).
3. Whenever any neighbor connects or becomes reachable, the queue is evaluated and candidate envelopes are dispatched.
4. Messages persist across device reboots until delivered, expired, or dropped by hop limit.

---

## 3. Loop & Storm Prevention

1. **Sliding Window Deduplication**: Nodes store received `message_id` hashes in a 10,000-entry LRU cache. Repeated receipts of an envelope are dropped without re-broadcasting.
2. **Hop Limits**: Each relay decrements `hopLimit`. If `hopLimit == 0`, packet propagation halts.
3. **Time-to-Live Expiry**: Packets include an `expiresAt` timestamp. Outdated packets are discarded unconditionally.
