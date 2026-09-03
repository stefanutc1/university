```markdown
# MeshRelay - Mesagerie Descentralizata Offline si Releu de Urgenta

MeshRelay este o aplicatie mobila dezvoltata in React Native si Expo, conceputa pentru comunicare descentralizata peer-to-peer (P2P) in medii fara acces la internet, retele celulare GSM sau infrastructura centrala de servere. 

Sistemul utilizeaza protocoale Bluetooth Low Energy (BLE) si Wi-Fi Direct pentru a construi o retea ad-hoc de tip mesh, permitand transmiterea mesajelor prin noduri intermediare (multi-hop routing) si emiterea de semnale de urgenta cu date de telemetrie.

---

## Functionalitati Principale

- **Mesagerie P2P Offline**: Comunicare directa de la dispozitiv la dispozitiv fara intermedierea unui server central sau conexiune la internet.
- **Rutare Ad-Hoc Multi-Hop (Store-and-Forward)**: Pachetele de date sunt retransmise automat prin nodurile din proximitate folosind un algoritm de tip gossip cu control al duratei de viata (TTL) si prevenire a duplicarii.
- **Securitate End-to-End (E2EE)**: Fiecare mesaj 1-la-1 este criptat asimetric utilizand chei generate local pe dispozitiv (X25519 / ChaCha20-Poly1305). Nodurile intermediare de retransmisie nu pot inspecta continutul.
- **Canal Public de Broadcast**: Transmitere de anunturi locale necriptate catre toti utilizatorii activi din raza retelei mesh.
- **Mod SOS si Beacon de Urgenta**: Transmitere automata periodica a coordonatelor GPS si a starii bateriei pentru scenarii de cautare si salvare in caz de dezastru.
- **Stocare Locala Criptata**: Persistenta istoricului conversatiilor si a cozii de mesaje intr-o baza de date SQLite securizata local.

---

## Arhitectura Tehnica

- **Framework**: React Native, Expo (EAS Build)
- **Limbaj**: TypeScript / JavaScript
- **Transport de Retea**: Bluetooth Low Energy (BLE Peripheral/Central), Wi-Fi Direct
- **Criptografie**: Libsodium / TweetNaCl (Curve25519, Ed25519, ChaCha20)
- **Stocare si Persistenta**: SQLite (expo-sqlite) cu stocare de chei in SecureStore / Keystore
- **Senzori & Telemetrie**: expo-location (GPS), expo-battery

---

## Structura Pachetului de Date

Fiecare nod proceseaza frame-uri de retea serializate binar sau JSON structurate astfel:

- `message_id`: Identificator unic al mesajului (UUIDv4)
- `sender_pubkey`: Cheia publica a expeditorului
- `recipient_pubkey`: Cheia publica a destinatarului (sau ID specific de broadcast)
- `ttl`: Numarul maxim de hop-uri ramase pentru retransmisie
- `payload`: Continutul criptat al mesajului
- `signature`: Semnatura digitala a pachetului pentru prevenirea falsificarii
- `timestamp`: Momentul generarii mesajului

---

## Instalare si Rulare

1. Clonarea repository-ului:
```bash
git clone [https://github.com/stefanutc1/meshrelay.git](https://github.com/stefanutc1/meshrelay.git)
cd meshrelay

```

2. Instalarea dependentelor:

```bash
npm install

```

3. Pornirea serverului de dezvoltare:

```bash
npx expo start

```

4. Generarea build-ului pentru dispozitiv fizic (necesar pentru acces la modulele hardware BLE/GPS):

```bash
npx eas build --platform android --profile development

```

```

```
