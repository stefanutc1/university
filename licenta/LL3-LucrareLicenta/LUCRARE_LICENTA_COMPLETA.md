# UNIVERSITATEA DIN CRAIOVA
## FACULTATEA DE ECONOMIE ȘI ADMINISTRAREA AFACERILOR
### Programul de studii: Informatică Economică | Forma de învățământ: Cu frecvență (IF)

---

# LUCRARE DE LICENȚĂ

## ARHITECTURA ȘI SECURITATEA SISTEMELOR INFORMATICE BANCARE: PROIECTAREA, IMPLEMENTAREA ȘI AUDITUL REZILIENȚEI CIBERNETICE ÎNTR-UN MEDIU VIRTUALIZAT

**Coordonator științific:** Conf. univ. dr. [Nume Coordonator]  
**Absolvent:** Moanță Ștefănuț-Cornel  
**Craiova, 2026**

---

## CUPRINS

- **INTRODUCERE**
- **CAPITOLUL 1. STADIUL CUNOAȘTERII ÎN SECURITATEA CIBERNETICĂ BANCARĂ**
  - 1.1. Cadrul de reglementare și conformitate în sectorul bancar european și național
    - 1.1.1. Directiva Revizuită privind Serviciile de Plată (PSD2) și Cerințele EBA RTS
    - 1.1.2. Regulamentul DORA (Digital Operational Resilience Act - UE 2022/2554)
    - 1.1.3. Standardul de Securitate a Datelor din Industria Cardurilor (PCI-DSS v4.0)
    - 1.1.4. Standardul ISO 20022 și Reglementările Băncii Naționale a României (BNR)
  - 1.2. Arhitectura sistemelor informatice financiar-bancare
    - 1.2.1. Sistemele de Core-Banking și Registrul General în Partidă Dublă
    - 1.2.2. Porțile de Plată Electronice (Payment Gateways) și Procesarea Tranzacțiilor
    - 1.2.3. Comunicațiile Interbancare și Rețeaua SWIFT
  - 1.3. Vectori de atac contemporani și analiza amenințărilor în sectorul bancar
    - 1.3.1. Manipularea Bazelor de Date și Atacurile de tip SQL Injection
    - 1.3.2. Fraudele Tranzacționale: Card Stuffing, Velocity Floods și Credential Stuffing
    - 1.3.3. Mișcarea Laterală, Compromiterea Nodurilor Administrative și Infostealers
    - 1.3.4. Alterarea Mesageriei Financiare și Campaniile Ransomware cu Dublă Extorcare
  - 1.4. Principii și mecanisme de securitate defensivă bancară
    - 1.4.1. Paradigma Zero Trust (ZTA) și Principiul Privilegiului Minim (PoLP)
    - 1.4.2. Segmentarea Rețelei, VLAN-uri și Firewalling Stateful cu Inspecție Profundă
    - 1.4.3. Monitorizarea Integrității Datelor și Sistemele HIDS/SIEM (Wazuh)
    - 1.4.4. Bastioane Administrative (Jump-Box) cu Autentificare Ed25519 și MFA
- **CAPITOLUL 2. PROIECTAREA, IMPLEMENTAREA ȘI EVALUAREA ARHITECTURII BANCARE REZILIENTE ÎNTR-UN MEDIU VIRTUALIZAT**
  - 2.1. Arhitectura generală și topologia laboratorului virtual bancar
    - 2.1.1. Platforma de Virtualizare Proxmox VE 9.2 și Dimensionarea Resurselor
    - 2.1.2. Segmentarea Rețelei prin Firewall OPNsense și Politici Inter-VLAN
  - 2.2. Implementarea componentelor bancare fundamentale
    - 2.2.1. Mașina Virtuală Core-Banking Engine (VM 310) și Ledger-ul Criptografic
    - 2.2.2. Mașina Virtuală Financial Database (VM 311) și Motorul de Audit Wazuh
    - 2.2.3. Containerul LXC Payment Gateway & SWIFT Simulator (CT 312)
    - 2.2.4. Mașina Virtuală SWIFT Jump-Box (VM 313) cu Securitate Sporită
  - 2.3. Scenarii experimentale de atac, simulare și validare defensivă
    - 2.3.1. Scenariul 1: Linia de Bază Tranzacțională Kiosk/Casierie (T1078)
    - 2.3.2. Scenariul 2: Atac SQL Injection și Alterare de Sold - Balance Tampering (T1190/T1565)
    - 2.3.3. Scenariul 3: Atac de tip Card Stuffing și Velocity Flood pe Poarta de Plăți (T1110)
    - 2.3.4. Scenariul 4: Tentativă de Mișcare Laterală și Eludare Jump-Box (T1021)
    - 2.3.5. Scenariul 5: Falsificarea Mesageriei SWIFT și Coruperea UETR (T1565)
  - 2.4. Monitorizarea securității, colectarea telemetriei și corelarea evenimentelor în Wazuh SIEM
  - 2.5. Evaluarea performanței, a rezilienței cibernetice și a conformității de reglementare
- **CONCLUZII**
- **BIBLIOGRAFIE**
- **ANEXE**
  - Anexa A: Schema SQL DDL a Bazei de Date Financiare și a Registrului Contabil
  - Anexa B: Implementarea Motorului de Verificare a Integrității și Detecție a Manipulării Soldurilor
  - Anexa C: Jurnalul Telemetric de Securitate și Structura Alertelor Wazuh JSON

---

# INTRODUCERE

Sectorul financiar-bancar traversează în prezent cea mai amplă și accelerată transformare tehnologică din istoria sa modernă. Migrarea accelerată de la modelele bancare tradiționale, bazate pe sucursale fizice și canale de comunicare închise, către ecosisteme financiare digitale descentralizate, platforme de open banking, microservicii în cloud și interfețe de programare a aplicațiilor (API-uri) a redefinit fundamental modul în care instituțiile de credit interacționează cu clienții și cu partenerii de afaceri. Această evoluție a adus beneficii economice substanțiale: tranzacții în timp real, costuri operaționale optimizate, accesibilitate continuă și o eficiență sporită a fluxurilor de capital.

Totuși, digitalizarea extinsă a condus la o expansiune fără precedent a suprafeței de atac. Pentru entitățile rău-intenționate – variind de la grupări de criminalitate cibernetică organizată motivate financiar, până la actori statali persistenți avansați (APT – Advanced Persistent Threats) – sistemele informatice bancare reprezintă ținta supremă. O breșă de securitate într-o instituție financiară nu produce doar pierderi patrimoniale directe, ci poate declanșa crize de lichiditate, falimente bancare, erodarea ireversibilă a încrederii publice și chiar instabilitate sistemică la nivel macroeconomic. În acest peisaj operațional ostil, abordările convenționale de securitate, bazate exclusiv pe apărarea perimetrică clasică, s-au dovedit complet inadecvate.

Conștientizând această vulnerabilitate sistemică, organismele internaționale și europene de reglementare au instituit cadre normative extrem de riguroase. Directiva Revizuită privind Serviciile de Plată (PSD2) a impus mecanisme obligatorii de Autentificare Strictă a Clienților (SCA – Strong Customer Authentication) și legături dinamice tranzacționale. Standardul de Securitate a Datelor din Industria Cardurilor de Plată (PCI-DSS v4.0) a stabilit cerințe stricte pentru criptarea și izolarea mediului datelor titularilor de card (CDE). În paralel, noul Regulament European privind Reziliența Operațională Digitală (DORA – Regulamentul UE 2022/2554) obligă instituțiile financiare să demonstreze nu doar existența unor controale defensive, ci capacitatea demonstrabilă de a rezista, de a absorbi șocurile și de a se recupera rapid în urma unor incidente cibernetice disruptive majore.

Alegerea acestei teme de cercetare este motivată de necesitatea acută de a crea o punte solidă între teoria economică financiar-bancară (evidența contabilă în partidă dublă, decontarea tranzacțiilor, gestiunea riscurilor) și ingineria sistemelor informatice securizate (rețele de calculatoare, sisteme de operare întărite, baze de date tranzacționale și securitate ofensivă/defensivă). În cadrul programului de studii Informatică Economică din cadrul Facultății de Economie și Administrarea Afacerilor a Universității din Craiova, înțelegerea mecanismelor interne care garantează integritatea și confidențialitatea activelor digitale reprezintă o competență fundamentală pentru formarea specialiștilor capabili să gestioneze riscul operațional modern.

Obiectivul principal al prezentei lucrări de licență constă în proiectarea, implementarea completă, testarea experimentală și auditarea unei arhitecturi informatice bancare reziliente, complet virtualizate într-un laborator de cercetare avansat. Pentru îndeplinirea acestui deziderat general, au fost stabilite următoarele obiective specifice de cercetare:

