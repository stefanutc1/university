# Academic Software Projects Master Catalog

<div align="center">

[![Catalog Status](https://img.shields.io/badge/Catalog-Audited%20%26%20Synchronized-brightgreen?style=flat)](README.md)
[![Total Projects](https://img.shields.io/badge/Projects-14%20Cataloged-blue?style=flat)](PROJECTS.md)
[![Flagship](https://img.shields.io/badge/Flagship-LL3%20Banking%20Security-orange?style=flat)](licenta/LL3-LucrareLicenta/)
[![Institution](https://img.shields.io/badge/FEAA-Universitatea%20din%20Craiova-blue?style=flat)](http://feaa.ucv.ro)

</div>

---

## 1. Master Projects Index

This document provides a truthful, comprehensive catalog of all academic and software engineering projects housed within `Projects-FEAA-UCV/proiecte`. In compliance with repository standards, only detected technologies, tests, and configurations are listed. Missing or non-existent components are explicitly denoted as `None detected`, `Not documented`, or `N/A`.

| Name | Directory | Type | Year | Domain | Languages | Frameworks | Build System | Tests | CI | Security | Deployment | Status |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- | :---: |
| **LL3-LucrareLicenta** | [`licenta/LL3-LucrareLicenta`](licenta/LL3-LucrareLicenta/) | Bachelor's Thesis | An 3 | Cybersecurity & Banking | Java, Python, JavaScript, LaTeX | Spring Boot 3.2, FastAPI, JJWT | Maven, pip, latexmk, Docker | JUnit 5, Pytest, MITRE Suite | **PASS** | **PASS** | GitHub Pages & Docker | Production / Flagship |
| **PS2-Practica** | [`licenta/PS2-Practica`](licenta/PS2-Practica/) | Practical Training | An 2 | Web & Weather Telemetry | TypeScript, JavaScript, CSS | Next.js 15, React 19, Tailwind CSS | npm | Lint & Typecheck | **PASS** | **PASS** | Local / Web | Completed |
| **PELL3-Practica** | [`licenta/PELL3-Practica`](licenta/PELL3-Practica/) | Practical Training | An 3 | Economic Informatics Practice | Markdown | None | None | None | **PASS** | **N/A** | None | Completed |
| **POO2-Proiect** | [`licenta/POO2-Proiect`](licenta/POO2-Proiect/) | Course Project | An 2 | Object-Oriented Programming | C++ | Microsoft Foundation Classes (MFC) | MSBuild (Visual Studio) | None detected | **N/A** | **N/A** | Desktop Win32 | Completed |
| **POO2-Platforme** | [`licenta/POO2-Platforme`](licenta/POO2-Platforme/) | Lab Platforms | An 2 | GUI & Event-Driven Systems | C++ | MFC, Windows API | MSBuild (Visual Studio) | None detected | **N/A** | **N/A** | Desktop Win32 | Completed |
| **BD2-Proiect** | [`licenta/BD2-Proiect`](licenta/BD2-Proiect/) | Course Project | An 2 | Relational Database Systems | SQL | MySQL Workbench Model | MySQL Server | None detected | **N/A** | **N/A** | Relational DB | Completed |
| **SD2-Proiect** | [`licenta/SD2-Proiect`](licenta/SD2-Proiect/) | Course Project | An 2 | Data Structures & Algorithms | C++ | C++ Standard Library | g++ / MSVC | None detected | **N/A** | **N/A** | CLI Executable | Completed |
| **SD2-Teme** | [`licenta/SD2-Teme`](licenta/SD2-Teme/) | Algorithmic Problem Solving | An 2 | Algorithms & Optimization | C++ | C++ Standard Library | g++ / MSVC | None detected | **N/A** | **N/A** | CLI Executable | Completed |
| **RC2-Proiect** | [`licenta/RC2-Proiect`](licenta/RC2-Proiect/) | Course Project | An 2 | Computer Networking | None (Network Topology) | Cisco Packet Tracer | Cisco Packet Tracer | Topology Verification | **PASS** | **N/A** | Virtualized Topology | Completed |
| **PC1-Platforme** | [`licenta/PC1-Platforme`](licenta/PC1-Platforme/) | Lab Platforms | An 1 | Computer Programming | C#, Visual Basic | .NET Windows Forms | MSBuild (Visual Studio) | None detected | **N/A** | **N/A** | Desktop Windows | Completed |
| **PW3-Platforma** | [`licenta/PW3-Platforma`](licenta/PW3-Platforma/) | Lab Platform | An 3 | Web Programming | Web Technologies | Planned | Planned | None | **WIP** | **WIP** | None | In Progress |
| **APSI3-Platforma** | [`licenta/APSI3-Platforma`](licenta/APSI3-Platforma/) | Lab Platform | An 3 | Systems Analysis & Design | Enterprise Architecture | Planned | Planned | None | **WIP** | **WIP** | None | In Progress |
| **GBD3-Platforma** | [`licenta/GBD3-Platforma`](licenta/GBD3-Platforma/) | Lab Platform | An 3 | Database Management | SQL / Administration | Planned | Planned | None | **WIP** | **WIP** | None | In Progress |
| **master** | [`master`](master/) | Graduate Research | Master | Economic Information Systems | Planned | Planned | Planned | None | **WIP** | **WIP** | None | Planned |

---

## 2. Granular Project Profiles

### 2.1. LL3-LucrareLicenta (Bachelor's Thesis Flagship)

* **Directory:** `licenta/LL3-LucrareLicenta/`
* **Type:** Bachelor's Thesis (`bachelor-thesis`)
* **Academic Year:** Anul 3 (2025–2026)
* **Domain:** Cybersecurity, Banking Infrastructure, DevSecOps, SIEM
* **Languages:** Java 17 LTS, Python 3.11, JavaScript (ES6+), HTML5, CSS3, LaTeX
* **Frameworks:** Spring Boot 3.2, Spring Security, JJWT 0.12, FastAPI 0.109, Pydantic 2.5
* **Build System:** Maven 3.9+, pip, Docker Buildx, `latexmk` (TeXLive)
* **Tests:**
  * JUnit 5 & Spring Boot Test (`AccountServiceTest`, `BankApplicationTests`)
  * Pytest (`test_banking_suite.py`)
  * Banking Attack & Defense Simulator (`banking_attack_simulator.py` — 5 MITRE ATT&CK scenarios)
  * Live Spring Boot REST Integration Smoke Test (`smoke_test_backend.py`)
* **CI Pipeline:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
* **Security Scanning:** [`.github/workflows/security.yml`](.github/workflows/security.yml) (Gitleaks, TruffleHog, Bandit SAST, Aqua Trivy, pip-audit, CycloneDX SBOM)
* **Documentation:**
  * Root Thesis Documentation: [`licenta/LL3-LucrareLicenta/README.md`](licenta/LL3-LucrareLicenta/README.md)
  * Code & Simulator Documentation: [`licenta/LL3-LucrareLicenta/code/README.md`](licenta/LL3-LucrareLicenta/code/README.md)
  * Web Kiosk Documentation: [`licenta/LL3-LucrareLicenta/code/web/README.md`](licenta/LL3-LucrareLicenta/code/web/README.md)
  * Original Word Documents: `LUCRARE LICENTA - 31.08.2026.docx`, `LUCRARE LICENTA - 22.09.2026.docx`
  * Modular LaTeX Source: `licenta/LL3-LucrareLicenta/latex/main.tex`
* **Deployment:**
  * GitHub Pages: Static Web Banking Kiosk with dual-mode mock fallback ([`.github/workflows/deploy-gh-pages.yml`](.github/workflows/deploy-gh-pages.yml))
  * Docker: Multi-stage container packaging for Spring Boot backend (`licenta/LL3-LucrareLicenta/code/web/backend/Dockerfile`)
* **Status:** Production / Active Flagship

---

### 2.2. PS2-Practica (Practical Training Anul 2 & Weather App)

* **Directory:** `licenta/PS2-Practica/`
* **Type:** Practical Internship Project (`internship-project`)
* **Academic Year:** Anul 2 (2024–2025)
* **Domain:** Modern Web Engineering & Meteorological Telemetry
* **Languages:** TypeScript 5.7, JavaScript, CSS3, HTML5
* **Frameworks:** Next.js 15.1, React 19, Tailwind CSS 3.4
* **Build System:** npm (Node.js 20 LTS)
* **Tests:** Static ESLint and TypeScript Compiler Typechecking (`npm run build`)
* **CI Pipeline:** Monorepo Path-Routed CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml))
* **Security Scanning:** `npm audit` scanning in DevSecOps pipeline
* **Documentation:** Internship Daily Journal (14 entries from `11mai.md` to `29mai.md`), [`licenta/PS2-Practica/README.md`](licenta/PS2-Practica/README.md)
* **Deployment:** Node.js Web Server / Next.js Vercel or Node runtime
* **Status:** Completed

---

### 2.3. PELL3-Practica (Practical Training Anul 3)

* **Directory:** `licenta/PELL3-Practica/`
* **Type:** Practical Internship Journal (`internship-logbook`)
* **Academic Year:** Anul 3 (2025–2026)
* **Domain:** Economic Informatics Professional Practice
* **Languages:** Markdown
* **Frameworks:** None
* **Build System:** None
* **Tests:** None
* **CI Pipeline:** Documentation Parity CI ([`.github/workflows/docs.yml`](.github/workflows/docs.yml))
* **Security Scanning:** N/A
* **Documentation:** 10 daily journal entries (`17mai.md` to `28mai.md`), [`licenta/PELL3-Practica/README.md`](licenta/PELL3-Practica/README.md)
* **Deployment:** None
* **Status:** Completed

---

### 2.4. POO2-Proiect (Sales Management System)

* **Directory:** `licenta/POO2-Proiect/`
* **Type:** Academic Coursework Project (`coursework-desktop`)
* **Academic Year:** Anul 2 (2024–2025)
* **Domain:** Object-Oriented Programming & Commercial Sales Desktop Software
* **Languages:** C++ (C++17/20), C Resource Script (`.rc`)
* **Frameworks:** Microsoft Foundation Classes (MFC), Win32 API
* **Build System:** Visual Studio Solution (`P_Vanzari.slnx`), VCXProject (`P_Vanzari.vcxproj`)
* **Tests:** None detected
* **CI Pipeline:** N/A (Windows Desktop native build target)
* **Security Scanning:** N/A
* **Documentation:** [`licenta/POO2-Proiect/README.md`](licenta/POO2-Proiect/README.md)
* **Deployment:** Windows Desktop x86/x64 Executable
* **Status:** Completed

---

### 2.5. POO2-Platforme (OOP Laboratory Platform Suite)

* **Directory:** `licenta/POO2-Platforme/`
* **Type:** Laboratory Platform Suite (`lab-platforms`)
* **Academic Year:** Anul 2 (2024–2025)
* **Domain:** GUI Architecture, Dialog Controls, MDI Windows Architecture
* **Languages:** C++
* **Frameworks:** Microsoft Foundation Classes (MFC)
* **Build System:** Visual Studio Solutions (`MFCApplication*.vcxproj`, `laborator*MDI.vcxproj`)
* **Sub-Platforms:** Platforma2, Platforma3, Platforma4, Platforma5, Platforma6, Platforma9MDI
* **Tests:** None detected
* **CI Pipeline:** N/A
* **Security Scanning:** N/A
* **Documentation:** [`licenta/POO2-Platforme/README.md`](licenta/POO2-Platforme/README.md)
* **Deployment:** Windows Desktop
* **Status:** Completed

---

### 2.6. BD2-Proiect (Academic Management Relational Database)

* **Directory:** `licenta/BD2-Proiect/`
* **Type:** Relational Database Architecture (`database-project`)
* **Academic Year:** Anul 2 (2024–2025)
* **Domain:** Relational Database Design, Academic Entity Management, SQL DDL/DML
* **Languages:** SQL (Structured Query Language)
* **Frameworks:** MySQL Workbench Data Modeling
* **Artifacts:**
  * Schema & DDL/DML Script: `Sistem de Gestiune al activitatii academice.sql`
  * Entity-Relationship Data Model: `diagrama.mwb`
* **Tests:** None detected
* **CI Pipeline:** N/A
* **Security Scanning:** N/A
* **Documentation:** [`licenta/BD2-Proiect/README.md`](licenta/BD2-Proiect/README.md)
* **Deployment:** MySQL 8.0+ Instance
* **Status:** Completed

---

### 2.7. SD2-Proiect (Binary Search Tree & Linked List Data Structures)

* **Directory:** `licenta/SD2-Proiect/`
* **Type:** Data Structures Course Project (`data-structures-project`)
* **Academic Year:** Anul 2 (2024–2025)
* **Domain:** Abstract Data Types, Binary Search Trees, Doubly Linked Lists, File Serialization
* **Languages:** C++
* **Frameworks:** C++ Standard Library
* **Build System:** g++ / Clang / MSVC
* **Tests:** None detected
* **CI Pipeline:** N/A
* **Security Scanning:** N/A
* **Documentation:** [`licenta/SD2-Proiect/README.md`](licenta/SD2-Proiect/README.md)
* **Deployment:** Standalone CLI executable
* **Status:** Completed

---

### 2.8. SD2-Teme (Algorithmic Problem Sets)

* **Directory:** `licenta/SD2-Teme/`
* **Type:** Algorithmic Homework Series (`algorithmic-homework`)
* **Academic Year:** Anul 2 (2024–2025)
* **Domain:** Algorithmics, Sorting, Recursion, Complexity Optimization
* **Languages:** C++
* **Components:** `Problema1.cpp`, `Problema2.cpp`, `Problema3.cpp`, `Problema4.cpp`, `Problema5.cpp`, `Problema6.cpp`
* **Build System:** g++ / MSVC
* **Tests:** None detected
* **CI Pipeline:** N/A
* **Security Scanning:** N/A
* **Documentation:** [`licenta/SD2-Teme/README.md`](licenta/SD2-Teme/README.md)
* **Deployment:** Standalone CLI
* **Status:** Completed

---

### 2.9. RC2-Proiect (Enterprise Network Topology Simulation)

* **Directory:** `licenta/RC2-Proiect/`
* **Type:** Network Architecture Project (`networking-simulation`)
* **Academic Year:** Anul 2 (2024–2025)
* **Domain:** Computer Networks, VLAN Segmentation, Subnetting, Routing Protocols
* **Languages:** N/A
* **Frameworks:** Cisco IOS, Packet Tracer Architecture
* **Artifacts:** `proiect retele.pkt`, `proiect retele.pkz`
* **Tests:** Topology verification via Cisco Packet Tracer 8+
* **CI Pipeline:** File integrity verification
* **Security Scanning:** N/A
* **Documentation:** [`licenta/RC2-Proiect/README.md`](licenta/RC2-Proiect/README.md)
* **Deployment:** Virtualized Cisco Network Environment
* **Status:** Completed

---

### 2.10. PC1-Platforme (Computer Programming Windows Forms Labs)

* **Directory:** `licenta/PC1-Platforme/`
* **Type:** Introductory Lab Platforms (`introductory-labs`)
* **Academic Year:** Anul 1 (2023–2024)
* **Domain:** Procedural & Event-Driven Programming, Windows Forms
* **Languages:** C#, Visual Basic .NET
* **Frameworks:** .NET Framework Windows Forms
* **Build System:** Visual Studio Solution & VBProj (`WinFormsApp1` – `WinFormsApp21`)
* **Tests:** None detected
* **CI Pipeline:** N/A
* **Security Scanning:** N/A
* **Documentation:** [`licenta/PC1-Platforme/README.md`](licenta/PC1-Platforme/README.md)
* **Deployment:** Windows Desktop
* **Status:** Completed

---

### 2.11. Curricular Platform Stubs (Year 3 & Master)

* **`licenta/PW3-Platforma`** — Programare Web (Anul 3). Status: *WIP / Planned*.
* **`licenta/APSI3-Platforma`** — Analiza și Proiectarea Sistemelor Informatice (Anul 3). Status: *WIP / Planned*.
* **`licenta/GBD3-Platforma`** — Gestiunea Bazelor de Date (Anul 3). Status: *WIP / Planned*.
* **`master/`** — Master's Degree Studies (2026–2028). Status: *WIP / Planned*.
