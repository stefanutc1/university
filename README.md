# Academic Software Projects & Bachelor's Thesis

<div align="center">

[![CI Quality Gate](https://github.com/stefanutc1/proiecte/actions/workflows/ci.yml/badge.svg)](https://github.com/stefanutc1/proiecte/actions/workflows/ci.yml)
[![DevSecOps & Security](https://github.com/stefanutc1/proiecte/actions/workflows/security.yml/badge.svg)](https://github.com/stefanutc1/proiecte/actions/workflows/security.yml)
[![LaTeX Thesis PDF](https://github.com/stefanutc1/proiecte/actions/workflows/latex.yml/badge.svg)](https://github.com/stefanutc1/proiecte/actions/workflows/latex.yml)
[![Live Banking Kiosk](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=flat&logo=github)](https://stefanutc1.github.io/proiecte/)
[![Institution](https://img.shields.io/badge/Institution-Universitatea%20din%20Craiova%20%7C%20FEAA-blue?style=flat)](http://feaa.ucv.ro)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](licenta/LL3-LucrareLicenta/LICENSE)

</div>

---

## 1. Executive Overview

Acest repository găzduiește proiectele academice din cadrul studiilor de licență la **Facultatea de Economie și Administrarea Afacerilor (FEAA)**, **Universitatea din Craiova**, specializarea **Informatică Economică (Promoția 2026)**, inclusiv proiectul de diplomă:

> **„Arhitectura și Securitatea Sistemelor Informatice Bancare: Proiectarea, Implementarea și Auditul Rezilienței Cibernetice într-un Mediu Virtualizat”**  
> **Autor:** Moanță Ștefănuț-Cornel ([@stefanutc1](https://github.com/stefanutc1))  
> **Specializare:** Informatică Economică  

Repository-ul este structurat curat, conținând proiectele de licență în directorul [`licenta/`](licenta/) și automatizările de testare și securitate în [`.github/workflows/`](.github/workflows/).

---

## 2. Structura Proiectelor Academice (`licenta/`)

| Proiect / Director | Disciplină / Scop Academic | Tehnologii & Limbaje | Testare & Validare | Status CI |
| :--- | :--- | :--- | :--- | :---: |
| [`licenta/LL3-LucrareLicenta`](licenta/LL3-LucrareLicenta/) | **Lucrare de Licență (Flagship)** | Java 17 (Spring Boot 3.2), Python 3.11, Vanilla JS, Docker, LaTeX | JUnit 5, Pytest, 5 Scenarii MITRE ATT&CK | **PASS** |
| [`licenta/PS2-Practica`](licenta/PS2-Practica/) | Practică de Specialitate (Anul 2) | Next.js 15, React 19, TypeScript, Tailwind CSS | Lint & Typecheck static | **PASS** |
| [`licenta/PELL3-Practica`](licenta/PELL3-Practica/) | Practică de Specialitate (Anul 3) | Jurnal și Raport de Practică | Documentație Markdown | **PASS** |
| [`licenta/POO2-Proiect`](licenta/POO2-Proiect/) | Programare Orientată pe Obiecte | C++ / Microsoft Foundation Classes (MFC) | Aplicație gestiune vânzări | **Gata** |
| [`licenta/POO2-Platforme`](licenta/POO2-Platforme/) | Platforme Laborator POO | C++ / MFC (Win32 API) | Laboratoare 2–9MDI | **Gata** |
| [`licenta/BD2-Proiect`](licenta/BD2-Proiect/) | Baze de Date Relaționale | MySQL 8.0, SQL DDL/DML, Model E-R | Model relațional MWB & scripturi SQL | **Gata** |
| [`licenta/SD2-Proiect`](licenta/SD2-Proiect/) | Structuri de Date | C++ (Arbori Binari de Căutare, Liste) | Algoritmi & operații pe date | **Gata** |
| [`licenta/SD2-Teme`](licenta/SD2-Teme/) | Teme Laborator SD | C++ | Soluții algoritmice | **Gata** |
| [`licenta/RC2-Proiect`](licenta/RC2-Proiect/) | Rețele de Calculatoare | Cisco Packet Tracer (`.pkt`, `.pkz`) | Topologii VLAN, rutare, securitate | **Gata** |
| [`licenta/PC1-Platforme`](licenta/PC1-Platforme/) | Programarea Calculatoarelor | C#, Visual Basic, .NET WinForms | Aplicații desktop laborator | **Gata** |
| [`licenta/PW3-Platforma`](licenta/PW3-Platforma/) | Programare Web (Anul 3) | HTML, CSS, JavaScript | Laboratoare web | **WIP** |
| [`licenta/APSI3-Platforma`](licenta/APSI3-Platforma/) | Analiza și Proiectarea Sistemelor Info | Modelare UML / Arhitectură | Diagrame & specificații | **WIP** |
| [`licenta/GBD3-Platforma`](licenta/GBD3-Platforma/) | Gestiunea Bazelor de Date | SQL / Administrare Baze de Date | Proceduri stocate & gestiune | **WIP** |

---

## 3. Automatizare CI/CD & DevSecOps (`.github/workflows/`)

Pipelines de GitHub Actions utilizează filtre de cale (`paths-filter`) pentru a optimiza timpii de rulare și consumul de resurse:

* **[Continuous Integration (`ci.yml`)](.github/workflows/ci.yml)**:
  * **Python 3.11:** Compilare bytecode, suita Pytest, 5 scenarii de atac & apărare bancară conform MITRE ATT&CK.
  * **Java 17 / Maven:** Compilare Spring Boot 3.2, suita de teste JUnit 5, smoke test la pornire.
  * **Web Kiosk:** Validare integritate asset-uri statice HTML5/CSS3/Vanilla JS.
  * **Next.js 15:** Build și validare aplicație `licenta/PS2-Practica/proiect`.
  * **Docker:** Verificare `Dockerfile` cu cache avansat GitHub Actions.
* **[DevSecOps & Scanare Vulnerabilități (`security.yml`)](.github/workflows/security.yml)**:
  * **Gitleaks v2 & TruffleHog:** Scanare automată pentru detectarea scurgerilor de secrete și chei API.
  * **pip-audit & npm audit:** Scanare a dependențelor împotriva bazelor de date CVE cunoscute.
  * **Bandit:** Analiză statică SAST pentru codul Python.
  * **Aqua Trivy:** Scanare a sistemului de fișiere și a containerului Docker.
* **[Compilare Teză LaTeX (`latex.yml`)](.github/workflows/latex.yml)**:
  * Compilare automată `main.tex` utilizând TeXLive și `latexmk`.
  * Generare și arhivare ca artifact descărcabil a PDF-ului complet al lucrării de licență (`LUCRARE_LICENTA_2026.pdf`).
* **[Deploy GitHub Pages (`deploy-gh-pages.yml`)](.github/workflows/deploy-gh-pages.yml)**:
  * Publicare automată a terminalului bancar interactiv (kiosk) pe GitHub Pages.

---

## 4. Rulare Locală (Lucrare de Licență)

### 4.1. Simulator Atac & Apărare Cibernetică Bancară
```bash
cd licenta/LL3-LucrareLicenta/code
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 banking_attack_simulator.py
```

### 4.2. Backend Core-Banking Spring Boot
```bash
cd licenta/LL3-LucrareLicenta/code/web/backend
mvn clean test
mvn spring-boot:run
```

### 4.3. Terminal Web Kiosk
Interfața kiosk poate fi rulată direct în browser deschizând `licenta/LL3-LucrareLicenta/code/web/index.html` sau prin demo-ul live pe GitHub Pages:
**[https://stefanutc1.github.io/proiecte/](https://stefanutc1.github.io/proiecte/)**

---

## 5. Citare Academică

```bibtex
@misc{moanta2026licenta,
  author       = {Moanță, Ștefănuț-Cornel},
  title        = {Arhitectura și Securitatea Sistemelor Informatice Bancare: Proiectarea, Implementarea și Auditul Rezilienței Cibernetice într-un Mediu Virtualizat},
  school       = {Universitatea din Craiova, Facultatea de Economie și Administrarea Afacerilor},
  year         = {2026},
  type         = {Lucrare de Licență},
  address      = {Craiova, România}
}
```

---

## 6. Licență

Acest repository este distribuit sub licența **MIT**. Consultați [LICENSE](licenta/LL3-LucrareLicenta/LICENSE) pentru detalii.