1. **Obiectivul 1:** Analiza critică a stadiului actual al cunoașterii privind securitatea cibernetică în mediul bancar, investigând cerințele de conformitate (DORA, PSD2 RTS, PCI-DSS v4.0, ISO 20022), principiile contabile ale sistemelor Core-Banking și vectorii de atac contemporani.
2. **Obiectivul 2:** Proiectarea unei topologii de laborator complet virtualizate pe platforma de hypervisor bare-metal Proxmox VE 9.2, bazată pe segmentare logică de rețea prin VLAN-uri (Management, Services, CyberLab) și firewalling perimetral de ultimă generație prin OPNsense.
3. **Obiectivul 3:** Implementarea practică a celor patru active bancare fundamentale: un motor central de Core-Banking (VM 310) inspirat de standardul deschis Apache Fineract cu registru contabil în partidă dublă și înlănțuire criptografică SHA-256 a tranzacțiilor; un server de bază de date relațională (VM 311 - PostgreSQL) cu tabele de audit nealterabile; o poartă de plăți (CT 312) cu validare Luhn, verificare anti-fraudă și suport pentru schemele de mesagerie SWIFT MT103 și ISO 20022 pacs.008; precum și un bastion de acces securizat (VM 313 - Jump-Box) protejat prin chei criptografice Ed25519 și autentificare cu factori multipli (MFA).
4. **Obiectivul 4:** Dezvoltarea și executarea unei suite automatizate de simulare a atacurilor cibernetice (Red Team vs. Blue Team) acoperind 5 scenarii critice: de la tranzacționarea nominală de referință, la atacuri de tip SQL Injection și alterare directă de sold (Balance Tampering), atacuri de tip Card Stuffing pe fluxul de autorizare, mișcare laterală și eludare a bastionului administrativ, până la coruperea structurilor de mesagerie interbancară.
5. **Obiectivul 5:** Integrarea unui sistem de monitorizare a integrității și detecție a intruziunilor (HIDS/SIEM - Wazuh), configurarea unor reguli analitice de corelare în timp real capabile să identifice decalajele contabile și maparea integrală a incidentelor pe matricea internațională MITRE ATT&CK for Financial Services.
6. **Obiectivul 6:** Evaluarea riguroasă a performanței operaționale, a rezilienței la incidente și a gradului de conformitate de reglementare obținut, evidențiind valoarea adăugată a cercetării și impactul economic direct asupra diminuării pierderilor operaționale din fraude.

Metodologia de cercetare adoptată îmbină analiza teoretică și normativă a literaturii de specialitate cu o abordare cantitativă experimentală. Întreaga arhitectură a fost instanțiată pe nodul fizic de calcul x86_64 bare-metal al infrastructurii de laborator (procesor Intel Core i3-10100F cu 4 nuclee fizice / 8 fire de execuție la 4.30 GHz Turbo, 12 GB memorie RAM DDR4 completată cu subsistem dinamic ZRAM de 6.0 GB lz4 și subsistem de stocare de 512 GB SSD LVM-Thin sub Proxmox VE 9.2). Toate componentele software au fost dezvoltate în limbajul Python 3, utilizând cadre de lucru moderne (FastAPI, SQLite/PostgreSQL, hashlib) și au fost supuse unor teste de penetrare automate riguroase, asigurând reproductibilitatea completă a rezultatelor obținute.

Lucrarea este structurată riguros pe două capitole principale, conform ghidului de elaborare al facultății. Primul capitol, „Stadiul cunoașterii în securitatea cibernetică bancară”, sintetizează fundamentele legislative, arhitecturale, vulnerabilitățile curente și paradigmele defensive de ultimă generație. Al doilea capitol, „Proiectarea, implementarea și evaluarea arhitecturii bancare reziliente într-un mediu virtualizat”, constituie contribuția originală extinsă a autorului, detaliind construcția mediului experimental, codul sursă al serviciilor bancare, derularea atacurilor controlate, telemetria sistemului SIEM și validarea ipotezelor de cercetare. Lucrarea se încheie cu o secțiune de concluzii, bibliografia consultată și anexe tehnice cuprinzătoare.

---

# CAPITOLUL 1. STADIUL CUNOAȘTERII ÎN SECURITATEA CIBERNETICĂ BANCARĂ

## 1.1. Cadrul de reglementare și conformitate în sectorul bancar european și național

În sistemul economic contemporan, sectorul bancar este supus celui mai strict și complex regim de reglementare dintre toate ramurile economice. Această realitate derivă din rolul critic pe care băncile îl joacă ca intermediari financiari, administratori ai economiilor populației și garantori ai continuității mecanismelor de plăți și creditare. Într-o piață financiară unică la nivelul Uniunii Europene, riscul cibernetic a încetat să mai fie considerat o simplă problemă tehnică izolată a departamentelor de IT, fiind reîncadrat juridic și prudențial ca un risc operațional major cu potențial de contagiune sistemică.

### 1.1.1. Directiva Revizuită privind Serviciile de Plată (PSD2) și Cerințele EBA RTS
Directiva (UE) 2015/2366 a Parlamentului European și a Consiliului (cunoscută sub acronimul PSD2 – Payment Services Directive 2) a reprezentat o piatră de hotar în democratizarea și digitalizarea serviciilor de plată europene. Obiectivul central al directivei a fost stimularea concurenței, susținerea inovației financiare (FinTech) și facilitarea dezvoltării conceptului de Open Banking. Prin intermediul PSD2, băncile au fost obligate legal să deschidă accesul la conturile clienților (Access to Account – XS2A) către furnizorii terți autorizați (TPP – Third Party Providers), clasificați în furnizori de servicii de inițiere a plății (PISP) și furnizori de servicii de informare cu privire la conturi (AISP), prin intermediul unor interfețe de programare a aplicațiilor (API-uri) dedicate și securizate.

Pentru a contracara riscurile inerente deschiderii sistemelor financiare către terți, Autoritatea Bancară Europeană (EBA), în strânsă colaborare cu Banca Centrală Europeană (BCE), a elaborat Standardele Tehnice de Reglementare (RTS – Regulatory Technical Standards, consfințite prin Regulamentul Delegat UE 2018/389). Pilonul fundamental al acestor cerințe tehnice este reprezentat de Autentificarea Strictă a Clienților (SCA – Strong Customer Authentication). Conform Articolului 97 din PSD2, instituțiile de plată trebuie să aplice SCA ori de câte ori plătitorul accesează contul de plăți online, inițiază o operațiune de plată electronică sau efectuează orice acțiune printr-un canal la distanță care poate implica un risc de fraudă.

SCA este definită ca o procedură de autentificare bazată pe utilizarea a două sau mai multe elemente clasificate în categorii independente, astfel încât compromiterea unuia să nu compromită fiabilitatea celorlalte:
1. **Cunoaștere:** ceva ce numai utilizatorul știe (parolă statică, cod PIN);
2. **Posesie:** ceva ce numai utilizatorul deține (token hardware, smartphone autorizat capabil să primească notificări push semnate criptografic);
3. **Inerență:** ceva ce utilizatorul este (caracteristici biometrice: amprentă digitală, recunoaștere facială, scanare de retină).

În plus, pentru operațiunile de plată electronică la distanță, EBA RTS impune conceptul critic de legătură dinamică (Dynamic Linking): codul de autentificare generat trebuie să fie asociat matematic și univoc cu suma specifică a tranzacției și cu beneficiarul declarat de către plătitor. Dacă atacatorul încearcă să modifice beneficiarul sau suma în tranzit (atac de tip Man-in-the-Middle), codul de autentificare devine instantaneu nul.

### 1.1.2. Regulamentul DORA (Digital Operational Resilience Act - UE 2022/2554)
Deși PSD2 a consolidat securitatea la nivelul canalului de inițiere a plăților, vulnerabilitățile la nivelul infrastructurilor de bază, dependențele critice față de furnizorii de servicii cloud și riscurile de întrerupere operațională au determinat legiuitorul european să adopte Regulamentul (UE) 2022/2554 privind reziliența operațională digitală a sectorului financiar (DORA). Aplicabil direct în toate statele membre începând cu data de 17 ianuarie 2025, DORA reprezintă o schimbare radicală de paradigmă: accentul este mutat de pe simpla conformitate pasivă pe reziliența operațională activă, adică abilitatea unei entități financiare de a-și consolida, asigura și menține integritatea și continuitatea operațională în cazul unor întreruperi severe ale tehnologiilor informației și comunicațiilor (TIC).

Regulamentul DORA este structurat în jurul a cinci piloni operaționali obligatorii:
1. **Cadrul de management al riscurilor TIC:** consiliul de administrație poartă responsabilitatea directă pentru definirea politicilor de securitate, protecția activelor, segmentarea rețelelor și mecanismele automate de prevenire/detecție;
2. **Clasificarea și raportarea incidentelor majore legate de TIC:** raportare inițială în maxim 4 ore de la clasificare și cel târziu 24 de ore de la detecția incidentului către autoritățile competente (BNR / ASF);
3. **Testarea periodică a rezilienței operaționale digitale:** teste anuale de vulnerabilitate și, pentru băncile de importanță sistemică, teste avansate de penetrare ghidate de amenințări reale (TLPT – Threat-Led Penetration Testing) bazate pe cadrul TIBER-EU cel puțin o dată la 3 ani;
4. **Managementul riscurilor asociate furnizorilor terți de servicii TIC:** registru al acordurilor contractuale și supraveghere europeană directă a furnizorilor critici TIC;
5. **Acorduri de partajare a informațiilor:** schimb legal de indicatori tehnici de compromitere (IoCs) între bănci.

### 1.1.3. Standardul de Securitate a Datelor din Industria Cardurilor (PCI-DSS v4.0)
În domeniul plăților electronice cu carduri bancare, standardul internațional de referință este Payment Card Industry Data Security Standard (PCI-DSS), administrat de către Consiliul pentru Standarde de Securitate PCI. Lansată în versiunea 4.0 (cu aplicabilitate obligatorie deplină din martie 2025), noua specificație aduce modificări majore axate pe flexibilitatea controalelor de securitate, combaterea fraudelor de tip e-skimming și cerințe sporite de autentificare și criptografie.

Obiectivul fundamental al PCI-DSS este protecția Mediului de Date al Titularului de Card (CDE – Cardholder Data Environment), definit ca aria din rețea care stochează, procesează sau transmite date despre carduri (PAN, Nume Titular, Dată Expirare) sau Date Sensibile de Autentificare (SAD – codul CVV2/CVC2, date complete pistă magnetică, PIN). Un principiu cheie este reducerea ariei de aplicare a auditului (Scope Reduction): izolarea strictă a CDE prin micro-segmentare de rețea și firewall-uri. De asemenea, standardul interzice cu desăvârșire stocarea codului CVV după finalizarea autorizării și obligă la mascarea numărului de card în toate ecranele de afișare și jurnalele de sistem (afișarea doar a primelor șase cifre și a ultimelor patru cifre).

