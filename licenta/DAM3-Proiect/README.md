# Local-First All-in-One Mobile Utility Suite & Cloud Backend

Aplicatie mobila nativa dezvoltata in **React Native (Expo Managed Workflow & Expo Router)** integrata cu un backend performant de sincronizare in **Go (Golang Fiber & SQLite cu Litestream)**, realizata in cadrul Universitatii din Craiova, Facultatea de Economie si Administrarea Afacerilor / Stiinte, disciplina Dezvoltarea Aplicatiilor Mobile (DAM).

---

## 📱 Prezentare Generala a Aplicatiei (App Overview)

Aplicatia reprezinta o suita completa de instrumente de utilitate zilnica, networking si dezvoltare software, orientata pe paradigma **Local-First**: toate calculele, operatiile senzoriale, estimarile si operatiile criptografice ruleaza nativ pe dispozitivul mobil, cu sau fara conexiune la internet. Cand este disponibil serverul dedicat (self-hosted), aplicatia sincronizeaza automat cheltuielile de grup si cursurile valutare oficiale.

---

## 🚀 Module si Functionalitati Principale

### 1. Dashboard & Navigare Inteligenta
- **Bara de cautare instantanee**: Filtrare rapida in timp real dupa titlu, categorie sau etichete functionale (ex: `subnet`, `hash`, `ciment`, `jwt`).
- **Sectiune Favorite Fixate**: Acces direct la instrumentele cel mai des utilizate, memorate local in storage de inalta viteza (MMKV).
- **Navigare moderna**: Navigare pe tab-uri inferioare cu stil frosted glass si rutare bazata pe fisiere cu Expo Router.

### 2. Suita Retea (Network Suite)
- **Calculator Subnet & IP**: Calcul CIDR (/1 - /32), determinare automata masca de retea, wildcard, adresa de retea, broadcast, interval gazde utile, clase IP (A, B, C, D, E), detectie retele private RFC 1918 si reprezentare octetala binara.
- **Inspector Inregistrari DNS**: Rezolvare DNS via DoH (Cloudflare / Google) pentru inregistrari A, AAAA, MX, TXT, CNAME si NS, cu afisare TTL.
- **Generator QR Wi-Fi Securizat**: Generare instanta de coduri QR pentru conectare automata la retele WPA/WPA2/WPA3 sau WEP, cu optiune de retea ascunsa si partajare nativa.
- **Scanner Noduri LAN Locale**: Detectie dispozitive active in subretea, interogare porturi comune (HTTP, HTTPS, SSH, Dev) si testare latenta ping.
- **Speed Test & Monitor Latenta**: Masurare viteza reala download/upload si ping spre noduri externe sau server homelab propriu, cu istoric local pentru urmarirea fluctuatiilor Wi-Fi sau 4G/5G.

### 3. Scanare Documente & Generare PDF (Document Scanner)
- **Vizor Camera Nativ**: Cadru ghidaj in timp real pentru incadrarea documentelor si declansare asistata (`expo-camera`).
- **Corectie Perspectiva & Decupare**: Puncte de control pentru indreptarea documentelor fotografiate in unghi.
- **Filtre Document B&W & Contrast**: Procesare imagine pentru transformare in alb-negru curat, eliminare umbre si cresterea claritatii textului.
- **Compilator PDF Multi-Pagina**: Unire pagini scanate intr-un singur document A4 compact, salvare locala si export/partajare via `expo-sharing` si `expo-print`.
- **Inventar & Scaner Coduri de Bare**: Mini-sistem local de gestiune componente, cutii si echipamente homelab prin scanare coduri de bare EAN/QR cu alerta stoc redus si locatii.

### 4. Convertoare & Estimatoare (Converters & Math)
- **Convertor Universal de Unitati**: Lungime (m, km, ft, in, mi, nmi), Greutate/Masa (kg, g, lb, oz, tone), Volum (L, mL, gal, m3, fl oz) si Temperatura (°C, °F, K) cu afisarea formulei stiintifice aplicate.
- **Convertor Valutar Multi-Valuta Offline**: 16 valute internationale (RON, EUR, USD, GBP, CHF etc.) cu rate de schimb oficiale BNR/BCE salvate in cache local si actualizabile la cerere.
- **Estimator Materiale Constructii**:
  - *Beton & Ciment*: Volum metri cubi, saci necesari de 25kg/40kg, cantitate necesara de nisip, pietris si apa.
  - *Vopsea Lavabila*: Suprafata pereti, deducere goluri geamuri/usi, calcul litri si galeti de 5L/10L necesare.
  - *Gresie & Faianta*: Suprafata podea/perete, marime placi (ex: 60x60cm), marja de pierderi (10-15%) si numar cutii.
- **Decident & Selector Aleatoriu**: Zaruri virtuale configurabile (1d6, 2d6, 1d20), tragere la sorti din liste/optiuni, aruncare moneda si generator echilibrat de impartire pe echipe pentru proiecte studentesti.

