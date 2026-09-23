# Arhitectura și Securitatea Sistemelor Informatice Bancare
## Proiect de Licență & Suită de Reziliență Cibernetică (FEAA Craiova 2026)

**Universitatea din Craiova** | **Facultatea de Economie și Administrarea Afacerilor (FEAA)**  
**Program de Studii:** Informatică Economică (Promoția 2026)  
**Absolvent:** Moanță Ștefănuț-Cornel  
**Coordonator Științific:** Conf. univ. dr. [Nume Coordonator]  

---

## 1. Prezentare Generală

Acest director (`licenta/LL3-LucrareLicenta`) găzduiește artefactele software, componentele de simulare financiar-bancară, infrastructura de testare defensivă și documentația academică oficială aferentă lucrării de licență orientate către auditul și reziliența cibernetică a sistemelor financiar-bancare.

Arhitectura reproduce fidel un ecosistem financiar multi-nivel integrat cu standardele **PCI-DSS v4.0**, **PSD2 / EBA RTS**, **DORA (Regulamentul UE 2022/2554)** și **ISO 20022**:
1. **VM 310 (Core-Banking Engine):** Motor central contabil în partidă dublă (*Debite = Credite*) cu ledger tamper-evident SHA-256.
2. **VM 311 (Financial Database & Wazuh Auditor):** Bază de date relațională cu auditare tranzacțională ACID și detecție Wazuh SIEM pentru SQLi și *Balance Tampering* (Regula Nivel 14).
3. **CT 312 (Payment Gateway & SWIFT Simulator):** Microserviciu FastAPI pentru autorizări card (algoritm Luhn Mod 10, mascare PAN) și mesagerie interbancară SWIFT MT103 / ISO 20022 pacs.008 cu UETR RFC 4122.
4. **VM 313 (Hardened Bastion Jump-Box):** Punct de acces administrativ securizat prin chei criptografice Ed25519 și autentificare MFA.
5. **Web Banking Kiosk:** Interfață web interactivă de terminal bancar securizat (HTML5/CSS3/Vanilla JS) cu backend Spring Boot 3.2 (Java 17) și telemetrie live către Wazuh SIEM.

---

## 2. CI/CD & DevSecOps Architecture

Pipeline-ul de Integrare Continuă și Livrare Continuă este proiectat la nivel de întreprindere și adaptat pentru repository-ul `stefanutc1/proiecte`. Toate workflow-urile folosesc filtre stricte de cale (`path filters`) pe `licenta/LL3-LucrareLicenta/**`, prevenind execuțiile redundante la modificarea altor proiecte universitare.

### 2.1. Diagrama Arhitecturală a Pipeline-ului

```mermaid
flowchart TD
    DEV([Developer / Git Push]) --> PR[Pull Request / Main Branch]
    
    subgraph CI_PIPELINE ["CI Pipeline (ll3-ci.yml)"]
        direction TB
        PY[Python CI: 5 Scenarii MITRE ATT&CK + Pytest]
        JVM[Java 17 CI: Spring Boot 3.2 Compile + Package]
        WEB[Web Frontend: Validare Statică & Lint JS]
        DOCKER[Docker CI: Buildx Container Validation]
        SMOKE[Smoke Test: Spring Boot Live REST API Probing]
        
        PY --> CI_GATE{CI Quality Gate}
        JVM --> SMOKE --> CI_GATE
        WEB --> CI_GATE
        DOCKER --> CI_GATE
    end

    subgraph SEC_PIPELINE ["DevSecOps Pipeline (ll3-security.yml)"]
        direction TB
        SECRETS[Secret Scanning: Gitleaks v2]
        AUDIT[Dependency Audit: pip-audit]
        SAST[Python SAST: Bandit Security Scanner]
        TRIVY[Filesystem & Vulnerability Scan: Aqua Trivy]
        
        SECRETS --> SEC_GATE{Security Gate}
        AUDIT --> SEC_GATE
        SAST --> SEC_GATE
        TRIVY --> SEC_GATE
    end

    subgraph DOCS_PIPELINE ["Academic Docs Pipeline (ll3-docs.yml)"]
        direction TB
        PARITY[DOCX ↔ LaTeX Parity Audit]
        TEX_BUILD[LaTeX Compilation: latexmk / TeXLive]
        PDF_OUT[Artifact: licenta-pdf (30 Days)]
        
        PARITY --> TEX_BUILD --> PDF_OUT
    end

    PR --> CI_PIPELINE
    PR --> SEC_PIPELINE
    PR --> DOCS_PIPELINE

    CI_GATE --> DEPLOY_CHECK{CI Success?}
    DEPLOY_CHECK -- Da (Branch Main) --> PAGES[Deploy GitHub Pages: deploy-gh-pages.yml]
    DEPLOY_CHECK -- Nu --> REJECT[Block PR / Halt Pipeline]
```

### 2.2. Structura Workflow-urilor GitHub Actions

