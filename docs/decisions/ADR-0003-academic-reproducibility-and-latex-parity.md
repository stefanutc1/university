# ADR-0003: Academic Reproducibility & Modular LaTeX Parity

## Context
The Bachelor's Thesis was originally authored in Microsoft Word format (`LUCRARE LICENTA - *.docx`) in accordance with FEAA faculty formatting guidelines. However, modern reproducible research and continuous integration require automated version control, deterministic text diffing, and artifact generation (PDF compilation) within headless CI/CD environments.

## Decision
We establish a dual-representation standard:
1. **Source Document Preservation:** Original Microsoft Word documents (`.docx`) are strictly preserved in Git as immutable reference documents. They are never deleted or corrupted.
2. **Automated Extraction to Modular LaTeX:** A specialized synchronization utility (`scripts/sync_academic_docs.py`) extracts sections, tables, code listings, and bibliographic citations into a structured LaTeX hierarchy:
   ```text
   latex/
   ├── main.tex
   ├── metadata.tex
   ├── preamble.tex
   ├── chapters/
   ├── figures/
   ├── tables/
   ├── bibliography/
   └── appendices/
   ```
3. **Parity Verification in CI:** The `docs.yml` pipeline runs `python3 scripts/sync_academic_docs.py --verify` on every push to verify that the modular LaTeX accurately reflects the academic document.
4. **Headless PDF Compilation:** The `latex.yml` pipeline compiles the LaTeX sources via TeXLive / `latexmk` and uploads the resulting PDF as a 30-day CI artifact (`licenta-pdf`).

## Alternatives Considered
* **Disposing of DOCX and moving exclusively to LaTeX:** Rejected because faculty committee guidelines and official submission protocols require the official Word document format and signed annexes.
* **Manual copy-pasting into LaTeX:** Rejected due to human error and risk of divergence between the submitted thesis and the repository source.

## Consequences
* **Positive:** Perfect parity between Word document and version-controlled LaTeX; automated PDF production in GitHub Actions; complete academic transparency.
* **Negative:** Requires running the synchronization script when major structural changes are made to the thesis text.

## Status
Accepted and Implemented.