### 1.1.4. Standardul ISO 20022 și Reglementările Băncii Naționale a României (BNR)
Pe planul comunicațiilor interbancare și al decontărilor de mare valoare, asistăm la o revoluție tehnologică marcată de migrarea globală către standardul internațional ISO 20022. Timp de decenii, societatea interbancară SWIFT a utilizat formate de mesagerie telegrafică nestructurată de tip MT (MT103 pentru transferuri de credit simple sau MT940 pentru extrase de cont). Aceste mesaje aveau limite severe de spațiu și generau o rată ridicată de alerte false în sistemele de screening AML.

Standardul ISO 20022 introduce o sintaxă structurată bazată pe scheme XML și codificări unificate de tip MX (pacs.008 pentru plăți de credit interbancare, pacs.002 pentru rapoarte de stare a plăților și camt.053 pentru extrase bancare). Fiecare tranzacție financiară este obligată să conțină un identificator unic universal de la un capăt la altul (UETR – Unique End-to-end Transaction Reference), generat conform formatului RFC 4122 UUID v4, permițând trasabilitatea instantanee a fluxurilor financiare prin SWIFT gpi.

La nivel național, Banca Națională a României (BNR) exercită atribuțiile de supraveghere prudențială și monitorizare a infrastructurilor pieței financiare. Prin Regulamentul BNR nr. 4/2021 și normele conexe, banca centrală impune instituțiilor de credit autohtone cerințe riguroase de auditare periodică a securității sistemelor informatice, mecanisme obligatorii de redundanță pentru procesarea plăților prin sistemele ReGIS și SENT, precum și monitorizarea permanentă a conformității cu standardele europene.

#### Tabelul 1.1: Sinteza cerințelor de conformitate și a sancțiunilor în sectorul financiar-bancar european
| Cadru / Directivă | Emitent / Autoritate | Obiectiv Principal de Securitate | Sancțiuni Financiare / Impact |
| :--- | :--- | :--- | :--- |
| PSD2 (Directiva UE 2015/2366) | Parlamentul European / EBA | SCA obligatoriu, Open Banking prin API, Legătură dinamică sumă/beneficiar | Până la 5% din cifra de afaceri anuală sau retragerea autorizației de plată |
| DORA (Regulament UE 2022/2554) | Uniunea Europeană (direct aplicabil) | Reziliență operațională TIC, raportare incidente majore (<4h), teste TLPT/TIBER | Amenzi de până la 10 milioane EUR sau 5% din cifra de afaceri mondială totală |
| PCI-DSS v4.0 | PCI Security Standards Council | Izolarea CDE, interzicerea stocării CVV, mascarea PAN, criptarea tranzacțiilor | Amenzi de la 5.000 la 100.000 USD/lună din partea rețelelor Visa/Mastercard și revocare |
| ISO 20022 / BNR Reg. 4/2021 | ISO / Banca Națională a României | Mesagerie financiară XML structurată, trasabilitate UETR, audit infrastructuri | Sancțiuni administrative, suspendarea participării la sistemul de decontare ReGIS/SENT |

*Sursa: Sinteză a autorului pe baza directivelor UE și a standardelor internaționale.*

---

## 1.2. Arhitectura sistemelor informatice financiar-bancare

### 1.2.1. Sistemele de Core-Banking și Registrul General în Partidă Dublă
În centrul oricărei bănci se află sistemul de Core-Banking (Sistemul Central Bancar), reprezentat de platforme specializate precum Temenos Transact, SAP for Banking, Finacle, sau inițiative open-source de anvergură globală precum Apache Fineract și Mifos X. Misiunea fundamentală a motorului de Core-Banking este gestiunea stării conturilor, a clienților și, cel mai important, a Registrului General Contabil (General Ledger – GL).

Principiul imuabil care guvernează funcționarea registrului contabil încă din secolul al XV-lea (formalizat de Luca Pacioli) este contabilitatea în partidă dublă (Double-Entry Bookkeeping). Conform acestui model matematic, nicio sumă de bani nu poate apărea sau dispărea în mod spontan din sistem. Fiecare tranzacție financiară este compusă din cel puțin două înregistrări contabile contrare și perfect egale valoric: un debit și un credit. Relația de echilibru fundamental este exprimată prin ecuația matematică:

$$\sum_{i=1}^{n} \text{Debite}_i = \sum_{j=1}^{m} \text{Credite}_j$$

Din punct de vedere al bazei de date, sistemul de Core-Banking trebuie să garanteze proprietățile ACID (Atomicitate, Consistență, Izolare, Durabilitate). Atomicitatea garantează că transferul de fonduri reprezintă o unitate indivizibilă: fie ambele conturi sunt actualizate și ambele linii din registru sunt inserate, fie nicio modificare nu persistă în caz de eroare. Consistența garantează respectarea tuturor constrângerilor de integritate (de exemplu, blocarea soldurilor negative neautorizate). Izolarea elimină conflictele de concurență (dirty reads, race conditions), iar Durabilitatea garantează persistența pe suport nevolatil chiar și în caz de cădere totală de tensiune.

#### Tabelul 1.2: Structura conturilor și corespondența partidei duble în sistemele Core-Banking
| Tip Cont | Clasă Contabilă | Comportament la Debit | Comportament la Credit | Exemplu în Arhitectura Bancară |
| :--- | :--- | :--- | :--- | :--- |
| Activ (Assets) | Clasa 1/2 | Crește soldul (+) | Scade soldul (-) | Rezervele băncii la banca centrală, Credite acordate |
| Pasiv (Liabilities) | Clasa 3/5 | Scade soldul (-) | Crește soldul (+) | Depozitele clienților, Conturile curente ale populației |
| Cheltuieli (Expenses) | Clasa 6 | Crește soldul (+) | Scade soldul (-) | Dobânzi plătite deponenților, Comisioane interbancare |
| Venituri (Revenues) | Clasa 7 | Scade soldul (-) | Crește soldul (+) | Comisioane de procesare încasate, Dobânzi din credite |

*Sursa: Sinteza autorului pe baza normelor de contabilitate bancară IFRS și standardelor Core-Banking.*

### 1.2.2. Porțile de Plată Electronice (Payment Gateways) și Procesarea Tranzacțiilor
Poarta de Plăți (Payment Gateway) reprezintă interfața externă de acceptare a tranzacțiilor prin carduri bancare. Arhitectura tipică a procesării cardurilor implică cinci entități distincte: Titularul cardului (Cardholder), Comerciantul (Merchant), Banca Acceptatoare (Acquirer), Rețeaua de Carduri (Visa / Mastercard) și Banca Emitentă (Issuer).

Ciclul de viață al unei tranzacții parcurge două faze distincte: (1) Autorizarea – verificarea în timp real a fondurilor și a riscului de fraudă; (2) Compensarea și Decontarea (Clearing & Settlement) – faza asincronă de sfârșit de zi (Batch) prin care fondurile sunt transferate între bănci prin conturile băncii centrale.

La nivel de validare matematică inițială, numărul de card (PAN) trebuie să respecte algoritmul Luhn (Modulus 10), verificând relația:

$$\left( \sum_{i=1}^{n} f(c_i) \right) \pmod{10} = 0$$

### 1.2.3. Comunicațiile Interbancare și Rețeaua SWIFT
Pentru transferurile transfrontaliere și transferurile de mare valoare dintre instituții de credit diferite, canalul standardizat de comunicație este rețeaua SWIFT. Infrastructura SWIFT operează ca un serviciu de mesagerie extrem de securizat, utilizând o rețea privată de date bazată pe protocoale criptografice dedicate (SWIFT Secure IP Network – SIPN). Fiecare instituție financiară conectată deține un Cod de Identificare a Afacerii (BIC conform ISO 9362).

O componentă critică de securitate în cadrul nodului de conectare la rețeaua SWIFT (SWIFT Alliance Access sau Alliance Gateway) este asigurarea non-repudierii și a integrității mesajului prin intermediul infrastructurii cu chei publice (PKI). Fiecare mesaj financiar (fie el MT103 clasic sau pacs.008 XML) este semnat digital la nivelul modulului hardware de securitate (HSM). În noul standard ISO 20022, mesajul este încapsulat într-un antet de aplicație (Business Application Header – BAH / `head.001`), conținând semnătura digitală a expeditorului și identificatorul universal UETR.

---

## 1.3. Vectori de atac contemporani și analiza amenințărilor în sectorul bancar

### 1.3.1. Manipularea Bazelor de Date și Atacurile de tip SQL Injection
Baza de date este cel mai valoros activ informațional al unei bănci. Unul dintre cele mai devastatoare scenarii de atac constă în exploatarea unei vulnerabilități de tip SQL Injection (SQLi) la nivelul unei aplicații conexe (portal clienți, casierie, terminal Kiosk). Prin injectarea unor caractere de control (`' OR '1'='1` sau `UNION SELECT`), atacatorul poate eluda logica de autentificare.

În mod și mai grav, dacă aplicația comunică cu baza de date utilizând un utilizator cu privilegii excesive, atacatorul poate rula comenzi de modificare directă (`UPDATE accounts SET balance = balance + 1000000.00`). Acest tip de fraudă, cunoscut sub denumirea de **Balance Tampering**, creează monedă scripturală fictivă direct în baza de date fără flux de capital corespondent. Dacă sistemul nu deține un mecanism autonom de audit care să compare soldurile cu istoricul tranzacțiilor din ledger, atacatorul poate retrage fondurile frauduloase înainte de reconcilierea contabilă periodică.

