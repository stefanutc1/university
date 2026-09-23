# Support & Academic Contact Guidelines

Thank you for exploring the **Projects-FEAA-UCV/proiecte** academic software monorepo.

---

## 1. Academic Inquiries & Citations

For academic inquiries regarding the Bachelor's Thesis *"Arhitectura și Securitatea Sistemelor Informatice Bancare"* or undergraduate coursework:

* **Author & Maintainer:** Moanță Ștefănuț-Cornel (@stefanutc1)
* **Academic Institution:** Universitatea din Craiova, Facultatea de Economie și Administrarea Afacerilor (FEAA)
* **Department:** Departamentul de Informatică Economică și Statistică
* **Address:** Str. Alexandru Ioan Cuza, nr. 13, Craiova 200585, Dolj, România
* **Official Website:** [feaa.ucv.ro](http://feaa.ucv.ro)

---

## 2. Technical Support & Issue Reporting

* **Bug Reports:** If you discover an error in one of the simulators, test suites, or build pipelines, please open a GitHub Issue using the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md).
* **Feature Requests & Academic Enhancements:** Suggestions for new attack scenarios, cryptographic models, or architecture diagrams can be proposed via the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).
* **Security Advisories:** For sensitive vulnerability reports, please follow the guidelines in [SECURITY.md](SECURITY.md) instead of creating a public issue.

---

## 3. Local Troubleshooting

Before raising a support ticket, run the repository automated diagnostic tool:
```bash
python3 scripts/doctor.py --verbose
```
This utility audits your local environment against the monorepo baseline and reports exact remediation commands for dependencies, LaTeX compilation, and Python/Java runtimes.
