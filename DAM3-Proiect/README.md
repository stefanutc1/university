# Secure Offline Mesh Messenger — React Native Mobile App (DAM Project)

> **Universitatea din Craiova** • Facultatea de Științe  
> **Disciplina**: Dezvoltarea Aplicațiilor Mobile (DAM) — Anul 3  
> **Platformă**: React Native (TypeScript, React Navigation, BLE Manager, TweetNaCl)  
> **Perioadă de Dezvoltare**: 18 Iunie 2026 – 03 Septembrie 2026  
> **Student**: Ștefănuț

---

## 1. Prezentarea Proiectului

**Secure Offline Mesh Messenger** este o aplicație mobilă dezvoltată în **React Native** cu suport complet offline pentru comunicare securizată peer-to-peer între dispozitive din proximitate, **fără conexiune la Internet, date celulare, Wi-Fi cu infrastructură sau servere centrale**.

Aplicația implementează o rețea mesh mobilă ad-hoc de tip **store-and-forward**, cu rutare multi-hop, criptare end-to-end (E2EE), prevenție a buclelor prin deduplicare și modul de urgență SOS.

---

## 2. Arhitectura Tehnică & Securitate

```text
Sender Node (A)                   Relay Node (B)                  Recipient Node (C)
      |                                 |                                 |
 [Encrypt E2EE]                         |                                 |
 [Sign Ed25519]                         |                                 |
      |                                 |                                 |
      |--- Raw Ciphertext Envelope ---->|                                 |
      |    (BLE GATT / Local P2P)       |-- Check Hop Limit & Cache --    |
      |                                 |-- Cannot Decrypt Plaintext -    |
      |                                 |-- Store & Forward Queue ----    |
      |                                 |                                 |
      |                                 |--- Forwarded Ciphertext ------->|
      |                                 |    (BLE GATT / Local P2P)       |
      |                                 |                            [Verify Sig]
      |                                 |                            [Decrypt E2EE]
      |                                 |                            [Display Msg]
```

### Principii Criptografice și de Securitate:
- **Identitate Criptografică Suverană**: Generată local pe dispozitiv prin perechi de chei asimetrice **Ed25519** (semnături) și **Curve25519** (acord de chei ECDH). Fără conturi, email sau număr de telefon.
- **Stocare Securizată a Cheilor**: Cheile sunt stocate criptat în spațiul sandbox local al aplicației.
- **Criptare End-to-End (E2EE)**: Conținutul mesajelor este criptat cu **ChaCha20-Poly1305** / **XSalsa20-Poly1305**. Nodurile intermediare de releu transportă exclusiv ciphertext și nu pot inspecta conținutul.
- **Protecție la Replay și Bucle**: Cache glisant de deduplicare (LRU de 10.000 intrări), Hop Limit strict decrementat (implicit 7, max 16) și expirare TTL.
- **Toleranță la Deconectare (Store-and-Forward)**: Coadă persistentă tampon pentru mesaje nedelivrate imediat, retransmise automat când un nod vecin redevine vizibil.
- **Mod de Urgență SOS**: Semnal de alarmă deliberat cu coordonate GPS preluate prin Geolocation API, propagat cu prioritate către toate nodurile din proximitate.

---

## 3. Structura Repozitoriului