### 1.3.2. Fraudele Tranzacționale: Card Stuffing, Velocity Floods și Credential Stuffing
Porțile de plată electronice sunt permanent asaltate de rețele de calculatoare compromise (botnet-uri) care derulează atacuri automatizate de tip Card Stuffing (Card Testing). Atacatorii obțin baze de date ilicite din Darknet conținând mii de numere de card parțial compromise și utilizează boți pentru a trimite cereri rapide de plată de valoare minimă (1 RON sau 0.50 EUR) pentru a ghici combinația validă de CVV și dată de expirare prin forță brută.

Aceste atacuri de viteză (Velocity Floods) pot induce stări de Denial of Service, generează amenzi din partea schemelor Visa/Mastercard pentru rate anormale de autorizări eșuate și epuizează resursele hardware ale băncii.

### 1.3.3. Mișcarea Laterală, Compromiterea Nodurilor Administrative și Infostealers
Atacurile cibernetice bancare moderne debutează de regulă cu compromiterea unei stații de lucru obișnuite din rețeaua de birou (Office Network), prin spear-phishing sau infectare cu troieni de tip Infostealer (RedLine, Lumma, Vidar), care fură din browsere parole salvate și chei private SSH.

Odată obținut un cap de pod în rețea (Initial Access), atacatorul inițiază etapa de Mișcare Laterală (Lateral Movement). Dacă rețeaua băncii este plană sau insuficient segmentată, atacatorul va scana segmentele interne căutând protocoale de administrare la distanță (SSH, RDP, WinRM) pentru a sări de pe stația de lucru compromisă pe serverele de producție. Din acest motiv, lipsa unui punct unic, strict controlat și întărit de tranzit administrativ (Bastion Host / Jump-Box) reprezintă o vulnerabilitate critică.

### 1.3.4. Alterarea Mesageriei Financiare și Campaniile Ransomware cu Dublă Extorcare
Un alt vector avansat îl constituie manipularea software-ului de middleware responsabil de procesarea fișierelor de tranzacții interbancare (cum a fost cazul jafului cibernetic de 81 milioane USD comis împotriva Băncii Centrale din Bangladesh în 2016). În paralel, atacurile de tip Ransomware au evoluat către modelul de Dublă Extorcare: pe lângă criptarea bazelor de date, atacatorii exfiltrează volume masive de date bancare și amenință cu publicarea lor dacă nu se plătește o răscumpărare substanțială.

#### Tabelul 1.3: Taxonomia principalilor vectori de atac bancari și impactul operațional asociat
| Vector de Atac | Tehnică MITRE ATT&CK | Mecanism de Exploatare | Impact Potențial Asupra Băncii |
| :--- | :--- | :--- | :--- |
| SQL Injection (SQLi) | T1190 (Exploit Public-Facing App) | Injectare comenzi SQL în câmpuri nefiltrate pentru bypass auth | Exfiltrare date clienți, escaladare de privilegii administrative |
| Balance Tampering | T1565.001 (Stored Data Manipulation) | UPDATE direct al tabelei accounts fără înregistrare în ledger | Generare de monedă scripturală fictivă, dezechilibru contabil major |
| Card Stuffing / Testing | T1110.001 (Password/Data Guessing) | Rafale automatizate de autorizări card cu CVV/dată aleatorii | Compromiterea cardurilor clienților, amenzi Visa/Mastercard, DoS |
| Mișcare Laterală | T1021.004 (Remote Services: SSH/RDP) | Scanare rețea internă și conectare cu credențiale furate | Compromiterea zonei de producție Core-Banking din segmentul Office |
| SWIFT Heist / Corupere | T1565.002 (Transmitted Data Manipulation) | Falsificarea fișierelor de tranzacții MT103/pacs.008 și UETR | Deturnare de fonduri internaționale de mare valoare, daune reputaționale |

*Sursa: Sinteză a autorului pe baza cadrului MITRE ATT&CK for Financial Services.*

---

## 1.4. Principii și mecanisme de securitate defensivă bancară

### 1.4.1. Paradigma Zero Trust (ZTA) și Principiul Privilegiului Minim (PoLP)
Formalizată prin standardul NIST SP 800-207, Arhitectura Zero Trust (ZTA) pornește de la premisa „Nu avea niciodată încredere, verifică întotdeauna” (Never trust, always verify). Nicio entitate nu primește încredere implicită pe baza adresei IP sau a poziției în rețea. Principiul Privilegiului Minim (PoLP) impune acordarea doar a drepturilor strict necesare îndeplinirii rolului funcțional.

### 1.4.2. Segmentarea Rețelei, VLAN-uri și Firewalling Stateful cu Inspecție Profundă
Segmentarea de rețea prin VLAN-uri (IEEE 802.1Q) izolează traficul la nivelul stratului 2 OSI. Trecerea pachetelor între VLAN-uri se realizează exclusiv la nivelul stratului 3 printr-un firewall stateful inspectat (OPNsense), aplicând principiul Default-Deny.

### 1.4.3. Monitorizarea Integrității Datelor și Sistemele HIDS/SIEM (Wazuh)
Sistemele SIEM/HIDS (Wazuh) monitorizează jurnalele de sistem, integritatea fișierelor (FIM) și tranzacțiile financiare, permițând corelarea alertelor de infrastructură cu anomaliile de afaceri în timp real.

### 1.4.4. Bastioane Administrative (Jump-Box) cu Autentificare Ed25519 și MFA
Un Jump-Box securizat elimină autentificarea prin parole statice, impunând criptografie asimetrică Ed25519 și autentificare cu factori multipli (TOTP RFC 6238), constituind punctul unic obligatoriu de tranzit administrativ.

#### Tabelul 1.4: Comparație între arhitectura defensivă perimetrică tradițională și arhitectura Zero Trust
| Criteriu de Comparație | Abordare Tradițională (Perimetrică) | Abordare Zero Trust (Modernă Bancară) |
| :--- | :--- | :--- |
| Model de Încredere | Încredere implicită în tot ce se află în rețeaua internă (LAN) | Încredere zero; fiecare pachet și identitate sunt verificate continuu |
| Segmentare Rețea | Rețea plană sau împărțită doar grosier în LAN și DMZ | Micro-segmentare granulară prin VLAN-uri dedicate (IEEE 802.1Q) |
| Controlul Accesului | Parole statice, drepturi largi acordate pe grupuri globale | Autentificare MFA + chei asimetrice Ed25519, RBAC strict și PoLP |
| Inspecția Traficului | Filtrare doar la intrarea în rețea prin firewall exterior | Inspecție stateful inter-VLAN cu politică Default-Deny și analiză SIEM |
| Auditul Integrității | Verificare manuală periodică a fișierelor și extraselor contabile | Audit continuu în timp real prin agenți HIDS/SIEM (Wazuh) și hash chaining |

*Sursa: Sinteză teoretică a autorului pe baza standardului NIST SP 800-207.*

---

# CAPITOLUL 2. PROIECTAREA, IMPLEMENTAREA ȘI EVALUAREA ARHITECTURII BANCARE REZILIENTE ÎNTR-UN MEDIU VIRTUALIZAT

## 2.1. Arhitectura generală și topologia laboratorului virtual bancar

### 2.1.1. Platforma de Virtualizare Proxmox VE 9.2 și Dimensionarea Resurselor
Infrastructura de calcul a fost implementată pe platforma de virtualizare bare-metal Proxmox Virtual Environment (PVE) 9.2 (nucleu Linux 7.0 pve) pe nodul fizic x86_64 primar al laboratorului (`pve`), echipat cu procesor Intel Core i3-10100F (4 nuclee fizice, 8 fire de execuție, frecvență de bază 3.60 GHz și până la 4.30 GHz Turbo, 6 MB Smart Cache), 12 GB memorie RAM DDR4 la 2133 MHz (12.288 MB), accelerator grafic dedicat NVIDIA GeForce GTX 1050 Ti (4 GB VRAM GDDR5), un subsistem de stocare de 512 GB SSD (gestionat printr-un pool LVM-Thin) și un modul ZRAM de 6.0 GB (/dev/zram0, compresie lz4, swappiness 60) ce garantează densitatea ridicată a sarcinilor de lucru și previne degradarea mediilor SSD prin VirtIO Memory Ballooning.

S-a utilizat o combinație optimizată de mașini virtuale KVM (pentru nodurile cu cerințe de izolare la nivel de nucleu OS) și containere LXC (pentru microserviciile cu rată ridicată de transfer și nodul central SIEM Wazuh), beneficiind de mecanismul de Memory Ballooning (virtio-balloon) pentru alocarea dinamică a memoriei.

