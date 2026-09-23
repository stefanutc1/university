# Changelog

All notable changes to the **Projects-FEAA-UCV/proiecte** academic software monorepo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Root governance architecture: `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `SUPPORT.md`, `CHANGELOG.md`, `PROJECTS.md`, `.editorconfig`, `.gitattributes`, `.gitignore`.
- Standardized metadata manifests (`manifest.yaml`) across all academic subprojects.
- Automated repository health doctor (`scripts/doctor.py`) auditing 10 architectural pillars.
- Monorepo path-aware CI/CD routing matrix (`ci.yml`, `security.yml`, `docs.yml`, `latex.yml`).
- Architecture Decision Records (`ADR-0001`, `ADR-0002`, `ADR-0003`) under `docs/decisions/`.
- Academic reproducibility blueprint (`docs/reproducibility.md`).
- Multi-ecosystem Dependabot configuration (`.github/dependabot.yml`).
- GitHub issue templates and pull request template (`.github/`).
- Standardized documentation across all subprojects matching `stefanutc1/infrastructure` caliber.

---

## [2.1.0] - 2026-09-23

### Added
- DevSecOps security pipeline integrating Gitleaks, TruffleHog, pip-audit, Bandit SAST, and Aqua Trivy.
- Automated DOCX to modular LaTeX synchronization script (`scripts/sync_academic_docs.py`).
- Automated GitHub Pages CD pipeline for the Web Banking Kiosk (`deploy-gh-pages.yml`).
- Integration smoke tests verifying live Spring Boot REST endpoints and Wazuh SIEM telemetry.

### Changed
- Standardized markdown documentation for `licenta/LL3-LucrareLicenta`, `code/README.md`, and `code/web/README.md`.
- Enhanced test assertions and resolved signature mismatches across the banking test suite.

---

## [2.0.0] - 2026-09-20

### Added
- Core-Banking Spring Boot 3.2 (Java 17 LTS) backend with stateless JWT and structured JSON audit logging.
- Next-generation HTML5 / Vanilla JS Web Banking Kiosk with touchscreen keypad and auto-wipe timer.
- MITRE ATT&CK enterprise banking attack simulator covering 5 defensive threat scenarios.
- Double-entry accounting ledger with cryptographic SHA-256 tamper-evident chaining.

---

## [1.0.0] - 2024-05-30

### Added
- Initial consolidation of academic coursework projects across Year 1 and Year 2.
- Practical internship documentation and journals (`licenta/PS2-Practica`, `licenta/PELL3-Practica`).
- Laboratory platform exercises for Object-Oriented Programming (C++ MFC), Relational Databases (MySQL), and Data Structures.
