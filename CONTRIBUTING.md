# Contribution Guidelines & Engineering Standards

Welcome to the **Projects-FEAA-UCV/proiecte** academic software monorepo. This repository follows strict platform engineering, DevSecOps, and academic reproducibility standards.

---

## 1. Branching Model

The repository uses a GitFlow / GitHub Flow hybrid tailored for academic and monorepo maintenance:

```text
main (Protected)
  │
  ├── feature/ll3-audit-enhancement
  ├── fix/spring-boot-cors-policy
  ├── docs/update-reproducibility-guide
  └── chore/upgrade-maven-plugins
```

* **`main` (Protected):** Stable branch representing production-ready code and validated academic thesis artifacts. Direct commits are restricted; changes must land via Pull Requests.
* **Feature Branches (`feature/<topic>`):** New modules, subproject implementations, or simulation capabilities.
* **Fix Branches (`fix/<issue>`):** Bug fixes, security patches, or CI repairs.
* **Documentation Branches (`docs/<topic>`):** Academic documentation, LaTeX updates, or architectural blueprints.

---

## 2. Commit Message Conventions

We strictly enforce the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <short description in present tense>

[optional body explaining rationale]

[optional footer(s)]
```

### Supported Types:
* `feat`: A new software feature, endpoint, or simulator capability.
* `fix`: A bug fix or security correction.
* `docs`: Documentation updates (Markdown, LaTeX thesis, bibliography).
* `ci`: CI/CD workflow modifications, pipeline optimizations, or GitHub Actions updates.
* `security`: Security scanner configurations, rule updates, or vulnerability remediations.
* `test`: Adding or refactoring real automated tests (JUnit 5, Pytest, etc.).
* `chore`: Maintenance tasks, dependency updates, or metadata manifest adjustments.

### Example:
```text
feat(ll3-banking): integrate Wazuh SIEM telemetry for balance tampering detection

Implements double-entry ledger event streaming to /var/log/bank-app/security.log
with structured JSON payload compatible with Wazuh Rule 100201.
```

---

## 3. Pull Request Requirements

Every Pull Request must use the standardized [`.github/pull_request_template.md`](.github/pull_request_template.md) and include:

1. **Summary of Changes:** Clear explanation of what was added or modified.
2. **Component Scope:** Path-filtered subproject impacted (`licenta/LL3-LucrareLicenta`, `licenta/PS2-Practica`, etc.).
3. **Automated Testing Evidence:** Logs or results of automated tests executed locally.
4. **Security Impact:** Confirmation that no cleartext credentials, private keys, or CVEs are introduced.
5. **Academic Integrity:** Confirmation that original academic DOCX documents remain untouched.
6. **Passing CI Quality Gates:** All required checks must pass in GitHub Actions before merging.

---

## 4. Testing & "No Fake Quality" Mandate

* **Real Testing Only:** It is strictly forbidden to invent dummy test assertions, mock away all logic to fabricate coverage percentages, or mark a check as PASS when it was never executed.
* **Missing Tests:** For historical coursework projects without test harnesses (e.g. C++ MFC), clearly indicate `None detected` in manifests and catalogs rather than faking test suites.
* **Regression Protection:** All existing automated tests in `licenta/LL3-LucrareLicenta/code` (JUnit 5, Pytest, MITRE scenarios, Spring Boot smoke tests) must continue to pass cleanly.

---

## 5. Security & Secret Leakage Prevention

Before pushing or opening a PR:
1. Ensure your code does not contain private keys, live tokens, or unmasked real payment data.
2. Run Gitleaks locally or verify against [`.gitleaks.toml`](.gitleaks.toml):
   ```bash
   gitleaks detect --config=.gitleaks.toml --verbose
   ```
3. Test mocks and non-production testing credentials must be declared within `.gitleaks.toml` allowlists.

---

## 6. Academic Document Parity

When modifying academic documentation for `LL3-LucrareLicenta`:
* The original `.docx` file must **never** be deleted or corrupted.
* Any edits to the LaTeX thesis must be validated using:
   ```bash
   python3 scripts/sync_academic_docs.py --verify
   ```
* Compilation to PDF must complete without fatal LaTeX errors.