| Workflow | Fișier | Responsabilitate & Porți de Calitate | Triggere |
| :--- | :--- | :--- | :--- |
| **Continuous Integration** | `.github/workflows/ll3-ci.yml` | Validare bytecode Python, 5 scenarii MITRE ATT&CK, compilare Maven Java 17, build Docker, smoke test REST live. | `push`, `pull_request`, `workflow_dispatch` |
| **DevSecOps & Security** | `.github/workflows/ll3-security.yml` | Scanare secrete Gitleaks, auditare dependențe `pip-audit`, analiză statică SAST Bandit, scanare Trivy. | `push`, `pull_request`, `workflow_dispatch` |
| **Academic Documentation** | `.github/workflows/ll3-docs.yml` | Verificare paritate DOCX ↔ LaTeX, compilare TeXLive în PDF și generare artefact `licenta-pdf`. | `push`, `pull_request`, `workflow_dispatch` |
| **GitHub Pages Deployment** | `.github/workflows/deploy-gh-pages.yml` | Publicare securizată a terminalului Kiosk pe GitHub Pages, condiționată strict de succesul CI. | `workflow_run` (după CI), `workflow_dispatch` |

### 2.3. Politica de Securitate și Porți Blocante (Quality Gates)

* **Blocante (Pipeline Failure):**
  * Secrete sau credențiale detectate în commit de Gitleaks.
  * Eșec la oricare dintre cele 5 scenarii de atac bancar MITRE ATT&CK.
  * Eșec la compilarea Java/Maven sau testele unitare Spring Boot.
  * Legături sau fișiere lipsă în interfața statică a terminalului Kiosk.
  * Eșec la build-ul imaginii Docker sau la testul de integrare live REST API.
  * Erori fatale de sintaxă la compilarea documentului academic LaTeX.
* **Avertismente (Informational / Warnings):**
  * Vulnerabilități moderate în dependențe de laborator semnalate de `pip-audit`.
  * Recomandări non-critice de stil sau formatare SAST emise de `bandit`.

---

## 3. Academic Documentation (DOCX & LaTeX)

Lucrarea de licență beneficiază de o reprezentare completă, versionată și sincronizată atât în format Microsoft Word (`.docx`), cât și în cod sursă modular LaTeX (`.tex` / `.bib`), garantând reproductibilitatea academică, trasabilitatea modificărilor în Git și generarea automată a documentului PDF tipăribil.

### 3.1. Structura Fișierelor Academice

```
licenta/LL3-LucrareLicenta/
├── LUCRARE LICENTA - 31.08.2026.docx     # Documentul Word original de referință
├── LUCRARE LICENTA - 31.08.2026/         # Structură LaTeX asociată versiunii
└── latex/                                # Structura LaTeX modulară principală
    ├── main.tex                          # Fișierul master de asamblare și formatare
    ├── preamble.tex                      # Pachete tipografice, margini A4, stiluri
    ├── metadata.tex                      # Titlu, autor, coordonator, instituție
    ├── chapters/
    │   ├── 00_introducere.tex            # Introducere, motivație și obiective cercetare
    │   ├── 01_stadiul_cunoasterii.tex    # Capitolul 1: Normative, PSD2, DORA, PCI-DSS, atacuri
    │   ├── 02_proiectare_si_implementare.tex # Capitolul 2: Topologie virtuală, VM-uri, simulări
    │   └── 03_concluzii.tex              # Concluzii, contribuții originale și direcții viitoare
    ├── bibliography/
    │   └── references.bib                # Cele 35 de referințe bibliografice în format BibTeX
    └── appendices/
        └── anexe.tex                     # Anexele A, B, C (Scheme SQL DDL, Python, JSON Wazuh)
```

### 3.2. Automatizare și Verificare Paritate (DOCX ↔ LaTeX)

Pentru a menține corespondența bijectivă între orice versiune DOCX și sursele LaTeX, a fost dezvoltat utilitarul:
```bash
# Extragere și sincronizare automată a conținutului din DOCX în LaTeX
python3 scripts/sync_academic_docs.py --sync

# Verificare paritate și raportare integritate academică
python3 scripts/sync_academic_docs.py --verify
```

În GitHub Actions, workflow-ul `ll3-docs.yml` compilează automat `main.tex` utilizând distribuția TeXLive (`xu-cheng/latex-action@v3`) și salvează documentul rezultat sub denumirea `LUCRARE_LICENTA_2026.pdf` ca artefact cu retenție de 30 de zile.

---

## 4. Recomandări Branch Protection & GitHub Settings

Pentru protejarea ramurii de producție `main` și menținerea standardelor de calitate software, se recomandă activarea următoarelor reguli în setările depozitului GitHub:

1. **Branch Protection Rule pe `main`:**
   * **Require a pull request before merging:** Activ (minimum 1 review).
   * **Require status checks to pass before merging:**
     * `CI Quality Gate Aggregate` (din `ll3-ci.yml`)
     * `DevSecOps Gate Aggregate` (din `ll3-security.yml`)
     * `Validate Parity & Compile LaTeX PDF` (din `ll3-docs.yml`)
   * **Require branches to be up to date before merging:** Activ.
   * **Do not allow bypassing the above settings:** Activ.
2. **GitHub Pages Environment:**
   * Source: **GitHub Actions** (deployment gh-pages via `deploy-gh-pages.yml`).
   * Custom domain / HTTPS enforcement: Activ.
