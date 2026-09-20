# Nexus Core-Banking Kiosk & Wazuh SIEM Telemetry Simulator

Acest modul face parte din lucrarea de licență **„Arhitectura și Securitatea Sistemelor Informatice Bancare: Proiectarea, Implementarea și Auditul Rezilienței Cibernetice într-un Mediu Virtualizat”** (Universitatea din Craiova, FEAA, Informatică Economică, 2026 - Moanță Ștefănuț-Cornel).

Modulul conține:
1. **Backend Java Spring Boot 3** cu securitate stateless JWT, control al accesului, contabilitate de partidă dublă și **jurnalizare structurată JSON** destinată agentului Wazuh SIEM.
2. **Frontend Kiosk Bancar Minimalist** conform specificațiilor de ATM/Kiosk izolat (Zero Navigation Chrome, tastatură numerică pe ecran, countdown de 45s cu auto-wipe, transfer rapid 50 RON și consolă de telemetrie Wazuh SOC în timp real).
3. **Suport Hibrid Dual-Mode**: funcționează atât conectat la backend-ul Java Spring Boot (`http://localhost:8080`), cât și autonom pe **GitHub Pages** prin motorul in-browser încorporat.

---

## 1. Structura Directorului `code/web`

```
code/web/
├── backend/                              # Aplicație Java Spring Boot 3
│   ├── pom.xml                           # Configurație Maven cu Spring Security & JJWT
│   ├── Dockerfile                        # Multi-stage Docker container build
│   └── src/main/
│       ├── java/ro/ucv/feaa/bank/
│       │   ├── BankApplication.java       # Clasa principală
│       │   ├── config/                   # Spring Security, JWT Util, CORS
│       │   ├── controller/               # Auth, Kiosk, Portal, Audit REST Controllers
│       │   ├── dto/                      # Modele Request / Response
│       │   ├── model/                    # Entități BankAccount & BankTransaction
│       │   └── service/                  # AccountService & StructuredAuditLogger
│       └── resources/
│           ├── application.yml           # Port 8080, cheie JWT, căi fișiere log
│           └── static/                   # Copie a frontend-ului servită direct de Spring Boot
├── css/
│   └── kiosk.css                         # Stiluri ATM Kiosk, Dark Mode & SOC Console
├── js/
│   ├── mock-engine.js                    # Simulator in-browser pentru GitHub Pages
│   ├── api.js                            # Client API hibrid (Live Spring Boot / Demo)
│   └── app.js                            # Mașină de stări Kiosk, timer 45s, Auto-Wipe
├── index.html                            # Interfața web a terminalului Kiosk
└── README.md                             # Documentație tehnică și ghid de rulare
```

---

## 2. Rularea Backend-ului Java Spring Boot

### Opțiunea A: Rulare directă cu Maven (local sau în VM Proxmox)
```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```
Aplicația va porni pe portul `8080`, iar interfața web Kiosk va fi accesibilă la adresa `http://localhost:8080/`.

### Opțiunea B: Rulare în Container Docker / Podman
```bash
cd backend
docker build -t bank-kiosk-app .
docker run -d -p 8080:8080 -v /var/log/bank-app:/var/log/bank-app --name bank-kiosk bank-kiosk-app
```

---

## 3. Contractul API RESTful (Spring Boot)

### A. Autentificare Client Kiosk (`POST /api/v1/auth/login`)
* **Request:**
  ```json
  {
    "clientId": "K-1002",
    "pin": "8421"
  }
  ```