#### Tabelul 2.1: Specificațiile tehnice și alocarea resurselor pentru activele virtualizate din nodul fizic Proxmox VE 9.2
| ID Activ | Denumire Nod | Tip Virtualizare | Sistem de Operare | Alocare vCPU / RAM | Stocare LVM | Rol Funcțional |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| VM 200 | opnsense-firewall | KVM (pve) | FreeBSD 14 / OPNsense | 2 vCPU / 1024 MB (512MB balloon) | 20 GB SSD | Firewall de frontieră, gateway inter-VLAN, IDS Suricata |
| VM 310 | core-banking-licenta | KVM (pve) | Debian 12 Bookworm | 2 vCPU / 2048 MB (1024MB balloon) | 40 GB SSD | Motor central Core-Banking, ledger în partidă dublă SHA-256 |
| VM 311 | fin-db-licenta | KVM (pve) | Debian 12 Hardened | 2 vCPU / 2048 MB (1024MB balloon) | 50 GB SSD | Server bază de date financiară PostgreSQL + reconciliere |
| CT 312 | payment-gateway-licenta | LXC (pve) | Alpine Linux 3.19 | 1 vCPU / 1024 MB (fix) | 10 GB rootfs | Microserviciu plăți rapide card (Luhn) & ISO 20022 pacs.008 |
| VM 313 | swift-jumpbox-licenta | KVM (pve) | Debian 12 Hardened | 2 vCPU / 1024 MB (512MB balloon) | 25 GB SSD | Bastion administrativ unic, SSH Ed25519 + MFA TOTP |
| CT 106 | wazuh-siem-licenta | LXC (pve) | Ubuntu 24.04 LTS | 4 vCPU / 6144 MB (4GB Heap) | 35 GB rootfs | Platformă centrală SIEM/XDR, OpenSearch Indexer & Dashboard |
| VM 205 | kiosk-terminal-licenta | KVM (pve) | Ubuntu 24.04 LTS | 2 vCPU / 1024 MB (fix) | 20 GB SSD | Terminal tranzacțional securizat casierie/kiosk (VLAN 20/30) |

*Sursa: Proiectare proprie a autorului în cadrul infrastructurii Proxmox VE.*

### 2.1.2. Segmentarea Rețelei prin Firewall OPNsense și Politici Inter-VLAN
Topologia utilizează puntea virtuală `vmbr0` cu tag-uri VLAN IEEE 802.1Q gestionate de firewall-ul OPNsense (VM 200). Cele trei zone sunt:
- **VLAN 10 (Management / 192.168.10.0/24):** Bastionul administrativ VM 313 (IP 192.168.10.50);
- **VLAN 20 (Services / 192.168.20.0/24):** Activele financiare de producție (VM 310, VM 311, CT 312);
- **VLAN 30 (CyberLab / 192.168.30.0/24):** Zona ofensivă Red Team (VM 302 Kali Linux).

#### Tabelul 2.2: Matricea de rutare și politicile de securitate firewalling OPNsense (VLAN 10, 20, 30)
| Zonă Sursă | Zonă Destinație | Port / Protocol | Acțiune Firewall | Justificare Tehnico-Economică |
| :--- | :--- | :--- | :--- | :--- |
| VLAN 10 (Bastion 313) | VLAN 20 (VM 310, 311) | TCP / 22 (SSH) | ALLOW (Log) | Tranzit administrativ autorizat exclusiv prin chei criptografice Ed25519 și MFA |
| VLAN 20 (VM 310 Core) | VLAN 20 (VM 311 DB) | TCP / 5432 (PostgreSQL) | ALLOW (Inspect) | Interogare internă a bazei de date financiare strict între serviciile autorizate |
| VLAN 20 (CT 312 Gateway) | VLAN 20 (VM 310 Core) | TCP / 8080 (REST API) | ALLOW (Inspect) | Transmitere instrucțiuni de compensare plăți după validarea riscului |
| VLAN 30 (CyberLab Attacker) | VLAN 20 (Financial Core) | ORICE (ANY) | BLOCK (Drop & Alert) | Regulă Default-Deny: izolarea completă a zonei financiare de mediul neîncrezut |
| VLAN 30 (CyberLab Attacker) | VLAN 10 (Bastion 313) | TCP / 22 (SSH) | ALLOW (Inspect) | Acces permis exclusiv la poarta de intrare SSH pentru verificarea MFA |

*Sursa: Politici de securitate definite și implementate în OPNsense Firewall.*

---

## 2.2. Implementarea componentelor bancare fundamentale

### 2.2.1. Mașina Virtuală Core-Banking Engine (VM 310) și Ledger-ul Criptografic
Motorul de Core-Banking (VM 310, `192.168.20.50`), inspirat de Apache Fineract, expune API-uri RESTful securizate bazate pe FastAPI. Clasa `CoreBankingEngine` validează starea conturilor, verifică solvabilitatea plătitorului, aplică controlul accesului pe bază de roluri (RBAC) și filtrează cererile pe baza IP-urilor autorizate ale casierilor (`192.168.20.10`) și terminalului Kiosk (`192.168.20.100` / `192.168.1.205`).

Fiecare tranzacție din registrul contabil (General Ledger) este înlănțuită criptografic prin hash SHA-256 (`record_hash`) calculat pe baza identificatorului tranzacției, conturilor implicate, sumei, monedei, timestamp-ului ISO 8601 și hash-ului tranzacției anterioare (`prev_hash`). Modificarea ilicită a oricărei înregistrări rupe lanțul de dispersie și declanșează starea de alertă.

```python
def _compute_hash(self, tx_id: str, src: str, dst: str, amount: float,
                  currency: str, timestamp: str, prev_hash: str) -> str:
    """Calcul amprentă SHA-256 pentru înlănțuirea criptografică a registrului."""
    payload = f"{tx_id}|{src}|{dst}|{amount:.2f}|{currency}|{timestamp}|{prev_hash}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()

# La inserarea tranzacției în General Ledger:
prev_hash = self.ledger[-1]["record_hash"] if self.ledger else "0" * 64
record_hash = self._compute_hash(tx_id, src_acc, dst_acc, amount, 
                                 currency, timestamp_iso, prev_hash)
```
*Listarea 2.1: Algoritmul de înlănțuire criptografică SHA-256 a registrului contabil în Core-Banking. Sursa: Elaborare proprie a autorului.*

### 2.2.2. Mașina Virtuală Financial Database (VM 311) și Motorul de Audit Wazuh
Serverul relațional financiar (VM 311, `192.168.20.51`) găzduiește tabelele `clients`, `accounts`, `ledger_transactions` și `financial_audit_log`. Modulul `WazuhSecurityAuditor` efectuează reconcilierea matematică automată în timp real: compară soldul stocat din tabela `accounts` cu suma algebrică a tranzacțiilor (Credite - Debite) din `ledger_transactions`. La sesizarea oricărui dezechilibru, contul este înghețat automat (`is_frozen = TRUE`) și este emisă alerta critică Wazuh Rule 100109 (Level 14 - Balance Tampering).

```python
def verify_account_balance_integrity(self, account_id: str) -> Tuple[bool, float, float]:
    """Verifică concordanța dintre soldul stocat și suma tranzacțiilor din ledger."""
    cur.execute("SELECT balance, initial_balance FROM accounts WHERE account_id = ?", (account_id,))
    stored_balance, init_bal = cur.fetchone()
    
    cur.execute("SELECT COALESCE(SUM(amount), 0) FROM ledger_transactions WHERE dst = ?", (account_id,))
    total_credits = cur.fetchone()[0]
    cur.execute("SELECT COALESCE(SUM(amount), 0) FROM ledger_transactions WHERE src = ?", (account_id,))
    total_debits = cur.fetchone()[0]
    
    computed_balance = init_bal + total_credits - total_debits
    if abs(stored_balance - computed_balance) > 0.001:
        self.emit_wazuh_alert(
            rule_id=100109, level=14,
            description="CRITICAL: Balance Tampering Detected via Discrepancy Audit",
            details=f"Stored: {stored_balance} | Computed: {computed_balance}"
        )
        return False, stored_balance, computed_balance
    return True, stored_balance, computed_balance
```
*Listarea 2.2: Algoritmul de verificare automată a dezechilibrului contabil și declanșare a alertei Wazuh. Sursa: Elaborare proprie a autorului.*

#### Tabelul 2.3: Structura schemei de date relaționale a serverului financiar (VM 311)
| Tabel Relațional | Coloane Cheie | Constrângeri de Integritate | Mecanism de Securitate Asociat |
| :--- | :--- | :--- | :--- |
| clients | client_id (PK), cnp_hash, full_name, risk_score | PRIMARY KEY, UNIQUE (cnp_hash) | Pseudonimizare GDPR prin dispersie criptografică unidirecțională |
| accounts | account_id (PK), client_id (FK), balance, is_frozen | FOREIGN KEY, CHECK (balance >= 0.0) | Blocare overdraft neautorizat, flag de înghețare imediată a activului |
| ledger_transactions | tx_id (PK), src, dst, amount, record_hash, prev_hash | PRIMARY KEY, CHECK (amount > 0) | Înlănțuire criptografică SHA-256 tamper-evident (General Ledger) |
| financial_audit_log | log_id (PK), event_type, severity, details, timestamp | PRIMARY KEY, NOT NULL fields | Jurnalizare append-only auditată în timp real de agentul Wazuh SIEM |

*Sursa: Proiectarea schemei de baze de date conform normelor ACID.*

### 2.2.3. Containerul LXC Payment Gateway & SWIFT Simulator (CT 312)
Microserviciul din CT 312 (`192.168.20.52`) validează cardurile bancare prin algoritmul Luhn (Mod 10), aplică mascarea strictă conform PCI-DSS v4.0, impune SCA conform PSD2 pentru tranzacții > 10.000 EUR și blochează tentativele de Card Stuffing prin limitatorul de rată cu fereastră glisantă (HTTP 429). De asemenea, generează mesaje interbancare ISO 20022 `pacs.008` cu identificatori UETR RFC 4122.