```text
DAM3-Proiect/
├── README.md                     # Această documentație tehnică principală
├── package.json                  # Dependențe React Native, TypeScript, BLE, Crypto
├── tsconfig.json                 # Configurație TypeScript strict
├── babel.config.js / metro.config.js / app.json / index.js
├── protocol/
│   ├── specification.json        # Schema formală JSON a protocolului wire
│   └── packet_spec.md            # Specificația binară a pachetelor, MTU și framing
├── docs/
│   ├── architecture.md           # Arhitectura de sistem și fluxurile de date
│   ├── protocol.md               # Detalierea pachetelor și tipurilor wire
│   ├── cryptography.md           # Primitive criptografice, ECDH și derivare de chei
│   ├── mesh-networking.md        # Descoperire BLE, rutare gossip și store-and-forward
│   ├── storage.md                # Bază de date criptată locală
│   ├── sos.md                    # Arhitectura beacon-ului de urgență SOS
│   ├── threat-model.md           # Analiza amenințărilor, atacatorilor și protecțiilor
│   ├── privacy.md                # Politica zero-metadate și zero-telemetrie
│   ├── testing.md                # Rapoarte de testare și rulare simulări
│   ├── platform-limitations.md   # Restricții de background pe iOS și Android
│   └── development.md            # Ghid de instalare și rulare React Native
├── tests/
│   ├── simulate_mesh.py          # Suită de simulare deterministă pe 4 noduri (A -> B -> C -> D)
│   └── mesh.test.js              # Teste unitare Node.js (fragmentare, asamblare, deduplicare)
└── src/
    ├── App.tsx                   # Componenta principală și navigare (Tabs + Stacks)
    ├── types/
    │   └── index.ts              # Tipuri TypeScript (Peer, Message, Envelope, SOSAlert)
    ├── crypto/
    │   └── CryptoEngine.ts       # Curve25519 ECDH, Ed25519 semnare, ChaCha20 AEAD
    ├── network/
    │   ├── BleMeshTransport.ts   # BLE central scan & peripheral GATT service FE60
    │   ├── LocalPeerTransport.ts # Transport direct socket P2P ad-hoc
    │   └── PacketFragmenter.ts   # Slicing pachete mari la MTU de 180B și reasamblare
    ├── routing/
    │   └── MeshRouter.ts         # Motor store-and-forward, cache deduplicare, rutare gossip
    ├── storage/
    │   └── EncryptedStorage.ts   # Persistență criptată la nivel de dispozitiv
    ├── sos/
    │   └── SosController.ts      # Declanșare SOS, preluare GPS și beacon broadcast
    ├── diagnostics/
    │   └── MeshDiagnostics.ts   # Telemetrie în timp real (TX/RX/Relay/Drop)
    └── ui/
        ├── theme.ts              # Paletă culori minimalistă (Dark Obsidian / Slate)
        ├── components/
        │   ├── MessageBubble.tsx # Balon de mesaj cu afișare stări de livrare
        │   └── MetricCard.tsx    # Card pentru afișare metrice telemetrice
        └── screens/
            ├── ConversationsScreen.tsx
            ├── ConversationDetailScreen.tsx
            ├── NearbyPeersScreen.tsx
            ├── MeshStatusScreen.tsx
            ├── SosScreen.tsx
            └── SettingsScreen.tsx
```

---

## 4. Validare și Testare

### Teste Unitare:
```bash
npm test
```
```text
✔ Fragmentation splits payload into MTU-sized chunks
✔ Reassembly handles out-of-order delivery
✔ Sliding window deduplication drops repeated message IDs
ℹ tests 3, pass 3, fail 0
```

### Suită de Simulare Deterministă:
```bash
python tests/simulate_mesh.py
```
```text
================================================================
 SECURE OFFLINE MESH MESSENGER — DETERMINISTIC VERIFICATION
================================================================
[1] Topology established: Node-A <--> Node-B <--> Node-C <--> Node-D
[PASS] E2EE Multi-hop relay verified: Node-A -> Node-B -> Node-C -> Node-D
[PASS] Relays B and C forwarded ciphertext without access to plaintext.
[PASS] Duplicate packet detected and dropped by Node-B deduplication cache.
[PASS] Hop limit decrement enforced: packet dropped at Node-C when hop limit reached 0.
[PASS] Cryptographic integrity enforced: tampered ciphertext rejected by Poly1305 MAC.
[PASS] Fragmented packet successfully reassembled across multi-hop BLE transport.
[PASS] Node-C buffered message in Store-and-Forward queue (Node-D unreachable).
[PASS] Buffered message successfully delivered upon Node-D reconnection.
[PASS] SOS emergency beacon successfully propagated to all nodes in range.
================================================================
 ALL 7 DETERMINISTIC SIMULATION TESTS PASSED (100% SUCCESS)!
================================================================
```

---

*Proiect realizat în cadrul disciplinei Dezvoltarea Aplicațiilor Mobile (DAM), Facultatea de Științe, Universitatea din Craiova.*
