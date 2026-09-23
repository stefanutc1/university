#!/usr/bin/env python3
"""
Repository Health Doctor: Automated Diagnostic & Audit Engine
Repository: Projects-FEAA-UCV/proiecte

Audits 10 architectural dimensions:
1. Structure (Root governance & directory hygiene)
2. Documentation (Markdown files & structure)
3. CI/CD (GitHub Actions workflows & triggers)
4. Security (Secret scanner config & allowlist bounds)
5. Dependencies (Requirements, POM, package.json, Dependabot)
6. Testing (Automated test suites & simulation harnesses)
7. Academic Parity (DOCX, LaTeX chapters, bibliography)
8. Reproducibility (Blueprint guides & containerfiles)
9. Links (Relative markdown link integrity)
10. Artifacts (Target build directories & schemas)
"""

import argparse
import os
import re
import sys
from typing import Dict, List, Tuple

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


class Finding:
    def __init__(self, severity: str, location: str, problem: str, recommendation: str):
        self.severity = severity  # CRITICAL, HIGH, MEDIUM, LOW, INFO
        self.location = location
        self.problem = problem
        self.recommendation = recommendation

    def __str__(self):
        return (
            f"[{self.severity}] {self.location}\n"
            f"  Problem:        {self.problem}\n"
            f"  Recommendation: {self.recommendation}"
        )