```python
def validate_luhn(card_number: str) -> bool:
    """Validare matematică a cifrei de control conform algoritmului Luhn (Mod 10)."""
    cleaned = re.sub(r"\D", "", card_number)
    if not (13 <= len(cleaned) <= 19):
        return False
    digits = [int(d) for d in cleaned]
    odd_digits = digits[-1::-2]
    even_digits = digits[-2::-2]
    checksum = sum(odd_digits)
    for d in even_digits:
        checksum += sum(divmod(d * 2, 10))
    return checksum % 10 == 0

def mask_pan(card_number: str) -> str:
    """Mascarea numărului de card conform cerințelor stricte PCI-DSS v4.0."""
    digits = re.sub(r"\D", "", card_number)
    if len(digits) < 10:
        return "INVALID_PAN"
    return f"{digits[:6]}{'*' * (len(digits) - 10)}{digits[-4:]}"
```
*Listarea 2.3: Validarea algoritmului Luhn și mascarea PAN pe poarta de plăți (CT 312). Sursa: Elaborare proprie a autorului.*

### 2.2.4. Mașina Virtuală SWIFT Jump-Box (VM 313) cu Securitate Sporită
VM 313 (`192.168.10.50`) oferă acces administrativ securizat prin eliminarea parolelor statice (`PasswordAuthentication no`), interzicerea accesului direct root (`PermitRootLogin no`), impunerea cheilor asimetrice Ed25519 și autentificarea cu doi factori (TOTP PAM). Porturile de ieșire sunt restricționate exclusiv către portul 22 al serverelor VM 310 și VM 311 din VLAN 20.

---

## 2.3. Scenarii experimentale de atac, simulare și validare defensivă

Suita automatizată `banking_attack_simulator.py` execută 5 scenarii de atac complexe:
1. **SCENARIO-01 (T1078):** Linia de bază tranzacțională legitimă Kiosk/Casierie – transfer de 250 EUR între Popescu Ion și Ionescu Maria, confirmat în ledger cu verificare de reconciliere zero (\(\Delta = 0.00\));
2. **SCENARIO-02 (T1190 / T1565.001):** Atac SQLi și Balance Tampering – injectare `' OR '1'='1` blocată, urmată de alterare directă de sold (+4.985.000 EUR). Auditorul Wazuh detectează discrepanța, îngheață contul și emite alerta critică Rule 100109 (Level 14);
3. **SCENARIO-03 (T1110.001):** Atac de tip Card Stuffing & Velocity Flood – rafală de 20 cereri rapide cu carduri sintetice. Respingere Luhn și blocare automată HTTP 429 cu alertă Wazuh Rule 100103;
4. **SCENARIO-04 (T1021.004):** Tentativă de mișcare laterală din DMZ (VLAN 30) – conexiuni directe SSH/PostgreSQL către VLAN 20 aruncate de firewall-ul OPNsense (Default Deny), iar conectarea pe Jump-Box e respinsă în lipsa cheii Ed25519 și tokenului TOTP;
5. **SCENARIO-05 (T1565.002):** Falsificare mesaj interbancar SWIFT / ISO 20022 – injectare mesaj `pacs.008` cu UETR corupt, respins structural de validator cu generarea alertei Wazuh Rule 100106.

#### Tabelul 2.4: Rezultatele testării experimentale pentru cele 5 scenarii de atac (Red Team vs. Blue Team)
| Cod Scenariu | Vector de Atac Simulat | Mecanism Defensiv Testat | Indicator de Detecție Wazuh | Rezultat Testare |
| :--- | :--- | :--- | :--- | :--- |
| SCENARIO-01 | Tranzacționare nominală casierie (T1078) | ACID DB, dublă înregistrare, SHA-256 Ledger | Wazuh Rule 100101 (Level 3 - Informațional) | 100% SUCCES (Nominal) |
| SCENARIO-02 | SQLi & Balance Tampering (T1190/T1565) | Filtrare parametri, reconciliere automată sold | Wazuh Rule 100109 (Level 14 - Critic Alert) | 100% SUCCES (Blocat) |
| SCENARIO-03 | Card Stuffing & Velocity Flood (T1110) | Algoritm Luhn, Sliding Window Rate Limiter | Wazuh Rule 100103 (Level 10 - High Rate Limit) | 100% SUCCES (Blocat 429) |
| SCENARIO-04 | Mișcare laterală din DMZ (T1021) | Firewall OPNsense Default-Deny, SSH Ed25519+MFA | Wazuh Rule 100105 (Level 12 - Bastion Drop) | 100% SUCCES (Blocat Drop) |
| SCENARIO-05 | Falsificare mesaj SWIFT/UETR (T1565) | Validare schemă ISO 20022 pacs.008, regex UETR | Wazuh Rule 100106 (Level 12 - Corrupted UETR) | 100% SUCCES (Respins) |

*Sursa: Rezultate generate direct din execuția suitei banking_attack_simulator.py.*

---

## 2.4. Monitorizarea securității, colectarea telemetriei și corelarea evenimentelor în Wazuh SIEM

#### Tabelul 2.5: Maparea alertelor de securitate pe matricea MITRE ATT&CK for Financial Services
| Regulă Wazuh ID | Nivel Severitate | Tehnică MITRE ATT&CK | Descriere Tehnică a Evenimentului Detectat | Răspuns Automat / Mitigare |
| :--- | :--- | :--- | :--- | :--- |
| Rule 100101 | Level 3 (Low) | T1078 (Valid Accounts) | Tranzacție financiară legitimă aprobată și înscrisă în ledger | Jurnalizare audit conformă cerințelor de reglementare BNR |
| Rule 100102 | Level 8 (Medium) | T1190 (SQL Injection) | Semnătură SQL Injection detectată în interfața de interogare | Blocare cerere HTTP 400 și introducere IP în lista de monitorizare |
| Rule 100103 | Level 10 (High) | T1110 (Brute Force) | Depășire prag de viteză tranzacțională (Card Stuffing) | Limitare rată HTTP 429 și blocare temporară IP timp de 15 minute |
| Rule 100105 | Level 12 (Critical) | T1021.004 (SSH Services) | Conexiune laterală respinsă pe Jump-Box sau bypass firewall | Drop conexiune la nivel de kernel nftables și alertă imediată SOC |
| Rule 100106 | Level 12 (Critical) | T1565.002 (Data Tampering) | Mesaj financiar interbancar cu semnătură coruptă sau UETR invalid | Rejection pacs.002 către expeditor și alertare ofițer de plăți |
| Rule 100109 | Level 14 (Emergency) | T1565.001 (Stored Manipulation) | Dezechilibru grav de sold detectat la reconcilierea contabilă | Înghețare automată cont (is_frozen=TRUE) și declanșare procedură DORA |

*Sursa: Proiectarea regulamentului de corelare Wazuh SIEM.*

---

## 2.5. Evaluarea performanței, a rezilienței cibernetice și a conformității de reglementare

Măsurătorile experimentale efectuate pe un eșantion de 1.000 de tranzacții paralele demonstrează eficiența soluției:
- **Latența medie de procesare a tranzacțiilor:** 11.4 ms (deviație standard 2.1 ms), respectând cu o marjă confortabilă cerințele SEPA Instant (sub 5 secunde);
- **Latența auditului de integritate:** 4.2 ms pentru reconcilierea matematică a soldului prin însumarea tranzacțiilor din ledger;
- **Timpul de detecție și alertare SIEM:** 0.85 secunde de la alterarea bazei de date până la declanșarea alertei critice de nivel 14 în tabloul de bord Wazuh.

#### Tabelul 2.6: Evaluarea comparativă a gradului de conformitate cu cerințele DORA, PSD2 și PCI-DSS v4.0
| Standard / Normativ | Cerință Specifică de Conformitate | Implementare Tehnică în Laboratorul Bancar | Statut Validare |
| :--- | :--- | :--- | :--- |
| DORA (Reg. UE 2022/2554) | Art. 9: Mecanisme prompte de detecție a anomaliilor | Wazuh HIDS cu reconciliere matematică automată (Rule 100109) | CONFORM (Complet) |
| DORA (Reg. UE 2022/2554) | Art. 11: Raportare incidente majore (< 4 ore) | Telemetrie automată JSON pentru notificarea autorităților BNR/EBA | CONFORM (Complet) |
| DORA (Reg. UE 2022/2554) | Art. 24: Testare avansată a rezilienței (TLPT) | Suită automatizată Red/Blue Team integrată în banking_attack_simulator | CONFORM (Complet) |
| PSD2 (Directiva UE 2015/2366) | Art. 97: Autentificare Strictă a Clienților (SCA) | Evaluare dinamică a riscului și impunere SCA la transferuri > 10.000 EUR | CONFORM (Complet) |
| PCI-DSS v4.0 | Cerința 1: Instalarea și menținerea controalelor firewall | Segmentare micro-VLAN (10, 20, 30) cu firewall stateful OPNsense | CONFORM (Complet) |
| PCI-DSS v4.0 | Cerința 3: Protecția datelor stocate ale titularilor de card | Mascarea strictă a PAN-ului (doar primele 6 și ultimele 4) și stergere CVV | CONFORM (Complet) |
| PCI-DSS v4.0 | Cerința 8: Identificarea utilizatorilor și autentificare | Acces administrativ restricționat pe Jump-Box cu chei Ed25519 + TOTP MFA | CONFORM (Complet) |
| ISO 20022 / SWIFT | Trasabilitate decontare interbancară | Generare mesaje XML pacs.008 cu identificatori unici RFC 4122 UETR | CONFORM (Complet) |

*Sursa: Matrice de conformitate elaborată pe baza testelor experimentale.*

---

# CONCLUZII

Lucrarea de licență de față a abordat o problemă de maximă actualitate și relevanță la intersecția dintre științele economice și ingineria sistemelor informatice: asigurarea rezilienței cibernetice a arhitecturilor bancare într-un context operațional dominat de digitalizare accelerată, sofisticarea atacurilor cibernetice și reglementări europene fără precedent. În cadrul acestei cercetări teoretice și aplicative, au fost atinse pe deplin toate obiectivele propuse în introducere, demonstrându-se fezabilitatea proiectării unui mediu financiar rezistent la intruziuni avansate prin aplicarea riguroasă a principiilor arhitecturale moderne de Apărare în Adâncime (Defense-in-Depth) și Zero Trust.

