# ADR-0001: Path-Aware Monorepo CI/CD Architecture

## Context
The `Projects-FEAA-UCV/proiecte` repository is an academic monorepo hosting multiple decoupled projects:
* `licenta/LL3-LucrareLicenta`: A multi-tier banking software suite (Java 17, Spring Boot 3.2, Python 3.11, Docker, Vanilla JS, and LaTeX).
* `licenta/PS2-Practica`: A Next.js 15 / React 19 web application.
* Various C++, MySQL, and introductory lab platforms.

Running all compilers, dependency audits, Docker builds, and test harnesses on every single commit produces significant CI runner queue delays, wastes GitHub Actions runner minutes, and fails unrelated jobs if an environment issue occurs in an unedited component.

## Decision
We implement a path-aware CI/CD routing matrix using `dorny/paths-filter` and native GitHub Actions path triggers:
1. Changes to `licenta/LL3-LucrareLicenta/code/*.py` trigger only the Python pipeline (Pytest + MITRE simulator).
2. Changes to `licenta/LL3-LucrareLicenta/code/web/backend/**` trigger only the Java 17 / Maven build and Spring Boot smoke tests.
3. Changes to `licenta/PS2-Practica/proiect/**` trigger only the Next.js / npm validation pipeline.
4. Changes to LaTeX files trigger the dedicated TeXLive compilation pipeline.
5. An Aggregate Quality Gate (`ci-gate`) evaluates all executed jobs, ensuring branch protection remains satisfied without failing on skipped jobs.

## Alternatives Considered
* **Full Matrix Execution on Every Commit:** Rejected due to excessive build times (>8 minutes per commit) and runner consumption.
* **Separating into 10+ Individual Repositories:** Rejected because the monorepo preserves the historical timeline of the student's entire academic progression at FEAA Craiova in a single unified portfolio.

## Consequences
* **Positive:** Drastic reduction in CI execution duration (<45s for localized changes); deterministic failure isolation; zero disruption to other projects.
* **Negative:** Requires careful maintenance of path filter globs in `.github/workflows/ci.yml`.

## Status
Accepted and Implemented.
