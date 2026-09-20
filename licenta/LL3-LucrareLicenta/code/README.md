# Arhitectura și Securitatea Sistemelor Informatice Bancare
## Suita de Simulare și Audit Tehnico-Financiar (Licență Informatică Economică)

**Instituție:** Universitatea din Craiova  
**Facultate:** Facultatea de Economie și Administrarea Afacerilor (FEAA)  
**Program de Studii:** Informatică Economică (Promoția 2026)  
**Absolvent:** Moanță Ștefănuț-Cornel  

---

### 1. Prezentare Generală

În sectorul bancar modern, infrastructura critică este guvernată de standarde stricte de integritate financiară (**PCI-DSS**, **Directiva PSD2 / EBA RTS**, **ISO 20022**) și politici de reziliență cibernetică (**DORA - Digital Operational Resilience Act**). 

Acest director conține codul sursă și suita de testare a arhitecturii bancare virtualizate pe platforma de hypervisor Proxmox VE (Node 1 x86_64), integrată cu firewall-ul perimetral OPNsense și sistemul de monitorizare / SIEM Wazuh.

---

### 2. Arhitectura Celor 4 Active Bancare Virtualizate

```
                                 [ WAN / INTERNET ]
                                          |
                        +-----------------+-----------------+
                        |   OPNsense Stateful Firewall     |
                        |      (VM 200 · VLAN 10/20/30)     |
                        +-----------------+-----------------+
                                          |
         +--------------------------------+--------------------------------+
         |                                |                                |
[ VLAN 10 - Management ]         [ VLAN 20 - Services ]           [ VLAN 30 - CyberLab ]
         |                                |                                |
+--------+--------+              +--------+--------+              +--------+--------+
| VM 313: Bastion |              | VM 310: Core-   |              | VM 302: Kali    |
| Swift Jump-Box  |== SSH/MFA ==>| Banking Engine  |              | Security Lab    |
| (Hardened SSH)  |              +--------+--------+              +-----------------+
+-----------------+                       |                                
                                 +--------+--------+                       
                                 | VM 311: Fin-DB  |<== Wazuh HIDS         
                                 | (PostgreSQL)    |    Audit Monitor      
                                 +--------+--------+                       
                                          |                                
                                 +--------+--------+                       
                                 | CT 312: Payment |                       
                                 | Gateway & SWIFT |                       
                                 +-----------------+                       
```

#### 1. VM 310: Core-Banking System (Apache Fineract / Mifos X Model)
* **IP / Rețea:** `192.168.20.50` (VLAN 20 - Services).
* **Rol:** Inima sistemului informatic bancar. Gestionează evidența clienților (KYC), conturile curente și de depozit, soldurile și registrul contabil general (**General Ledger**) conform principiului partidei duble (*Debite = Credite*).
* **Securitate:** Restricționat strict prin politici de rețea OPNsense și controale RBAC. Doar casierii autorizați (Tellers) și terminalul securizat de tip Kiosk (`192.168.20.100` / VM 205) au drept de interogare. Fiecare tranzacție este înlănțuită criptografic prin hash SHA-256 (tamper-evident ledger).

#### 2. VM 311: Financial Database Server (PostgreSQL Engine & Wazuh Auditor)
* **IP / Rețea:** `192.168.20.51` (VLAN 20 - Services).
* **Rol:** Izolarea datelor financiare de nivelul de aplicație web. Implementează concepte avansate de baze de date relaționale (materie Anul 2 FEAA): constrângeri de integritate referențială, tranzacții atomice (ACID) și jurnale de audit tranzacțional.
* **Monitorizare Wazuh SIEM:** Agentul Wazuh HIDS inspectează continuu interogările pentru a detecta:
  * Tentative de SQL Injection (`UNION SELECT`, `' OR '1'='1`).
  * Interogări masive anormale (tentative de exfiltrare a soldurilor).
  * **Balance Tampering (Regula Critică Nivel 14):** Compararea soldului stocat în tabela `accounts` cu suma tranzacțiilor din `ledger_transactions`. Orice modificare directă neautorizată declanșează alertă imediată în SIEM.