Investigația teoretică din primul capitol a evidențiat faptul că transformarea digitală a băncilor nu mai poate fi privită exclusiv prin prisma beneficiilor economice și a fluidizării tranzacțiilor. Deschiderea sistemelor prin Open Banking (PSD2) și dependențele complexe de infrastructură au creat noi vectori de atac pe care apărarea perimetrică clasică nu îi poate neutraliza. De aceea, noul Regulament European DORA (UE 2022/2554) marchează o tranziție istorică: reziliența operațională digitală nu mai este o opțiune recomandată, ci o obligație legală fermă, supusă unor regimuri sancționatorii pecuniare severe (amenzi de până la 5% din cifra de afaceri mondială a grupului bancar). De asemenea, s-a demonstrat că securitatea registrului contabil general (General Ledger) și a decontărilor interbancare (SWIFT / ISO 20022) depinde în mod critic de garantarea proprietăților ACID și a constrângerilor de integritate la nivel de bază de date.

Partea aplicativă a lucrării, detaliată în cel de-al doilea capitol, constituie contribuția originală substanțială a autorului și confirmă viabilitatea practică a conceptelor studiate. Printre principalele contribuții tehnico-științifice și elemente de noutate realizate în cadrul laboratorului virtual se numără:

1. **Proiectarea și implementarea unei infrastructuri bancare virtualizate complete:** Utilizând platforma enterprise de virtualizare Proxmox VE 9.2 bare-metal și firewall-ul stateful OPNsense, a fost realizată o segregare riguroasă a traficului în trei rețele locale virtuale (VLAN 10 Management, VLAN 20 Services, VLAN 30 CyberLab). Arhitectura aplică principiul Default-Deny, eliminând posibilitatea accesului direct neautorizat din exterior către nucleul financiar.
2. **Dezvoltarea unui motor de Core-Banking rezistent la alterare:** Sistemul dezvoltat (VM 310), inspirat de modelul Apache Fineract, implementează contabilitatea în partidă dublă conform ecuației fundamentale a echilibrului contabil și asigură înlănțuirea criptografică a fiecărei tranzacții prin dispersie SHA-256 tamper-evident. Orice tentativă de modificare retroactivă a soldurilor rupe lanțul de încredere, starea de corupere fiind detectată imediat.
3. **Conceperea unui algoritm autonom de auditare a integrității bazelor de date financiare:** Modulul `WazuhSecurityAuditor` dezvoltat pe serverul de baze de date PostgreSQL (VM 311) reprezintă o inovație defensivă esențială. Auditorul efectuează reconcilierea matematică automată între soldul stocat în tabela accounts și istoricul real al tranzacțiilor din ledger_transactions, detectând instantaneu anomaliile de tip Balance Tampering și emițând alerte de securitate Wazuh de nivel critic 14.
4. **Implementarea unei porți de plăți conforme PCI-DSS și PSD2:** Microserviciul de plăți (CT 312) integrează validarea matematică Luhn, mascarea strictă a numerelor de card (PAN), filtre de viteză împotriva atacurilor de tip Card Stuffing (cu răspuns prompt HTTP 429) și generarea de mesaje de decontare interbancară conforme schemei internaționale ISO 20022 pacs.008 cu trasabilitate universală prin identificatori UETR RFC 4122.
5. **Securizarea accesului administrativ printr-un Bastion Host (Jump-Box):** Nodul administrativ unic VM 313 elimină complet utilizarea parolelor statice în favoarea cheilor criptografice asimetrice pe curbe eliptice Ed25519, dublate de autentificare cu factori multipli (TOTP), blocând eficient tentativele de mișcare laterală și furt de credențiale.
6. **Dezvoltarea unei suite automatizate de testare ofensivă și defensivă:** Simulatorul dezvoltat (`banking_attack_simulator.py`) validează în mod automat 5 scenarii de atac mapate pe matricea MITRE ATT&CK for Financial Services, obținând o rată de succes de 100% în interceptarea și mitigarea amenințărilor.

Din punct de vedere economic și de gestiune a afacerilor, rezultatele obținute demonstrează că investițiile în soluții de securitate cibernetică de tip Defense-in-Depth generează o valoare adăugată măsurabilă pentru instituțiile de credit. Prin prevenirea eficientă a fraudelor de manipulare a soldurilor, a atacurilor de forță brută pe porțile de plăți și a compromiterii rețelelor interne, băncile elimină pierderile financiare directe, previn aplicarea unor amenzi de reglementare catastrofale pe linia DORA sau GDPR și își consolidează cel mai valoros activ intangibil: reputația și încrederea clienților.

Deși cercetarea a demonstrat o eficiență operațională ridicată, trebuie recunoscute anumite limite inerente mediului de laborator: comunicațiile interbancare SWIFT au fost validate prin scheme și protocoale standardizate ISO 20022, fără conectare directă la infrastructura privată SIPN de producție; de asemenea, operațiunile criptografice au fost executate la nivel software, fără utilizarea unui modul hardware dedicat de înaltă securitate (HSM fizic).

Ca direcții viitoare de cercetare și dezvoltare, autorul își propune:
- **Integrarea algoritmilor de Învățare Automată (Machine Learning):** Implementarea unor modele nesupervizate de detecție a anomaliilor (cum ar fi Isolation Forests sau Autoencodere neuronale) pentru analiza comportamentală a clienților și scorarea în timp real a riscului tranzacțional la nivel de microsecunde.
- **Tehnologii de Procesare Confidențială (Confidential Computing):** Explorarea enclavelor securizate bazate pe hardware (AMD SEV-SNP sau Intel SGX) pentru a menține memoria bazei de date financiare criptată chiar și în timpul procesării active în RAM, protejând datele împotriva oricărui acces neautorizat la nivelul hypervisorului.
- **Arhitecturi Cloud-Native și Service Mesh:** Migrarea microserviciilor pe clustere de containere Kubernetes orchestrate cu un Service Mesh (cum ar fi Istio), garantând criptarea mutuală mTLS între toate componentele și aplicarea politicilor de securitate la nivel de rețea definită prin software (SDN).

În concluzie, lucrarea de față confirmă faptul că reziliența cibernetică bancară nu reprezintă o stare statică atinsă prin achiziția unor produse comerciale scumpe, ci un proces dinamic, continuu și integrat, care combină rigoarea contabilă, proiectarea arhitecturală modulară și monitorizarea activă în timp real.

---

# BIBLIOGRAFIE

## I. Cărți, tratate și manuale de specialitate
1. Anderson, R. - *Security Engineering: A Guide to Building Dependable Distributed Systems*, 3rd Edition, Wiley Publishing, Indianapolis, 2020.
2. Date, C.J. - *An Introduction to Database Systems*, 8th Edition, Pearson Education, Boston, 2004.
3. Elmasri, R., Navathe, S.B. - *Fundamentals of Database Systems*, 7th Edition, Pearson, London, 2016.
4. Ferguson, N., Schneier, B., Kohno, T. - *Cryptography Engineering: Design Principles and Practical Applications*, Wiley Publishing, Indianapolis, 2010.
5. Garfinkel, S., Spafford, G., Schwartz, A. - *Practical UNIX and Internet Security*, 3rd Edition, O'Reilly Media, Sebastopol, 2003.
6. Kleppmann, M. - *Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems*, O'Reilly Media, Sebastopol, 2017.
7. Kurose, J.F., Ross, K.W. - *Computer Networking: A Top-Down Approach*, 8th Edition, Pearson Education, Boston, 2021.
8. Pacioli, L. - *Summa de arithmetica, geometria, proportioni et proportionalita* (Tratatul despre calculul și înregistrarea contabilă), Veneția, 1494.
9. Silberschatz, A., Galvin, P.B., Gagne, G. - *Operating System Concepts*, 10th Edition, Wiley, Hoboken, 2018.
10. Stallings, W. - *Cryptography and Network Security: Principles and Practice*, 8th Edition, Pearson Education, London, 2020.
11. Tanenbaum, A.S., Wetherall, D.J. - *Rețele de calculatoare*, Ediția a 5-a, Editura Byblos, București, 2012.

## II. Articole științifice și lucrări publicate în jurnale de profil
12. Arner, D.W., Barberis, J., Buckley, R.P. - *The Evolution of FinTech: A New Post-Crisis Paradigm?*, Georgetown Journal of International Law, Vol. 47, Nr. 4, 2016, pp. 1271-1319.
13. Böhme, R., Christin, N., Edelman, B., Moore, T. - *Bitcoin: Economics, Technology, and Governance*, Journal of Economic Perspectives, Vol. 29, Nr. 2, 2015, pp. 213-238.
14. Goodhart, C. - *The Regulatory Response to the Financial Crisis*, Edward Elgar Publishing, Cheltenham, 2011.
15. Luhn, H.P. - *Computer for Verifying Numbers*, United States Patent Office, U.S. Patent No. 2,950,048, Washington D.C., 1960.
16. Rose, C. - *Digital Resilience and Cyber Risk in European Banking: The Role of DORA*, Journal of Banking Regulation, Vol. 25, Nr. 1, 2024, pp. 45-62.
17. Zetzsche, D.A., Buckley, R.P., Arner, D.W. - *From FinTech to TechFin: The Regulatory Challenges of Data-Driven Finance*, New York University Journal of Law & Business, Vol. 14, 2018, pp. 393-446.

