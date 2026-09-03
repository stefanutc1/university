# Secure Offline Mesh Messenger

Aplicatie mobila dezvoltata in React Native pentru comunicare securizata offline intre dispozitive mobile aflate in proximitate, fara a necesita conexiune la internet, date mobile, retele Wi-Fi cu infrastructura sau servere centrale.

Proiect realizat in cadrul Universitatii din Craiova, Facultatea de Stiinte, disciplina Dezvoltarea Aplicatiilor Mobile (DAM).

## Descriere

Sistemul permite transmiterea de mesaje text, transfer de fisiere mari, mesaje vocale in timp real si semnale de urgenta prin intermediul unei retele locale ad-hoc. Dispozitivele intermediare actioneaza ca relee, transmitand pachetele mai departe catre destinatar fara a putea citi continutul acestora (relee opace).

## 1. Transport si Descoperire pe Retea Locala

- Local Peer Discovery via mDNS / ZeroConf (Bonjour / NSD): telefoanele conectate la acelasi Wi-Fi (sau pe Hotspot-ul unuia dintre ele) se gasesc automat in cateva milisecunde, fara configurare manuala de IP.
- WebSocket / TCP Direct P2P: transmisie de date bidirectionala instanta (sub 5ms latenta) cu throughput mare, permitand text, fisiere mari si streaming audio.
- Mod Portable Hotspot Host: daca nu exista router Wi-Fi in zona, un telefon porneste Hotspot-ul, ceilalti se conecteaza la el, iar aplicatia functioneaza imediat ca un server local autonom.
- Suport BLE GATT (Service UUID FE60): rutare alternativa prin Bluetooth Low Energy cand conexiunea Wi-Fi nu este disponibila.

## 2. Functionalitati Practice cu Utilitate Ridicata

- Transfer Rapid de Fisiere si Imagini (Local AirDrop-like): trimitere directa de fisiere mari, poze si documente direct device-to-device pe Wi-Fi la viteze maxime, fara compresie sau limite de cloud.
- Mesaje Vocale si Intercom Push-to-Talk (Walkie-Talkie Local): inregistrare audio locala si streaming direct prin WebSocket catre nodurile conectate, util pe santiere, drumetii sau spatii mari fara semnal GSM.
- Pairing Instant prin Scanare QR Code: schimbul de chei publice si initierea conexiunii directe printr-o singura scanare a ecranului celuilalt utilizator.
- Clipboard Sync Local: sincronizare automata sau la cerere a textului copiat in clipboard intre telefoane sau intre telefon si laptopul din aceeasi retea.
- Harti si Marcaje Offline (Incident Pinning): salvarea coordonatelor GPS si a descrierii unui incident pe o harta pre-descarcata local (OpenStreetMap), distribuita instant tuturor colegilor din retea.
- Sincronizare Baza de Date la Reconectare (Store and Sync): daca cineva iese din raza Wi-Fi si revine mai tarziu, aplicatia ii livreaza automat toate mesajele si fisierele trimise in grup cat timp a fost deconectat.

## 3. Securitate si Criptografie

- Criptare End-to-End (E2EE): fiecare mesaj este criptat pe dispozitivul sursa folosind Curve25519 si ChaCha20-Poly1305. Releele intermediare transporta doar ciphertext.
- Identitate criptografica suverana: generare locala de chei asimetrice (Ed25519 pentru semnaturi si X25519 pentru chei de acord), fara conturi, email sau numere de telefon.
- Prevenirea buclelor si a spamului: cache glisant de deduplicare (LRU) si limitare stricta a numarului de salturi (Hop Limit).
- Mod Urgenta SOS: transmiterea unei alerte de urgenta cu prioritate maxima si coordonate GPS catre toate dispozitivele din raza radio.
- Baza de date locala criptata: stocare securizata a conversatiilor cu optiune de stergere completa a datelor din Setari.

## Structura Proiectului

- src/crypto: generarea cheilor, criptare si semnare digitala (TweetNaCl).
- src/network: mDNS ZeroConf, WebSocket TCP P2P, transport BLE si fragmentare MTU.
- src/features: AirDrop file transfer, Walkie-Talkie voice intercom, QR pairing, Clipboard sync, Incident pinning si Store & Sync.
- src/routing: motorul de rutare mesh, coada store-and-forward si deduplicare.
- src/storage: gestiunea stocarii locale criptate.
- src/sos: logica pentru alerta SOS si localizare GPS.
- src/ui: ecrane si navigare (Chats, AirDrop, Walkie, IncidentMap, Tools).
- tests: suita de teste unitare si simulare determinista de retea mesh.

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