* **Response 200 OK:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 45,
    "clientId": "K-1002",
    "name": "Popescu Ion",
    "iban": "RO99NXCR0001842100000001"
  }
  ```
* **Response 401 Unauthorized (Wazuh trigger):**
  ```json
  {
    "error": "Invalid credentials",
    "attemptCount": 3,
    "message": "Cod PIN sau ID client incorect. Eveniment jurnalizat pentru analiza SOC."
  }
  ```

### B. Interogare Sold (`GET /api/v1/kiosk/balance`)
* **Headers:** `Authorization: Bearer <token_jwt>`
* **Response 200 OK:**
  ```json
  {
    "iban": "RO99NXCR0001842100000001",
    "balance": 1450.00,
    "currency": "RON",
    "accountType": "CURRENT",
    "savingsBalance": 3200.00,
    "savingsIban": "RO99NXCR0002842100000002"
  }
  ```

### C. Transfer Rapid către Cont Economii (`POST /api/v1/kiosk/transfer`)
* **Headers:** `Authorization: Bearer <token_jwt>`
* **Request:**
  ```json
  {
    "targetIban": "RO99NXCR0002842100000002",
    "amount": 50.00
  }
  ```
* **Response 200 OK:**
  ```json
  {
    "status": "COMPLETED",
    "transactionId": "TX-4921",
    "amount": 50.00,
    "targetIban": "RO99NXCR0002842100000002",
    "newBalance": 1400.00,
    "timestamp": "2026-09-20T20:31:12Z"
  }
  ```

### D. Simulare Anomalie de Securitate (`POST /api/v1/audit/simulate-anomaly`)
* **Request:**
  ```json
  {
    "anomalyType": "BALANCE_TAMPERING_INJECTION",
    "details": "Discrepanță forțată în baza de date pentru testare Wazuh Rule 100109",
    "triggerHttp500": false
  }
  ```
* **Response 200 OK:**
  ```json
  {
    "status": "ANOMALY_LOGGED",
    "anomalyType": "BALANCE_TAMPERING_INJECTION",
    "wazuhTargetFile": "/var/log/bank-app/security.log",
    "wazuhRuleId": 100109,
    "message": "Evenimentul suspect a fost scris cu succes in logul auditat de agentul Wazuh."
  }
  ```

---

## 4. Integrarea cu Wazuh SIEM („Secret Sauce”)

Spring Boot scrie în mod automat fiecare eveniment relevant în format JSON delimitat pe linii noi în `/var/log/bank-app/security.log` (cu fallback local în `./logs/security.log`):

```json
{"timestamp":"2026-09-20T20:30:15Z","event":"LOGIN_FAILED","client":"K-1002","sourceIp":"192.168.30.50","reason":"BAD_PIN","attemptCount":3}
{"timestamp":"2026-09-20T20:31:00Z","event":"LOGIN_SUCCESS","client":"K-1002","sourceIp":"192.168.20.100","sessionExpiresIn":45,"iban":"RO99NXCR0001842100000001"}
{"timestamp":"2026-09-20T20:31:12Z","event":"TRANSFER_EXECUTED","client":"K-1002","sourceIp":"192.168.20.100","amount":50.0,"sourceIban":"RO99NXCR0001842100000001","targetIban":"RO99NXCR0002842100000002","txId":"TX-7812","newBalance":1400.0}
{"timestamp":"2026-09-20T20:31:45Z","event":"SESSION_TIMEOUT_AUTO_WIPE","client":"K-1002","sourceIp":"192.168.20.100","reason":"COUNTDOWN_EXPIRED","action":"AUTO_WIPE_CREDENTIALS"}
{"timestamp":"2026-09-20T20:32:10Z","event":"SIMULATED_ANOMALY_TRIGGERED","client":"ADMIN_CONSOLE","sourceIp":"192.168.20.100","anomalyType":"BALANCE_TAMPERING_INJECTION","severity":"CRITICAL","details":"Discrepanță simulată în ledger","mitreTechnique":"T1565.001"}
```

### Configurare în Agentul Wazuh (`/var/ossec/etc/ossec.conf` pe VM 310 / VM 205)
```xml
<localfile>
  <log_format>json</log_format>
  <location>/var/log/bank-app/security.log</location>
</localfile>
```

---

## 5. Caracteristici UX / UI Kiosk Mode
* **Zero Navigation Chrome:** Fără elemente de navigare sau footer-e care distrag; interfață dedicată exclusiv terminalului bancar securizat.
* **On-screen Numeric Pad:** Tastatură tactilă pe ecran cu cifrele 0-9, tasta „Șterge” și tasta „OK”, eliminând riscul de keylogging pe tastaturi fizice neautorizate.
* **Countdown Timer 45s:** Monitorizează inactivitatea clientului; la expirare (sau la click pe „Închide Sesiunea / Eject Card”), execută procedura `Auto-Wipe State` (eliminare JWT din memorie/localStorage, revenire la ecranul de start).
* **Consolă SOC Live:** Zonă retractabilă la baza ecranului care afișează telemetria JSON în timp real și permite testarea atacurilor de tip Brute-Force sau a anomaliilor direct din interfață.