## III. Acte normative, reglementări europene și naționale
18. Parlamentul European și Consiliul Uniunii Europene - *Directiva (UE) 2015/2366 privind serviciile de plată în cadrul pieței interne (PSD2)*, Jurnalul Oficial al Uniunii Europene, L 337, 2015.
19. Comisia Europeană - *Regulamentul Delegat (UE) 2018/389 de completare a Directivei (UE) 2015/2366 în ceea ce privește standardele tehnice de reglementare pentru autentificarea strictă a clienților (EBA RTS)*, Jurnalul Oficial al UE, L 69, 2018.
20. Parlamentul European și Consiliul Uniunii Europene - *Regulamentul (UE) 2022/2554 privind reziliența operațională digitală a sectorului financiar (DORA)*, Jurnalul Oficial al Uniunii Europene, L 333, 2022.
21. Parlamentul European și Consiliul Uniunii Europene - *Regulamentul (UE) 2016/679 privind protecția persoanelor fizice în ceea ce privește prelucrarea datelor cu caracter personal (GDPR)*, Jurnalul Oficial al UE, L 119, 2016.
22. Banca Națională a României - *Regulamentul BNR nr. 4/2021 privind cerințele de supraveghere pentru sistemele de plăți și decontare*, Monitorul Oficial al României, Partea I, nr. 612, 2021.
23. Banca Națională a României - *Regulamentul BNR nr. 3/2018 privind monitorizarea infrastructurilor pieței financiare și a instrumentelor de plată*, Monitorul Oficial al României, 2018.

## IV. Standarde internaționale, rapoarte instituționale și documentație tehnică
24. European Banking Authority (EBA) - *Guidelines on ICT and Security Risk Management* (EBA/GL/2019/04), Paris, 2019.
25. European Union Agency for Cybersecurity (ENISA) - *ENISA Threat Landscape for the Financial Sector*, Atena, 2023.
26. International Organization for Standardization - *ISO 20022: Financial Services – Universal Financial Industry Message Scheme*, Geneva, 2022.
27. National Institute of Standards and Technology (NIST) - *Zero Trust Architecture*, NIST Special Publication 800-207, Gaithersburg, 2020.
28. PCI Security Standards Council - *Payment Card Industry Data Security Standard (PCI-DSS) Requirements and Testing Procedures*, Version 4.0, Wakefield, 2022.
29. SWIFT - *Customer Security Controls Framework (CSCF) v2024*, Society for Worldwide Interbank Financial Telecommunication, La Hulpe, 2024.
30. The MITRE Corporation - *MITRE ATT&CK Enterprise Matrix for Financial Services*, 2024, https://attack.mitre.org.
31. Apache Software Foundation - *Apache Fineract Technical Documentation: Open Source Core Banking System*, 2024, https://fineract.apache.org.
32. Proxmox Server Solutions GmbH - *Proxmox Virtual Environment 9.x Documentation and Architecture Guide*, Viena, 2024.
33. Wazuh Inc. - *Wazuh Enterprise SIEM & XDR Documentation: Host-based Intrusion Detection and Log Analysis*, San Jose, 2024.
34. Deciso B.V. - *OPNsense Stateful Security Firewall User & Engineering Manual*, Middelharnis, 2024.
35. Internet Engineering Task Force (IETF) - *RFC 6238: TOTP: Time-Based One-Time Password Algorithm*, 2011.

---

# ANEXE

## Anexa A: Schema SQL DDL a Bazei de Date Financiare și a Registrului Contabil

```sql
-- SCHEMA RELAȚIONALĂ FINANCIAR-BANCARĂ & GENERAL LEDGER (VM 311)
-- Implementare conform normelor ACID și integrității tranzacționale

CREATE TABLE IF NOT EXISTS clients (
    client_id VARCHAR(36) PRIMARY KEY,
    cnp_hash VARCHAR(64) UNIQUE NOT NULL,      -- Pseudonimizare GDPR prin SHA-256
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    risk_score INTEGER DEFAULT 1,              -- Scor KYC de la 1 la 5
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS accounts (
    account_id VARCHAR(34) PRIMARY KEY,        -- Standard internațional IBAN
    client_id VARCHAR(36) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    initial_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    account_type VARCHAR(20) DEFAULT 'CURRENT', -- CURRENT, SAVINGS, ESCROW
    is_frozen BOOLEAN NOT NULL DEFAULT FALSE,   -- Flag blocare automată antifraudă
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES clients (client_id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_balance_positive CHECK (balance >= 0.00)
);

CREATE TABLE IF NOT EXISTS ledger_transactions (
    tx_id VARCHAR(36) PRIMARY KEY,
    source_account_id VARCHAR(34) NOT NULL,
    destination_account_id VARCHAR(34) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    record_hash VARCHAR(64) NOT NULL,          -- Dispersie SHA-256 tamper-evident
    prev_hash VARCHAR(64) NOT NULL,            -- Hash-ul tranzacției anterioare
    status VARCHAR(20) NOT NULL DEFAULT 'COMMITTED',
    CONSTRAINT chk_amount_positive CHECK (amount > 0.00),
    CONSTRAINT fk_src_acc FOREIGN KEY (source_account_id) REFERENCES accounts (account_id),
    CONSTRAINT fk_dst_acc FOREIGN KEY (destination_account_id) REFERENCES accounts (account_id)
);

CREATE TABLE IF NOT EXISTS financial_audit_log (
    log_id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,           -- LOGIN, TRANSACTION, TAMPER_ALERT
    severity_level INTEGER NOT NULL,           -- De la 1 (Info) la 14 (Critic)
    details TEXT NOT NULL,
    source_ip VARCHAR(45) NOT NULL,
    user_identity VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ledger_src ON ledger_transactions (source_account_id);
CREATE INDEX idx_ledger_dst ON ledger_transactions (destination_account_id);
CREATE INDEX idx_audit_timestamp ON financial_audit_log (timestamp);
```

---

## Anexa B: Implementarea Motorului de Verificare a Integrității și Detecție a Manipulării Soldurilor

```python
class WazuhSecurityAuditor:
    """Auditor avansat de securitate integrat cu sistemul Wazuh SIEM."""
    
    def inspect_query_for_sqli(self, query: str, client_ip: str) -> bool:
        """Detectează semnăturile de atac prin injectare SQL (SQLi)."""
        patterns = [
            r"(--|#|/\*|;)",
            r"\bUNION\s+SELECT\b",
            r"\bOR\s+['\"]?1['\"]?\s*=\s*['\"]?1['\"]?",
            r"\bDROP\s+TABLE\b",
            r"\bUPDATE\s+.*\bSET\b.*\bbalance\b"
        ]
        for pattern in patterns:
            if re.search(pattern, query, re.IGNORECASE):
                self.emit_wazuh_alert(
                    rule_id=100102, level=8,
                    description=f"SQL Injection Signature Detected: {pattern}",
                    details=f"Query: {query} | Source IP: {client_ip}"
                )
                return True
        return False

    def verify_account_balance_integrity(self, account_id: str) -> Tuple[bool, float, float]:
        """Reconciliere matematică automată între soldul sintetic și registrul analitic."""
        with self.db.get_cursor() as cur:
            cur.execute("SELECT balance, initial_balance FROM accounts WHERE account_id = ?", (account_id,))
            res = cur.fetchone()
            if not res:
                return False, 0.0, 0.0
            stored_balance, initial_balance = res
            
            cur.execute("SELECT COALESCE(SUM(amount), 0) FROM ledger_transactions WHERE dst = ?", (account_id,))
            total_credits = cur.fetchone()[0]
            cur.execute("SELECT COALESCE(SUM(amount), 0) FROM ledger_transactions WHERE src = ?", (account_id,))
            total_debits = cur.fetchone()[0]
            
            computed_balance = initial_balance + total_credits - total_debits
            discrepancy = stored_balance - computed_balance
            
            if abs(discrepancy) > 0.001:
                self.emit_wazuh_alert(
                    rule_id=100109, level=14,
                    description="CRITICAL: Balance Tampering Discrepancy Detected!",
                    details=(f"Account: {account_id} | Stored Balance: {stored_balance:.2f} | "
                             f"Computed Balance: {computed_balance:.2f} | Discrepancy: {discrepancy:.2f}")
                )
                cur.execute("UPDATE accounts SET is_frozen = TRUE WHERE account_id = ?", (account_id,))
                return False, stored_balance, computed_balance
            return True, stored_balance, computed_balance
```

---

## Anexa C: Jurnalul Telemetric de Securitate și Structura Alertelor Wazuh JSON

```json
{
  "timestamp": "2026-09-20T19:15:32.418Z",
  "rule": {
    "id": "100109",
    "level": 14,
    "description": "CRITICAL: Balance Tampering Detected via Discrepancy Audit",
    "mitre": {
      "id": ["T1565.001"],
      "tactic": ["Impact", "Data Manipulation"],
      "technique": ["Stored Data Manipulation"]
    },
    "compliance": {
      "dora": ["Article 9.2", "Article 11"],
      "pci_dss": ["Requirement 10.2.1"],
      "gdpr": ["Article 32"]
    }
  },
  "agent": {
    "id": "002",
    "name": "fin-db-licenta",
    "ip": "192.168.20.51"
  },
  "data": {
    "financial": {
      "account_id": "RO03BTRL0000000000000001",
      "stored_balance": 5000000.00,
      "computed_ledger_balance": 15000.00,
      "discrepancy_amount": 4985000.00,
      "currency": "EUR",
      "action_taken": "ACCOUNT_AUTOMATICALLY_FROZEN",
      "escalation": "IMMEDIATE_SOC_PAGER_DUTY"
    }
  },
  "location": "/var/log/financial_db/audit.log"
}
```
