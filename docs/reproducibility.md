# Academic Software Reproducibility Blueprint

This document specifies the exact environment, dependencies, build sequences, test executions, and result-generation commands required to independently reproduce all findings and software artifacts within `Projects-FEAA-UCV/proiecte`.

---

## 1. Target Execution Environment

The research artifacts have been tested and verified across the following environments:
* **Operating Systems:** Ubuntu 22.04 LTS / 24.04 LTS, macOS 14 / 15 (Apple Silicon & Intel)
* **Core Runtimes:**
  * **Java:** OpenJDK 17 LTS (Eclipse Temurin 17.0.10+)
  * **Python:** CPython 3.11.x (or 3.12.x)
  * **Node.js:** Node.js 20 LTS (npm 10+)
  * **TeX Distribution:** TeXLive 2023+ / MacTeX (with `pdflatex` and `bibtex`)
  * **Container Engine:** Docker Engine 24+ / Docker Desktop (optional for live backend container)

---

## 2. Dependencies & Tooling Setup

### 2.1. Python Environment Setup
```bash
# Navigate to the banking core directory
cd licenta/LL3-LucrareLicenta/code

# Create and activate an isolated virtual environment
python3 -m venv venv
source venv/bin/activate

# Upgrade pip and install pinned runtime dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### 2.2. Java & Maven Setup
Ensure Java 17 and Maven are installed:
```bash
java -version
mvn -version
```

### 2.3. Next.js Web Application Setup (PS2-Practica)
```bash
cd licenta/PS2-Practica/proiect
npm ci
```

---

## 3. Build & Compilation Procedures

### 3.1. Java Spring Boot 3.2 Backend
```bash
cd licenta/LL3-LucrareLicenta/code/web/backend
mvn clean compile
mvn package -DskipTests=true
# Generates executable JAR: target/bank-kiosk-backend-1.0.0.jar
```

### 3.2. Docker Multi-Stage Image Build
```bash
cd licenta/LL3-LucrareLicenta/code/web/backend
docker build -t bank-kiosk-backend:latest .
```

### 3.3. Python Bytecode Compilation Verification
```bash
cd licenta/LL3-LucrareLicenta/code
python3 -m py_compile *.py
```

### 3.4. Next.js Weather Web Application
```bash
cd licenta/PS2-Practica/proiect
npm run build
```

---

## 4. Execution & Live Telemetry

### 4.1. Launching the Banking Backend
```bash
mkdir -p /tmp/bank-app logs
java -Dserver.port=8080 -Dbank.security.log-file-path=/tmp/bank-app/security.log \
     -jar licenta/LL3-LucrareLicenta/code/web/backend/target/*.jar
```

### 4.2. Accessing the Web Banking Kiosk
* **Live Mode:** Open `http://localhost:8080` (or `licenta/LL3-LucrareLicenta/code/web/index.html` in a web browser).
* **Demo / Pages Mode:** If backend is unreachable, the embedded `mock-engine.js` automatically activates, allowing full UI exploration without infrastructure dependencies.

---

## 5. Automated Testing & Result Generation

### 5.1. Unit & Integration Test Suite (Pytest)
```bash
cd licenta/LL3-LucrareLicenta/code
pytest -v test_banking_suite.py
```
*Expected Outcome:* All tests pass (validating account balance checks, double-entry ledger debit/credit balances, card Luhn checksums, and token verification).

### 5.2. Banking Attack & Defense Simulation (5 MITRE Scenarios)
```bash
cd licenta/LL3-LucrareLicenta/code
python3 banking_attack_simulator.py
```
*Expected Outcome:* 5 MITRE ATT&CK attack scenarios simulated against the banking core:
1. SQL Injection Authentication Bypass (Intercepted)
2. Unauthorized Balance Tampering (Tamper-evident ledger failure detected)
3. High-Velocity Card Stuffing / Brute-Force (Rate-limited & blocked)
4. Lateral Movement via Bastion (MFA / key verification enforced)
5. Denial-of-Service / Transaction Flooding (Threshold alarm triggered)

### 5.3. Live Backend Smoke Test
```bash
python3 licenta/LL3-LucrareLicenta/code/smoke_test_backend.py
```

---

## 6. Academic Thesis PDF Compilation

### 6.1. DOCX <-> LaTeX Parity Verification
```bash
python3 scripts/sync_academic_docs.py --verify
```

### 6.2. Compiling Modular LaTeX to PDF
```bash
cd licenta/LL3-LucrareLicenta/latex
pdflatex -interaction=nonstopmode main.tex
bibtex main
pdflatex -interaction=nonstopmode main.tex
pdflatex -interaction=nonstopmode main.tex
```
*Expected Outcome:* Generates `licenta/LL3-LucrareLicenta/latex/main.pdf` complete with title page, table of contents, all 3 thesis chapters, 35 academic references, and code listings.
