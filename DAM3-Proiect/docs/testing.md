# Testing Strategy & Simulation Suite

## 1. Test Categories

1. **Unit Testing**:
   - iOS: `ios/MeshMessengerTests/MeshMessengerTests.swift` (CryptoKit agreement, envelope serialization, fragment chunking).
   - Android: `android/app/src/test/java/ro/ucv/dam/mesh/MeshRouterTest.kt` (Fragment reassembly, header validation).
2. **Deterministic Multi-Hop Simulation**:
   - `tests/simulate_mesh.py`: Complete simulation of 4 mobile nodes in linear topology (`A <-> B <-> C <-> D`).
   - Verifies multi-hop E2EE opacity, deduplication drop, hop limit expiration, tamper detection, fragmentation reassembly, store-and-forward flushing, and SOS distress beaconing.

## 2. Executing Simulation Tests
```bash
python tests/simulate_mesh.py
```
Output:
```text
================================================================
 SECURE OFFLINE MESH MESSENGER — DETERMINISTIC VERIFICATION
================================================================
[1] Topology established: Node-A <--> Node-B <--> Node-C <--> Node-D
[2] Node-A generated envelope d28405a4... (Size: 214 bytes)
    Target: Node-D (657187cebdd17838...)
    [PASS] E2EE Multi-hop relay verified: Node-A -> Node-B -> Node-C -> Node-D
    [PASS] Relays B and C forwarded ciphertext without access to plaintext.
    [PASS] Duplicate packet detected and dropped by Node-B deduplication cache.
    [PASS] Hop limit decrement enforced: packet dropped at Node-C when hop limit reached 0.
    [PASS] Cryptographic integrity enforced: tampered ciphertext rejected by Poly1305 MAC.
[3] Packet fragmented into 6 BLE frames (MTU=180 bytes).
    [PASS] Fragmented packet successfully reassembled across multi-hop BLE transport.
[4] Testing Store-and-Forward when Node-D is offline...
    [PASS] Node-C buffered message in Store-and-Forward queue (Node-D unreachable).
    Node-D came back online. Flushing Node-C queue...
    [PASS] Buffered message successfully delivered upon Node-D reconnection.
[5] Testing Emergency SOS Broadcast Mode...
    [PASS] SOS emergency beacon successfully propagated to all nodes in range.
================================================================
 ALL 7 DETERMINISTIC SIMULATION TESTS PASSED (100% SUCCESS)!
================================================================
```