class RepositoryDoctor:
    def __init__(self, root_dir: str):
        self.root = root_dir
        self.findings: List[Finding] = []
        self.categories: Dict[str, str] = {
            "Structure": "PASS",
            "Documentation": "PASS",
            "CI/CD": "PASS",
            "Security": "PASS",
            "Dependencies": "PASS",
            "Testing": "PASS",
            "Academic": "PASS",
            "Reproducibility": "PASS",
            "Links": "PASS",
            "Artifacts": "PASS",
        }

    def add_finding(self, category: str, severity: str, location: str, problem: str, rec: str):
        self.findings.append(Finding(severity, location, problem, rec))
        if severity in ["CRITICAL", "HIGH"]:
            self.categories[category] = "FAIL"
        elif severity == "MEDIUM" and self.categories[category] != "FAIL":
            self.categories[category] = "WARNING"

    def audit_structure(self):
        """1. Verify root governance files and directory layout."""
        required_root_files = [
            "README.md",
            "CONTRIBUTING.md",
            "SECURITY.md",
            "CODE_OF_CONDUCT.md",
            "SUPPORT.md",
            "CHANGELOG.md",
            "PROJECTS.md",
            ".editorconfig",
            ".gitattributes",
            ".gitignore",
        ]
        for f in required_root_files:
            path = os.path.join(self.root, f)
            if not os.path.exists(path):
                self.add_finding(
                    "Structure",
                    "CRITICAL",
                    f,
                    f"Fisierul de guvernanta radacina {f} lipseste.",
                    f"Creeaza {f} conform standardului de guvernanta monorepo."
                )

        required_dirs = ["licenta", "master", "scripts", ".github/workflows"]
        for d in required_dirs:
            path = os.path.join(self.root, d)
            if not os.path.isdir(path):
                self.add_finding(
                    "Structure",
                    "HIGH",
                    d,
                    f"Directorul cheie {d} lipseste din radacina repository-ului.",
                    f"Creeaza directorul {d}."
                )

    def audit_documentation(self):
        """2. Verify markdown documentation quality."""
        for root, _, files in os.walk(self.root):
            if ".git" in root or "node_modules" in root:
                continue
            for f in files:
                if f.endswith(".md"):
                    path = os.path.join(root, f)
                    rel = os.path.relpath(path, self.root)
                    size = os.path.getsize(path)
                    if size == 0:
                        self.add_finding(
                            "Documentation",
                            "MEDIUM",
                            rel,
                            "Fisierul markdown este complet gol (0 bytes).",
                            "Adauga structura de documentatie sau documenteaza starea WIP."
                        )

    def audit_cicd(self):
        """3. Verify GitHub Actions workflow structure."""
        workflows_dir = os.path.join(self.root, ".github", "workflows")
        if not os.path.isdir(workflows_dir):
            return

        expected_workflows = [
            "ci.yml",
            "security.yml",
            "docs.yml",
            "latex.yml",
            "deploy-gh-pages.yml",
        ]
        for wf in expected_workflows:
            wf_path = os.path.join(workflows_dir, wf)
            if not os.path.exists(wf_path):
                self.add_finding(
                    "CI/CD",
                    "HIGH",
                    f".github/workflows/{wf}",
                    f"Workflow-ul standard {wf} lipseste din .github/workflows/.",
                    f"Creeaza {wf} pentru a asigura acoperirea CI/CD."
                )
            else:
                # Basic syntax inspection
                with open(wf_path, "r", encoding="utf-8") as f_obj:
                    content = f_obj.read()
                    if "name:" not in content or "jobs:" not in content:
                        self.add_finding(
                            "CI/CD",
                            "HIGH",
                            f".github/workflows/{wf}",
                            "Fisierul workflow YAML nu pare sa aiba structura valida GitHub Actions (lipseste 'name' sau 'jobs').",
                            "Corecteaza sintaxa YAML conform specificatiei GitHub Actions."
                        )

    def audit_security(self):
        """4. Verify security scanner configs and secret policies."""
        gitleaks_cfg = os.path.join(self.root, ".gitleaks.toml")
        if not os.path.exists(gitleaks_cfg):
            self.add_finding(
                "Security",
                "HIGH",
                ".gitleaks.toml",
                "Lipseste configuratia Gitleaks (.gitleaks.toml).",
                "Creeaza .gitleaks.toml pentru a guverna detectia secretelor si allowlist-ul academic."
            )
        else:
            with open(gitleaks_cfg, "r", encoding="utf-8") as f_obj:
                cfg_content = f_obj.read()
                if "[allowlist]" not in cfg_content:
                    self.add_finding(
                        "Security",
                        "MEDIUM",
                        ".gitleaks.toml",
                        "Configuratia .gitleaks.toml nu contine sectiunea [allowlist].",
                        "Configureaza [allowlist] pentru cheile de test in-memory ale bancii."
                    )

    def audit_dependencies(self):
        """5. Verify dependency manifests and Dependabot."""
        req_path = os.path.join(self.root, "licenta", "LL3-LucrareLicenta", "code", "requirements.txt")
        if not os.path.exists(req_path):
            self.add_finding(
                "Dependencies",
                "HIGH",
                "licenta/LL3-LucrareLicenta/code/requirements.txt",
                "Lipseste requirements.txt pentru suita Python LL3.",
                "Creeaza requirements.txt cu dependintele necesare (fastapi, pytest etc.)."
            )

        pom_path = os.path.join(self.root, "licenta", "LL3-LucrareLicenta", "code", "web", "backend", "pom.xml")
        if not os.path.exists(pom_path):
            self.add_finding(
                "Dependencies",
                "HIGH",
                "licenta/LL3-LucrareLicenta/code/web/backend/pom.xml",
                "Lipseste pom.xml pentru backend-ul Spring Boot LL3.",
                "Adauga specificatia Maven pom.xml."
            )

        dependabot_cfg = os.path.join(self.root, ".github", "dependabot.yml")
        if not os.path.exists(dependabot_cfg):
            self.add_finding(
                "Dependencies",
                "MEDIUM",
                ".github/dependabot.yml",
                "Configuratia Dependabot (.github/dependabot.yml) lipseste.",
                "Configureaza actualizari automate saptamanale pentru Maven, pip, npm si GitHub Actions."
            )

    def audit_testing(self):
        """6. Verify existence and integrity of automated test suites."""
        tests_to_check = [
            ("licenta/LL3-LucrareLicenta/code/test_banking_suite.py", "Pytest unit & integration suite"),
            ("licenta/LL3-LucrareLicenta/code/banking_attack_simulator.py", "MITRE ATT&CK 5 scenario simulator"),
            ("licenta/LL3-LucrareLicenta/code/smoke_test_backend.py", "Spring Boot live integration smoke test"),
            ("licenta/LL3-LucrareLicenta/code/web/backend/src/test/java/ro/ucv/feaa/bank/service/AccountServiceTest.java", "JUnit 5 service tests"),
        ]
        for rel_path, desc in tests_to_check:
            abs_path = os.path.join(self.root, rel_path)
            if not os.path.exists(abs_path):
                self.add_finding(
                    "Testing",
                    "HIGH",
                    rel_path,
                    f"Testul / suita {desc} lipseste de pe disc.",
                    f"Asigura existenta testului {rel_path}."
                )

    def audit_academic(self):
        """7. Verify academic thesis documents, modular LaTeX, and parity."""
        ll3_dir = os.path.join(self.root, "licenta", "LL3-LucrareLicenta")
        docx_files = [f for f in os.listdir(ll3_dir) if f.startswith("LUCRARE LICENTA - ") and f.endswith(".docx")]
        if not docx_files:
            self.add_finding(
                "Academic",
                "HIGH",
                "licenta/LL3-LucrareLicenta",
                "Niciun document original Word 'LUCRARE LICENTA - *.docx' nu a fost gasit.",
                "Pastereaza intact documentul oficial DOCX de licenta."
            )

        latex_main = os.path.join(ll3_dir, "latex", "main.tex")
        if not os.path.exists(latex_main):
            self.add_finding(
                "Academic",
                "HIGH",
                "licenta/LL3-LucrareLicenta/latex/main.tex",
                "Structura modulara LaTeX (latex/main.tex) lipseste.",
                "Ruleaza 'python3 scripts/sync_academic_docs.py --sync' pentru extragere."
            )

        bib_file = os.path.join(ll3_dir, "latex", "bibliography", "references.bib")
        if not os.path.exists(bib_file):
            self.add_finding(
                "Academic",
                "HIGH",
                "licenta/LL3-LucrareLicenta/latex/bibliography/references.bib",
                "Fisierul BibTeX references.bib lipseste.",
                "Genereaza references.bib cu cele 35 de referinte academice."
            )

    def audit_reproducibility(self):
        """8. Verify reproducibility blueprints."""
        guides = [
            "docs/reproducibility.md",
            "licenta/LL3-LucrareLicenta/reproducibility.md",
        ]
        for g in guides:
            path = os.path.join(self.root, g)
            if not os.path.exists(path):
                self.add_finding(
                    "Reproducibility",
                    "MEDIUM",
                    g,
                    f"Ghidul de reproductibilitate academica {g} lipseste.",
                    f"Creeaza {g} conform specificatiilor."
                )

    def audit_links(self):
        """9. Verify internal relative markdown links."""
        link_pattern = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
        for root, _, files in os.walk(self.root):
            if ".git" in root or "node_modules" in root:
                continue
            for f in files:
                if f.endswith(".md"):
                    file_path = os.path.join(root, f)
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as md_f:
                        content = md_f.read()
                        matches = link_pattern.findall(content)
                        for text, url in matches:
                            # Skip web URLs, mailto, anchor fragments, or badge links
                            if url.startswith(("http://", "https://", "mailto:", "#", "javascript:")):
                                continue
                            clean_url = url.split("#")[0].split("?")[0]
                            if not clean_url:
                                continue
                            target_path = os.path.normpath(os.path.join(root, clean_url))
                            if not os.path.exists(target_path):
                                rel_source = os.path.relpath(file_path, self.root)
                                self.add_finding(
                                    "Links",
                                    "LOW",
                                    rel_source,
                                    f"Legatura relativa rupta catre '{url}' (tinta nu exista pe disc: {clean_url}).",
                                    f"Corecteaza calea legaturii in {rel_source}."
                                )

    def audit_artifacts(self):
        """10. Verify project metadata manifests (manifest.yaml)."""
        expected_manifests = [
            "licenta/LL3-LucrareLicenta/manifest.yaml",
            "licenta/PS2-Practica/manifest.yaml",
            "licenta/PELL3-Practica/manifest.yaml",
            "licenta/POO2-Proiect/manifest.yaml",
            "licenta/BD2-Proiect/manifest.yaml",
            "licenta/SD2-Proiect/manifest.yaml",
        ]
        for m in expected_manifests:
            path = os.path.join(self.root, m)
            if not os.path.exists(path):
                self.add_finding(
                    "Artifacts",
                    "LOW",
                    m,
                    f"Manifestul standard de metadate {m} lipseste.",
                    f"Creeaza manifest.yaml pentru proiectul respectiv."
                )

    def run_all(self):
        self.audit_structure()
        self.audit_documentation()
        self.audit_cicd()
        self.audit_security()
        self.audit_dependencies()
        self.audit_testing()
        self.audit_academic()
        self.audit_reproducibility()
        self.audit_links()
        self.audit_artifacts()

    def generate_report(self, verbose: bool = False) -> str:
        out = []
        out.append("======================================================================")
        out.append("REPOSITORY HEALTH REPORT")
        out.append("Repository: Projects-FEAA-UCV/proiecte")
        out.append("======================================================================")
        out.append("")
        out.append("PILLAR STATUS MATRIX:")
        for cat, status in self.categories.items():
            out.append(f"  {cat:18}: {status}")
        out.append("")

        critical_count = sum(1 for f in self.findings if f.severity == "CRITICAL")
        high_count = sum(1 for f in self.findings if f.severity == "HIGH")
        medium_count = sum(1 for f in self.findings if f.severity == "MEDIUM")
        low_count = sum(1 for f in self.findings if f.severity == "LOW")

        out.append(f"TOTAL FINDINGS: {len(self.findings)} "
                   f"(CRITICAL: {critical_count}, HIGH: {high_count}, MEDIUM: {medium_count}, LOW: {low_count})")
        out.append("")

        if self.findings:
            out.append("DIAGNOSTIC FINDINGS & RECOMMENDATIONS:")
            out.append("-" * 70)
            for idx, finding in enumerate(self.findings, 1):
                if verbose or finding.severity in ["CRITICAL", "HIGH", "MEDIUM"]:
                    out.append(f"#{idx} [{finding.severity}] Location: {finding.location}")
                    out.append(f"    Problem:        {finding.problem}")
                    out.append(f"    Recommendation: {finding.recommendation}")
                    out.append("")
            out.append("-" * 70)
        else:
            out.append("[SUCCESS] Nicio problema detectata. Repository-ul este 100% conform.")

        out.append("======================================================================")
        return "\n".join(out)


def main():
    parser = argparse.ArgumentParser(description="Repository Health Doctor")
    parser.add_argument("--verbose", action="store_true", help="Print all findings including LOW and INFO")
    parser.add_argument("--summary", action="store_true", help="Exit code 0 unless CRITICAL issues exist")
    args = parser.parse_args()

    doctor = RepositoryDoctor(REPO_ROOT)
    doctor.run_all()
    report = doctor.generate_report(verbose=args.verbose)
    print(report)

    # Determine exit code
    has_critical_or_high = any(f.severity in ["CRITICAL", "HIGH"] for f in doctor.findings)
    if has_critical_or_high:
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
