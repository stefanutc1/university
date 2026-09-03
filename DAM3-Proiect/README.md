# Secure Offline Mesh Messenger

Aplicatie mobila dezvoltata in React Native pentru comunicare securizata offline intre dispozitive mobile aflate in proximitate, fara a necesita conexiune la internet, date mobile, retele Wi-Fi cu infrastructura sau servere centrale.

Proiect realizat in cadrul Universitatii din Craiova, Facultatea de Stiinte, disciplina Dezvoltarea Aplicatiilor Mobile (DAM).

## Descriere

Sistemul permite transmiterea de mesaje text si semnale de urgenta prin intermediul unei retele mesh locale ad-hoc. Dispozitivele intermediare actioneaza ca relee, transmitand pachetele mai departe catre destinatar fara a putea citi continutul acestora (relee opace).

## Functionalitati Principale

- Functionare 100% offline: foloseste Bluetooth Low Energy (BLE) si conexiuni directe peer-to-peer.
- Criptare End-to-End (E2EE): fiecare mesaj este criptat pe dispozitivul sursa folosind Curve25519 si ChaCha20-Poly1305. Releele intermediare transporta doar ciphertext.
- Identitate criptografica suverana: generare locala de chei asimetrice (Ed25519 pentru semnaturi si X25519 pentru chei de acord), fara conturi, email sau numere de telefon.
- Rutare de tip Store-and-Forward: daca nodul destinatar este temporar deconectat, mesajul este pastrat intr-o coada locala si retransmis automat la reconectare.
- Prevenirea buclelor: cache glisant de deduplicare si limitare stricta a numarului de salturi (Hop Limit).
- Mod Urgenta SOS: transmiterea unei alerte de urgenta cu prioritate maxima si coordonate GPS catre toate dispozitivele din raza radio.
- Baza de date locala criptata: stocare securizata a conversatiilor cu optiune de stergere completa a datelor.

## Tehnologii Utilizate

- React Native (TypeScript)
- React Navigation (Bottom Tabs + Native Stack)
- TweetNaCl (criptografie asimetrica si simetrica)
- React Native BLE Manager (GATT Service FE60)
- AsyncStorage (stocare locala criptata)

## Structura Proiectului

- src/crypto: generarea cheilor, criptare si semnare digitala.
- src/network: transport radio BLE, socket-uri peer-to-peer si fragmentare pachete la MTU.
- src/routing: rutare mesh, coada store-and-forward si deduplicare.
- src/storage: gestiunea stocarii locale criptate.
- src/sos: logica pentru alerta SOS si localizare GPS.
- src/ui: ecrane si componente (Conversations, Chat, NearbyPeers, MeshStatus, Sos, Settings).
- tests: suita de teste unitare si simulare de retea mesh.

## Instalare si Rulare

1. Instalare dependente:
   npm install

2. Rulare teste unitare:
   npm test

3. Rulare simulare determinista mesh:
   npm run simulate

4. Pornire server Metro:
   npm start

5. Rulare pe Android:
   npm run android
