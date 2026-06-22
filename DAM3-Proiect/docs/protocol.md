# Wire Protocol Specification — Mesh Messenger

## 1. Framing & Encoding

All packets traveling over radio characteristics are framed with the canonical 7-byte header:

```text
Byte 0-1: Magic bytes [0x4D, 0x53] ("MS")
Byte 2:   Protocol Version (0x01)
Byte 3:   Packet Type (0x01: Envelope, 0x02: Fragment, 0x03: ACK, 0x04: SOS, 0x05: Hello)
Byte 4:   Flags (Bit 0: Broadcast/SOS, Bit 1: ReqACK, Bit 2: Priority)
Byte 5:   Hop Limit (1 to 16, default: 7)
Byte 6:   Hop Count (0 to 16)
Byte 7-8: Big-endian 16-bit Payload Length
Byte 9+:  Payload Body
```

## 2. Packet Types

### 2.1 Type 0x01: Complete Envelope
Directly encapsulates the full encrypted message when payload size fits within the transport MTU:
- 16-byte Message UUID
- 8-byte Created Timestamp (ms)
- 8-byte Expiration Timestamp (ms)
- 32-byte Sender Identity Public Key
- 32-byte Recipient Identity Public Key
- 12-byte Nonce / IV
- 16-byte Poly1305 / GCM Tag
- 64-byte Ed25519 Signature
- 2-byte Ciphertext Length
- N-byte Ciphertext

### 2.2 Type 0x02: Packet Fragment
Transmitted when an envelope exceeds the link MTU:
- 16-byte Message UUID of the parent envelope
- 2-byte Fragment Index (0-based)
- 2-byte Total Fragments
- Variable-length chunk data

## 3. Wire Rules & Invariant Checks
1. **Magic Mismatch**: Discard immediately.
2. **Version Unsupported**: Drop without parsing to prevent buffer exploitation.
3. **Hop Limit Zero**: If `HopLimit - 1 == 0`, packet is evicted.
4. **Expiration Exceeded**: If `currentTime > ExpiresAt`, packet is evicted.
