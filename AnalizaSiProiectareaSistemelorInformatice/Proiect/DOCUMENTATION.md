# Documentatie Proiect: Analiza si Proiectarea Sistemelor Informatice (APSIIE)

## S.C. ELOQUENCE HOSTING S.R.L.

---

## 1. Alegerea si prezentarea activitatii pe care doriti s-o informatizati

### 1.1. Alegerea si prezentarea generala a unei firme

* **Obiect de activitate:** Furnizarea de servicii de gazduire web (web hosting), inchiriere de servere virtuale private (VPS), servicii de colocation si solutii de infrastructură cloud pentru companii, agentii de dezvoltare si utilizatori finali.
* **Istoric:** Societatea este conceputa ca un furnizor modern de servicii de infrastructură IT, avand ca scop principal oferirea de performanta nativa, stabilitate ridicata si suport tehnic specializat in limba romana.
* **Organigrama:**
* Conducere (Administrator / Director General)
* Departamentul Tehnic si Infrastructura
* Departamentul Relații Clienti si Suport Tehnologic
* Departamentul Financiar-Contabil si Vânzări


* **Prezentarea departamentelor si atribuțiile acestora:**
* *Conducerea:* Stabileste directia strategica, politica de preturi, investitiile in echipamente hardware si parteneriatele de tip upstream pentru conectivitate.
* *Departamentul Tehnic:* Asigura mentenanta clusterelor de servere, monitorizarea parametrilor de functionare (uptime), securitatea retelei si interventiile in caz de incidente hardware sau software.
* *Departamentul Relații Clienti:* Ofera asistenta tehnica primara si secundara (L1/L2) pentru configurarea domeniilor, migrarea site-urilor si depanarea problemelor legate de serviciile active.
* *Departamentul Financiar-Contabil:* Gestioneaza emiterea facturilor, urmarirea incasarilor, relatia cu procesatorii de plati si evidenta contabila primara.


* **Prezentarea detaliata a departamentului care realizează activitatea alese pentru optimizare:**
* *Departamentul de Vânzări si Automatizare Infrastructură (Platforma Web de Comenzi si Facturare):* Acest departament gestioneaza fluxul prin care clientii plaseaza comenzi pentru pachetele de hosting sau servere virtuale. Activitatea aleasa pentru informatizare este procesul de achizitie, validare a platii online si provisioning (alocare automata a resurselor pe servere), eliminand interventia manuala a operatorului si reducand timpul de activare a serviciului de la ore la cateva secunde.


* **Produse:** Pachete de gazduire web NVMe, servere virtuale dedicate (VPS), certificate SSL, inregistrare si mentenanta domenii internet.
* **Personal:** 4 angajati initiali (1 Administrator, 2 Ingineri de Sisteme / DevOps, 1 Specialist Relatii Clienti / Vanzari).
* **Clienti:** Dezvoltatori web independenti, IMM-uri care au nevoie de o prezenta online stabila, agentii de marketing digital si studenti/pasionati de tehnologie.
* **Furnizori:** Producatori de echipamente hardware pentru servere (componente rackabile, stocare NVMe), furnizori de tranzit internet de mare viteza (Upstream BGP carriers) si furnizori de licente software pentru panouri de control si virtualizare.
* **Indicatori economico-financiari:** Cifra de afaceri estimata bazata pe abonamente recurente (model SaaS/Hosting), marja de profit brut din vanzarea pachetelor de servere, costuri operationale pentru mentenanta datacentre-lor si amortizarea echipamentelor.
* **Sistemul informatic utilizat:** Solutii preliminare bazate pe platforme proprietare dezvoltate intern pentru gestiunea pachetelor de hosting, complet integrate cu API-uri de plati si sisteme de virtualizare.

### 1.2. Analiza SWOT

* **Puncte tari (Strengths):**
* Arhitectura software construita de la zero, fara dependente de sisteme legacy invechite.
* Integrare nativa cu procesatori de plati locali (Netopia Payments) pentru o procesare rapida si sigura.
* Flexibilitate ridicata in personalizarea pachetelor tehnice pentru clienti avansati.


* **Puncte slabe (Weaknesses):**
* Lipsa unui istoric de brand pe piata la momentul lansarii.
* Resursa umana initiala restransa pentru suport tehnic permanent 24/7 in primele faze.


* **Oportunitati (Opportunities):**
* Cererea in crestere pentru solutii de cloud si gazduire locala in Romania cu latenta redusa.
* Orientarea clientilor catre furnizori locali care ofera suport tehnic rapid si competent.


* **Amenințări (Threats):**
* Competitia acerba din partea marilor furnizori internationali de cloud.
* Fluctuatiile costurilor la utilitati si echipamente hardware.



### 1.3. Descrierea fluxului informational al activitatii alese

Fluxul informational aferent procesului de comanda si activare a unui serviciu de gazduire cuprinde urmatorii pasilor logici:

