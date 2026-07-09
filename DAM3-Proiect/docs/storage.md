# Encrypted Local Storage Specification

## 1. Storage Overview

The application stores all conversations, messages, routing metrics, and cryptographic public keys locally. No data is synchronized with external servers or cloud providers.

---

## 2. Platform Implementations

### 2.1 iOS: Encrypted SQLite / Encrypted Serialized Storage
- Located in the application sandbox `Documents/mesh_database.enc`.
- Encrypted at rest using AES-256-GCM / ChaCha20-Poly1305 with an authentication tag.
- Decryption keys are managed through the iOS Keychain and bound to the device hardware state.

### 2.2 Android: Room Database with SQLCipher
- Utilizes Android Room architecture (`MeshDatabase`) with SQLCipher encryption.
- Database passphrase is generated securely on first launch and preserved inside the Android KeyStore.

---

## 3. Data Purge Guarantee

The user can initiate a complete cryptographic wipe from the Settings screen:
- Erases message records, conversation metadata, deduplication caches, and emergency logs.
- Overwrites and unlinks database files.
- Resets cryptographic identity on demand.
