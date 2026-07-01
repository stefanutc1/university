# Cryptography Specification — Mesh Messenger

## 1. Cryptographic Primitives

The system relies exclusively on standardized, modern elliptic-curve and authenticated symmetric primitives:

| Component | Primitive | Key Size | Library / Platform API |
| :--- | :--- | :--- | :--- |
| Identity & Signing | Ed25519 | 256-bit (32B) | Apple CryptoKit / Android KeyStore EC |
| Key Agreement | X25519 (Curve25519) | 256-bit (32B) | Apple CryptoKit / Android KeyAgreement |
| Key Derivation | HKDF-SHA256 | 256-bit output | RFC 5869 |
| Symmetric Cipher | ChaCha20-Poly1305 / AES-256-GCM | 256-bit (32B) | Apple CryptoKit / javax.crypto |
| Message Integrity | Poly1305 / GMAC | 128-bit (16B) | Integrated in AEAD |

---

## 2. Key Management & Private Key Protection

1. **Zero Key Transmission**: Private keys are generated on-device and never leave the hardware boundary.
2. **Secure Storage**:
   - **iOS**: Stored in Keychain with accessibility flag `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly`.
   - **Android**: Managed by the Android KeyStore Provider using hardware-backed Secure Elements / StrongBox when available.
3. **No External Dependencies**: Cryptographic identity is entirely sovereign—it does not rely on email, phone numbers, certificates, or remote authority servers.

---

## 3. End-to-End Encryption (E2EE) Flow

```text
Alice (Sender)                                              Bob (Recipient)
  |                                                               |
  |-- 1. Derive ECDH Shared Secret: SS = X25519(privA, pubB) --->|
  |-- 2. Derive Symmetric Key: K = HKDF(SS, salt, "mesh-v1") ----|
  |-- 3. Encrypt Plaintext: (CT, Nonce, Tag) = AEAD(K, Msg) ------|
  |-- 4. Sign Header & Ciphertext: Sig = Ed25519(privA, Meta) ----|
  |                                                               |
  |--------> [Relay Node 1] --------> [Relay Node 2] ------------>|
  |      (Cannot Decrypt)         (Cannot Decrypt)                |
  |                                                               |-- 5. Verify Ed25519 Sig
  |                                                               |-- 6. Derive SS = X25519(privB, pubA)
  |                                                               |-- 7. Decrypt CT with AEAD
```