1. **Initierea comenzii:** Clientul acceseaza platforma online, selecteaza pachetul dorit de gazduire web sau server virtual si introduce datele de identificare sifacturare.
2. **Generarea platii:** Sistemul informatic calculeaza valoarea totala, genereaza o proforma in baza de date si redirectioneaza utilizatorul catre procesatorul de plati selectat (Netopia Payments).
3. **Procesarea tranzactiei:** Utilizatorul efectueaza plata cu cardul bancar in mediu securizat. Procesatorul de plati transmite un semnal asincron (webhook/IPN) catre serverul aplicatiei noastre.
4. **Confirmarea si Activarea:** Modulul de backend receptioneaza confirmarea platii, actualizeaza statusul comenzii in baza de date, genereaza factura fiscala finala si apeleaza automat API-ul de infrastructură pentru a crea serviciul (crearea contului de gazduire sau a masinii virtuale).
5. **Notificarea clientului:** Sistemul trimite automat un e-mail catre client continand datele de acces si documentele fiscale aferente.

---

## 2. Proiectarea logica

### 2.1. Proiectarea formularelor/rapoartelor

* **Formularul de Autentificare / Inregistrare Client:** Permite colectarea datelor de contact si de facturare (Nume, Companie, CUI, Adresa, Email, Parola).
* **Formularul de Configurare si Comanda (Cart/Checkout):** Permite selectarea tipului de serviciu, a perioadei de valabilitate (lunar/anual) si introducerea datelor necesare platii online.
* **Raportul de Vanzari si Incasari:** Generat pentru departamentul financiar, centralizeaza totalul tranzactiilor confirmate intr-o anumita perioada, defalcate pe tipuri de servicii si metode de plata.
* **Raportul de Stare a Serviciilor Active:** Panou de control intern care afiseaza clientii activi, pachetele alocate, resursele utilizate si data la care expira abonamentul.

### 2.2. Proiectarea bazei informationale

Baza informationala a sistemului gestioneaza urmatoarele entitati principale si fluxuri de date:

* **Nomenclatorul de Produse / Pachete:** Stocheaza caracteristicile tehnice (spatiu stocare NVMe, RAM, nuclee CPU, trafic maxim inclus) si preturile aferente.
* **Registrul Clientilor:** Centralizeaza informatiile despre utilizatorii inregistrati si istoricul lor fiscal.
* **Registrul Comenzilor si Tranzactiilor:** Pastreaza legatura intre comanda plasata, statusul acesteia (in asteptare, platita, anulata) si raspunsul primit de la procesatorul de plati.
* **Registrul Serviciilor Provisionate:** Contine datele tehnice asociate serviciului activat pentru fiecare client in parte (IP-uri alocate, credentiale de acces, status server).

### 2.3. Proiectarea bazei de date

Baza de date relationala este structurata pe tabele interconectate pentru a asigura integritatea si flexibilitatea datelor:

* **Tabela `users`:**
* `id` (INT, Primary Key)
* `name` (VARCHAR)
* `email` (VARCHAR, Unique)
* `password_hash` (VARCHAR)
* `billing_details` (JSON / Text)
* `created_at` (TIMESTAMP)


* **Tabela `products`:**
* `id` (INT, Primary Key)
* `title` (VARCHAR)
* `category` (VARCHAR) - ex: web_hosting, vps
* `specs` (JSON) - stocheaza atributele tehnice flexibile (CPU, RAM, Storage)
* `price` (DECIMAL)
* `stock_status` (INT)


* **Tabela `orders`:**
* `id` (INT, Primary Key)
* `user_id` (INT, Foreign Key -> users.id)
* `total_amount` (DECIMAL)
* `status` (VARCHAR) - pending, paid, cancelled
* `netopia_order_id` (VARCHAR)
* `created_at` (TIMESTAMP)


* **Tabela `order_items`:**
* `id` (INT, Primary Key)
* `order_id` (INT, Foreign Key -> orders.id)
* `product_id` (INT, Foreign Key -> products.id)
* `price` (DECIMAL)


* **Tabela `active_services`:**
* `id` (INT, Primary Key)
* `user_id` (INT, Foreign Key -> users.id)
* `order_id` (INT, Foreign Key -> orders.id)
* `service_details` (JSON) - detalii de acces si configurare
* `expires_at` (TIMESTAMP)



---

## 3. Proiectarea fizica – alegerea unui limbaj de programare si realizarea aplicatiei

### 3.1. Alegerea tehnologiilor

* **Frontend:** Angular 20
* **Backend:** Node.js/Python, asigura rutele API RESTful pentru gestionarea produselor, a sesiunilor si a cosului de cumparaturi.
* **Sistem de Gestiune a Bazelor de Date:** Baza de date relationala (PostgreSQL sau MySQL) pentru stocarea sigura a tranzactiilor si a datelor utilizatorilor.
* **Procesatorul de Plati:** Integrare directa cu gateway-ul **Netopia Payments**, utilizand atat fluxul de redirectionare pentru initializarea platii, cat si un endpoint dedicat de tip **IPN (Instant Payment Notification / Webhook)** pentru actualizarea automata in timp real a statusului comenzilor in baza de date.
