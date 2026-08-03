# Threat Model & Security Analysis

## 1. Adversary Assumptions & Protection Matrix

| Threat Scenario | Protection Mechanism | Remaining Limitation |
| :--- | :--- | :--- |
| **Passive Eavesdropper** (RF sniffer) | End-to-End ChaCha20-Poly1305 / AES-256-GCM encryption of all payloads. | Metadata visibility: Packet size, timing, and public key identifiers are visible on RF layer. |
| **Malicious Intermediate Relay** | Ed25519 digital signatures ensure packet immutability; relays transport ciphertext and lack private keys to decrypt. | Relay can choose to drop packets (denial of forwarding). Mitigated by multi-path gossip routing. |
| **Message Replay Attack** | Sliding window deduplication cache + strict timestamp expiration checks. | Nodes that are offline during a broadcast window might receive an old packet if within valid TTL. |
| **Tampered / Injected Packet** | Poly1305 authentication tag + Ed25519 signature verification fails on 1-bit difference. | Computational resource cost to verify and drop corrupted frames. |
| **Device Theft / Extraction** | Local database is encrypted at rest using keys bound to Apple Keychain / Android KeyStore. | If the physical device is unlocked by an attacker with user PIN, plaintext may be viewable in the app UI. |
| **Broadcast Storm / DoS** | Hard hop limits (max 16, default 7), 10,000-entry deduplication LRU, and queue bounds (1,000 max). | Dense environments with hundreds of active beacons can temporarily congest 2.4 GHz BLE spectrum. |

---

## 2. Security Invariants
- Private keys never touch network packets or log files.
- Relay nodes NEVER possess keys to inspect transmitted conversation content.
- Cryptographic identity generation occurs purely offline without server trust anchors.
