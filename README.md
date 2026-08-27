<div align="center">

# Portofoliu Universitar · Proiecte & Laboratoare

**Structuri de Date · Algoritmi · Programare Orientată pe Obiecte · Baze de Date · Rețele · FinTech Cross-Platform · Lucrare de Licență**

Repository centralizat ce conține proiectele academice, temele, laboratoarele practice și lucrarea de licență dezvoltate pe parcursul celor 3 ani de studii universitare.

[![License](https://img.shields.io/badge/License-MIT-1D3557?style=flat-square)](LICENSE)
[![Author](https://img.shields.io/badge/Author-stefanutc1-blue?style=flat-square)](https://github.com/stefanutc1)
[![Platform](https://img.shields.io/badge/Platforms-Web_%7C_Desktop_%7C_Mobile-green?style=flat-square)](#)
[![Stack](https://img.shields.io/badge/Languages-C%23_%7C_C%2B%2B_%7C_TypeScript_%7C_SQL_%7C_F%23-orange?style=flat-square)](#)

</div>

---

## 📂 Index Detaliat al Proiectelor

```text
facultate/
├── PC1-Platforme/          # Anul I: Platforme Computaționale & Aplicații C# .NET Windows Forms
├── SD2-Teme/               # Anul II: Structuri de Date & Algoritmi (Probleme 1-6 C++)
├── SD2-Proiect/            # Anul II: Proiect Liste Înlanțuite, Arbori Binari & Persistență Fișiere
├── POO2-Proiect/           # Anul II: Programare Orientată pe Obiecte - Gestiune Vânzări MFC C++
├── RC2-Proiect/            # Anul II: Rețele de Calculatoare - Topologie Cisco Packet Tracer
├── PS2-Practica/           # Anul II: Jurnal Practică de Specialitate (15 Zile de Activitate)
├── BD2-Proiect/            # Anul II: Baze de Date - Sistem de Gestiune Academică MySQL (.sql, .mwb)
├── DAM3-Proiect/           # Anul III: Dezvoltarea Aplicațiilor Mobile & Monorepo FinTech
└── LL3-LucrareLicenta/     # Anul III: Arhitectură, Specificații & Ghid Licență
```

---

## 🔬 Descrierea Academică a Modulelor

### 1. 📱 `DAM3-Proiect` — Platformă FinTech Monorepo (Dezvoltarea Aplicațiilor Mobile)
Proiect complex de anul III ce integrează o arhitectură monorepo modernă (Turborepo) cu clienți multipli:
* **Mobile Client (`apps/mobile`)**: Aplicație React Native / Expo cu navigare fluidă, biometrie, grafice interactive și feed-uri în timp real.
* **Web Client (`apps/web`)**: Portal Next.js 14 cu Server Components, Tailwind CSS, suport complet GitHub Pages (`npx next build` static export) și dashboard financiar.
* **Desktop Client (`apps/desktop`)**: Aplicație nativă C# .NET 8 dezvoltată pe framework-ul cross-platform **Avalonia UI**.
* **Quant Engine (`packages/quant-engine`)**: Motor matematic de analiză cantitativă scris în F# și C++ cu rutine optimizate SIMD (x86_64 Assembly / AVX2).
* **Backend & DevOps**: API securizat JWT, WebSocket feed-uri date piață, containerizare Docker multi-stage și pipeline CI/CD Turbo.

---

### 2. 🗄️ `BD2-Proiect` — Baze de Date Relaționale (MySQL)
Sistem complet de gestiune a activității academice universitare:
* **Modelare Relațională**: Diagramă E-R completă concepută în MySQL Workbench (`diagrama.mwb`), respectând Formele Normale 1NF–3NF.
* **Scripturi SQL (`Sistem de Gestiune al activitatii academice.sql`)**: Creare tabele relaționale cu chei primare și străine (ON DELETE CASCADE, ON UPDATE CASCADE), indecși compuși și constrângeri.
* **Proceduri Stocate & Triggeri**: Automatizare calcul medii, validare credite ECTS și auditare tranzacțională a înscrierilor.

---

### 3. 🌐 `RC2-Proiect` — Rețele de Calculatoare (Cisco Packet Tracer)
Infrastructură ierarhică de rețea enterprise simulată în Cisco Packet Tracer (`.pkt`, `.pkz`):
* **Segmentare VLAN & Trunking (802.1Q)**: Izolarea departamentelor (Studenți, Profesori, Administrație, Server Farm).
* **Rutare Dinamică OSPF & Inter-VLAN Routing**: Configurare Router-on-a-Stick și protocoale de rutare pe routere Cisco 2911.
* **Servicii de Rețea & Securitate**: DHCP Pools, DNS intern, Web Server, Port Security și Access Control Lists (ACL-uri standard & extinse).

---

### 4. 🖥️ `POO2-Proiect` — Programare Orientată pe Obiecte (C++ / MFC GUI)
Aplicație de gestiune a vânzărilor și gestiunii stocurilor cu interfață grafică Microsoft Foundation Classes (MFC):
* **Principii POO**: Încapsulare, moștenire, polimorfism, clase abstracte și supraîncărcare de operatori (`<<`, `>>`, `+`, `==`).
* **Interfață Utilizator**: Ferestre de dialog MFC, tabele dinamice CListCtrl, formulare de introducere date și validare de câmpuri.
* **Persistență**: Serializare și salvare binară / text a comenzilor și bazei de date cu produse.

---

### 5. 🌲 `SD2-Proiect` & `SD2-Teme` — Structuri de Date & Algoritmi (C++)
Implementări de la zero ale structurilor fundamentale și algoritmilor de căutare:
* **Structuri Implementate**: Liste simplu și dublu înlănțuite, stive, cozi, arbori binari de căutare (BST) și arbori echilibrați.
* **Algoritmi & Complexitate**: Sortări avansate (QuickSort, MergeSort, HeapSort), Căutare Binară, tehnici Divide et Impera și parcurgeri în lățime (BFS) / adâncime (DFS).
* **Persistență & Benchmark**: Operațiuni I/O optimizate cu fișiere și măsurători de timp de execuție.

---

### 6. 📝 `PS2-Practica` — Practică de Specialitate
Jurnal cronologic complet al stagiului de practică software (15 rapoarte zilnice detaliate, 11 mai – 29 mai):
* Analiză cerințe, specificații funcționale, design de arhitectură, prototipare GUI și integrare unit tests.

---

### 7. 💻 `PC1-Platforme` — Platforme Computaționale (C# .NET)
Suite completă de aplicații desktop Windows Forms:
* Controale avansate, formulare MDI, desenare grafică GDI+ (grafice statistice, diagrame), gestiune fișiere și evenimente delegate.

---

## 🛠️ Tehnologii & Limbaje Utilizate

| Categorie | Tehnologii |
| :--- | :--- |
| **Limbaje** | C#, C++, TypeScript, JavaScript, F#, SQL, x86_64 Assembly |
| **Framework-uri** | React Native, Expo, Next.js 14, Avalonia UI, Microsoft Foundation Classes (MFC), Windows Forms (.NET 8) |
| **Baze de Date** | MySQL, SQLite, IndexedDB |
| **Networking** | Cisco Packet Tracer, OSPF, VLANs, ACLs, Wireshark |
| **DevOps & Tooling** | Docker, Docker Compose, Turborepo, GitHub Actions, Visual Studio 2022 |

---

## ⚖️ Licență
Proiectele sunt publicate în scop didactic și portofoliu academic sub licența **MIT**.

Autor: [**@stefanutc1**](https://github.com/stefanutc1)
