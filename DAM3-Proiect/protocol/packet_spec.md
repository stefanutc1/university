# Secure Offline Mesh Messenger — Wire Protocol Specification (v1)

## 1. Overview

The Mesh Messenger Wire Protocol defines the packet structures, framing, serialization, and fragmentation rules for direct device-to-device communication over Bluetooth Low Energy (BLE) and local peer network sockets without internet or infrastructure dependence.

---

## 2. Binary Frame Layout

All frames transmitted over BLE characteristics or peer sockets follow an explicit binary format:

```text
+--------------+---------------+--------------+---------------+---------------+------------------+
| Magic (2B)   | Version (1B)  | Type (1B)    | Flags (1B)    | HopLimit (1B) | HopCount (1B)    |
| 0x4D 0x53    | 0x01          | uint8        | bitmask       | uint8 (1-16)  | uint8 (0-16)     |
+--------------+---------------+--------------+---------------+---------------+------------------+
| Payload Length (2B, Big Endian)              | Variable Length Frame Payload                    |
| uint16 (0 to 65535 bytes)                    | (Envelope or Fragment)                           |
+----------------------------------------------+--------------------------------------------------+
```

### 2.1 Magic Bytes & Header Fields
- `Magic (2 bytes)`: Fixed sequence `0x4D, 0x53` (ASCII `"MS"` for MeshSecure). Packets with invalid magic are discarded immediately at the physical transport layer.
- `Version (1 byte)`: Current protocol version is `0x01`. Nodes must drop packets with unknown major versions safely.
- `Type (1 byte)`:
  - `0x01`: `ENVELOPE` (Full complete unfragmented message envelope).
  - `0x02`: `FRAGMENT` (Chunked fragment frame for BLE MTU adaptation).
  - `0x03`: `ROUTING_ACK` (Hop-by-hop or end-to-end receipt confirmation).
  - `0x04`: `SOS_BEACON` (Emergency distress broadcast).
  - `0x05`: `PEER_HELLO` (Cryptographic discovery handshake).
- `Flags (1 byte)`:
  - `Bit 0 (0x01)`: Is Broadcast (Recipient is wildcard `0x00...00`).
  - `Bit 1 (0x02)`: Requires Delivery ACK.
  - `Bit 2 (0x04)`: Priority / SOS Packet.
  - `Bit 3 (0x08)`: Compressed payload.
- `Hop Limit (1 byte)`: Maximum remaining forwarding hops allowed (default `7`, max `16`). Decremented by 1 at each relay. If decremented to `0`, the packet is dropped.
- `Hop Count (1 byte)`: Incremented by 1 at each relay to track distance traversed.

---

## 3. Envelope Wire Format (Type `0x01`)

An envelope encapsulates an end-to-end encrypted message. Intermediate relay nodes inspect only the routing header and forward the ciphertext without access to the decryption key.

```text
Field                  Length       Description
--------------------------------------------------------------------------------
message_id             16 bytes     UUID v4 unique message identifier
created_at              8 bytes     uint64 milliseconds since Unix epoch
expires_at              8 bytes     uint64 milliseconds (time-to-live cap)
sender_pubkey          32 bytes     Ed25519/X25519 identity key
recipient_pubkey       32 bytes     Target public key (or 32 zeros for broadcast)
nonce                  12 bytes     ChaCha20-Poly1305 IV
auth_tag               16 bytes     Poly1305 authentication tag
ciphertext_length       2 bytes     uint16 big-endian
ciphertext             Variable     Encrypted payload (UTF-8 message or SOS JSON)
signature              64 bytes     Ed25519 signature by sender over all metadata
```

### 3.1 Signature Coverage
The sender signs the canonical byte sequence:
`SHA-256(version || message_id || created_at || expires_at || sender_pubkey || recipient_pubkey || nonce || ciphertext || auth_tag)`

Any modification by a malicious relay will invalidate the signature and cause immediate rejection by subsequent nodes.

---

## 4. Fragment Frame Layout (Type `0x02`)

Standard BLE ATT MTU sizes range from 23 to 512 bytes (typical effective payload per write without response: 182-244 bytes). Messages larger than the negotiated MTU minus 12 bytes header are chunked into numbered fragments:

```text
Field                  Length       Description
--------------------------------------------------------------------------------
message_id             16 bytes     UUID of the parent envelope being reassembled
fragment_index          2 bytes     uint16 0-indexed fragment number
total_fragments         2 bytes     uint16 total count of fragments (1 to 256)
chunk_data             Variable     Slice of raw envelope bytes
```

### 4.1 Reassembly Rules
1. Receiver allocates a reassembly buffer indexed by `message_id`.
2. Missing fragments are tracked via a bitmask.
3. Reassembly timeout is strictly 15 seconds. If all fragments are not received within 15 seconds, the incomplete buffer is evicted.
4. Upon receiving all fragments, the parent envelope is parsed and authenticated as a whole. Fragments are NEVER processed independently.

---

## 5. BLE GATT Architecture

The application defines a dedicated custom Bluetooth GATT service:

* **Mesh Service UUID**: `0000FE60-0000-1000-8000-00805F9B34FB`
* **Characteristics**:
  * **RX Characteristic (Write Without Response / Write)**:  
    `0000FE61-0000-1000-8000-00805F9B34FB`  
    Used by remote peers to push message packets or fragments into this node.
  * **TX Characteristic (Notify / Read)**:  
    `0000FE62-0000-1000-8000-00805F9B34FB`  
    Used by this node to emit outbound fragments to connected peripherals.
  * **Peer Identity Characteristic (Read)**:  
    `0000FE63-0000-1000-8000-00805F9B34FB`  
    Returns the node's 32-byte public key and short human identifier.
  * **Emergency SOS Characteristic (Indicate / Notify / Read)**:  
    `0000FE64-0000-1000-8000-00805F9B34FB`  
    Broadcasts high-priority SOS distress alerts.

---

## 6. Deduplication & Loop Prevention

To prevent infinite broadcast storms and loops:
1. **Sliding Window Deduplication Cache**: Every node maintains an LRU cache of recently observed `message_id` hashes with a capacity of 10,000 entries.
2. **Duplicate Detection**: If `message_id` exists in the cache, the packet is silently dropped.
3. **Hop Limit**: Packets decrement `hopLimit`. If `hopLimit == 0`, packet is discarded.
4. **Expiration**: If current device timestamp exceeds `expiresAt`, packet is discarded.