#### 3. CT 312: Payment Gateway & Interbank Settlement Simulator
* **IP / Rețea:** `192.168.20.52` (VLAN 20 - Services / Alpine LXC).
* **Rol:** Microserviciu FastAPI pentru simularea procesării tranzacțiilor cu carduri (Visa / Mastercard) și a transferurilor interbancare de mare valoare (**SWIFT MT103 / ISO 20022 pacs.008**).
* **Securitate & Detecție:**
  * Validare carduri prin algoritmul Luhn (Mod 10) și tokenizare/mascare PCI-DSS.
  * Reguli de risc EBA/PSD2 pentru Strong Customer Authentication (SCA) la sume peste 10.000 EUR.
  * Filtru anti-fraudă pentru atacuri de viteză / *Card Stuffing* (blocare automată cu cod HTTP 429).
  * Validare integritate identificatori unici de transfer interbancar UETR (RFC 4122 UUID v4).

#### 4. VM 313: Swift / Jump-Box (Hardened Bastion Host)
* **IP / Rețea:** `192.168.10.50` (VLAN 10 - Management / Hardened Linux).
* **Rol:** Punct unic de acces administrativ pentru operatorii de sistem și inginerii de infrastructură financiară.
* **Mecanisme de Protecție:** Autentificare exclusivă bazată pe chei criptografice ed25519 și MFA (Time-based One-Time Password). Împiedică atacurile de tip *infostealer* sau sustragerea credențialelor salvate pe stațiile de lucru de la compromiterea serverelor de producție din VLAN 20.

---

### 3. Structura Fișierelor de Cod

| Fișier | Descriere Tehnică |
| :--- | :--- |
| `payment_gateway_simulator.py` | Microserviciu FastAPI pentru autorizare plăți card (Visa/MC) și decontare interbancară SWIFT/ISO 20022. |
| `core_banking_service.py` | Motor de Core-Banking bazat pe modelul Apache Fineract, contabilitate în partidă dublă și RBAC. |
| `database_audit_monitor.py` | Schema bazei de date financiare relaționale, tranzacții ACID și modul de audit Wazuh SIEM. |
| `banking_attack_simulator.py` | Suită integrată de testare automată a celor 5 scenarii de atac și validare a mecanismelor de apărare. |
| `requirements.txt` | Lista bibliotecilor Python necesare pentru rulare și testare. |

---

### 4. Ghid de Instalare și Execuție

#### A. Cerințe Preliminare
Este recomandată utilizarea unui mediu virtual Python (versiune 3.10+):
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### B. Executarea Suitei Complete de Testare și Audit (Recomandat pentru Demonstrație Licență)
Rularea testelor de atac și verificare a conformității arhitecturii:
```bash
python3 banking_attack_simulator.py
```

Ieșirea va afișa validarea celor 5 scenarii MITRE ATT&CK și procentul de reziliență cibernetică (100% PASS):
1. **SCENARIO-01:** Nominal Kiosk & Teller Workflow (T1078)
2. **SCENARIO-02:** DB SQL Injection & Balance Tampering (T1190 & T1565)
3. **SCENARIO-03:** Payment Gateway Card Stuffing & Velocity Flood (T1110)
4. **SCENARIO-04:** Bastion Host Bypass & Lateral Movement (T1021)
5. **SCENARIO-05:** SWIFT Message Tampering & Corrupt UETR (T1565)

#### C. Rularea Individuală a Modulelor
Fiecare modul conține propria suită autonomă de teste:
```bash
# Teste individuale Payment Gateway
python3 payment_gateway_simulator.py

# Teste individuale Core-Banking
python3 core_banking_service.py

# Teste individuale Bază de Date & Wazuh
python3 database_audit_monitor.py
```

#### D. Pornirea Serviciilor REST API (Opțional pentru integrare în container)
```bash
# Pornire Payment Gateway pe portul 8000
python3 payment_gateway_simulator.py --serve

# Pornire Core-Banking pe portul 8080
python3 core_banking_service.py --serve
```

---

### 5. Aliniere Academică și Relevanță Economică
Această implementare reflectă aplicarea practică a conceptelor fundamentale studiate în cadrul programului de **Informatică Economică (FEAA Craiova)**:
* **Baze de Date Financiare:** Proiectarea schemelor relaționale, garantarea integrității referențiale, normalizare (3NF/BCNF) și audit tranzacțional.
* **Contabilitate Informatizată:** Respectarea principiului dublei înregistrări (*Debit = Credit*) și generarea de registre neschimbabile (General Ledger).
* **Securitatea Sistemelor Informatice:** Segmentare de rețea (VLAN 10/20/30), apărare în adâncime (*Defense in Depth*), control strict al accesului (RBAC) și integrare SIEM (Wazuh) pentru detecția timpurie a fraudelor.