### 5. Impartire Cheltuieli de Grup (Expense Splitter)
- **Registru Tranzactii de Grup**: Evidenta cheltuielilor comune (cazare, transport, mese) cu sustinere pentru participanti multipli si impartire egala sau procentuala.
- **Algoritm Greedy de Minimizare a Datoriilor (Min-Cash-Flow)**: Reduce complexitatea datoriilor de la $O(N^2)$ la cel mult $N-1$ tranzactii optime, eliminand datoriile circulare.
- **Sincronizare in Timp Real**: Trimiterea si primirea instantanee a cheltuielilor via WebSockets catre serverul self-hosted.

### 6. Hardware & Utilitare Nativ Senzoriale
- **Control Lanterna**: Aprindere/stingere lanterna telefon, potentiometru frecventa stroboscop (1-20 Hz) si semnalizare automata de urgenta SOS (cod Morse).
- **Nivela cu Bula pe Doua Axe**: Citire valori din senzorul de accelerometru (`expo-sensors`), calcul unghiuri Pitch & Roll, tinta grafica interactiva, calibrare offset la zero si feedback haptic la orizontalitate.
- **Busola Digitala**: Orientare 360° prin magnetometru, indicare directie cardinala si monitorizare intensitate camp magnetic ($\mu T$).
- **Generator Criptografic de Parole**: Generare caractere aleatorii sau fraze de acces (Passphrase) din dictionar, excludere caractere ambigue si calculare riguroasa a entropiei Shannon ($E = L \times \log_2 N$).
- **Inregistrator Audio & Jurnal Notite**: Inregistrare rapida audio pentru notite de curs sau idei pe fuga, masurare durata si atasare transcriere text asociata.
- **Manager Istoric Clipboard**: Retentie inteligenta si organizare pe categorii (Link-uri, Cod/JSON, Parole, Text) pentru textele copiate recent, cu optiune de fixare si re-copiere rapida.

### 7. Unelte pentru Dezvoltatori (Dev & Data Tools)
- **Generator Hash-uri Criptografice**: MD5 (RFC 1321), SHA-1, SHA-256, SHA-512 si HMAC cu cheie secreta.
- **Encoder & Decoder**: Conversie bidirectionala Base64, Hexadecimal si URL Component cu suport UTF-8.
- **Inspector Token JWT**: Decodare header si payload JSON, evidentiere algoritm si validare timestamp de expirare (`exp`, `iat`).
- **Convertor Epoch Timestamp**: Conversie instanta intre secunde/milisecunde Unix si format calendaristic UTC / Ora Romaniei.
- **Tester HTTP & API (Postman Lite)**: Client mobil integrat pentru trimitere cereri GET/POST/PUT/DELETE/PATCH, inspectare headere, timp de raspuns si formatare automata a raspunsului JSON.

---

## 🏗️ Arhitectura Backend (Go Fiber + SQLite + Litestream)

Backend-ul este conceput ca un microserviciu usor, independent, cu consum minim de resurse:
- **Limbaj**: Go (Golang 1.24)
- **Framework Web**: Fiber v2 cu WebSocket v2
- **Baza de Date**: SQLite3 cu jurnalizare WAL (`Write-Ahead Logging`) pentru citiri si scrieri paralele de inalta performanta.
- **Replicare Continua**: Litestream pentru backup automat continuu in spatiu extern/S3.
- **Job Cron Integrat**: Descarcare zilnica la 13:05 a cursurilor valutare oficiale publicate de Banca Nationala a Romaniei (BNR).
- **Deployment**: Docker container multi-stage (builder alpine -> runner 15MB).

---

## 🛠️ Ghid de Instalare si Rulare

### 1. Rulare Aplicatie Mobila (Frontend)
```bash
# Navigare in folderul aplicatiei
cd licenta/DAM3-Proiect

# Instalare dependente
npm install

# Rulare suita completa de teste automate
npm test

# Pornire server de dezvoltare Metro Expo
npm start

# Lansare pe emulator Android / iOS
npm run android
npm run ios
```

### 2. Rulare Backend Self-Hosted (Golang)
```bash
# Pornire directa cu Go
cd backend
go run main.go

# Sau pornire integrata prin Docker Compose
docker compose up -d --build
```

---

## 🧪 Verificare si Teste Automate
Suita de teste inclusa in `tests/run_all_tests.js` acopera:
- Calcul subnet CIDR, masti binare si intervale gazde
- Algoritmul de simplificare a datoriilor (cazuri simple, cicluri complete, registre mari)
- Formulele matematice de conversie si estimarile de santier
- Teste de consistenta criptografica (MD5, SHA-256, Base64, JWT, Epoch)
- Entropia si seturile de caractere ale generatorului de parole

Rulati oricand:
```bash
npm test
```
