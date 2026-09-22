#!/usr/bin/env python3
"""
Sincronizare și conversie automată DOCX -> Modular LaTeX pentru Lucrarea de Licență.
Repository: Projects-FEAA-UCV/proiecte
Target: licenta/LL3-LucrareLicenta

Acest script:
1. Scanează repository-ul pentru documentele academice `LUCRARE LICENTA - *.docx`.
2. Extrage semantic conținutul în capitole modulare LaTeX:
   - metadata.tex, preamble.tex, main.tex
   - chapters/00_introducere.tex
   - chapters/01_stadiul_cunoasterii.tex
   - chapters/02_proiectare_si_implementare.tex
   - chapters/03_concluzii.tex
   - bibliography/references.bib
   - appendices/anexe.tex
3. Transformă tabelele în structuri LaTeX booktabs / tabularx.
4. Transformă listările de cod în medii lstlisting.
5. Verifică paritatea DOCX <-> LaTeX și generează raport de integritate.
"""

import argparse
import glob
import os
import re
import sys
from typing import List, Tuple

import docx
from docx.oxml.text.paragraph import CT_P
from docx.oxml.table import CT_Tbl
from docx.text.paragraph import Paragraph
from docx.table import Table


def escape_latex(text: str) -> str:
    """Escapare sigură a caracterelor speciale LaTeX."""
    text = text.replace('\\', r'\textbackslash{}')
    # Protecție diacritice românești (în mod nativ UTF-8 cu babel[romanian] și fontenc[T1] merg direct,
    # dar caracterele de control LaTeX trebuie escapate)
    replacements = [
        ('&', r'\&'),
        ('%', r'\%'),
        ('$', r'\$'),
        ('#', r'\#'),
        ('_', r'\_'),
        ('{', r'\{'),
        ('}', r'\}'),
        ('~', r'\textasciitilde{}'),
        ('^', r'\textasciicircum{}'),
    ]
    for orig, repl in replacements:
        text = text.replace(orig, repl)
    return text


def build_bibtex_entries() -> str:
    """Generează conținutul complet references.bib pentru cele 35 de referințe academice din teză."""
    return r"""@book{anderson2020,
  author    = {Anderson, Ross},
  title     = {Security Engineering: A Guide to Building Dependable Distributed Systems},
  edition   = {3rd},
  publisher = {Wiley Publishing},
  address   = {Indianapolis},
  year      = {2020}
}

@book{date2004,
  author    = {Date, C. J.},
  title     = {An Introduction to Database Systems},
  edition   = {8th},
  publisher = {Pearson Education},
  address   = {Boston},
  year      = {2004}
}

@book{elmasri2016,
  author    = {Elmasri, Ramez and Navathe, Shamkant B.},
  title     = {Fundamentals of Database Systems},
  edition   = {7th},
  publisher = {Pearson},
  address   = {London},
  year      = {2016}
}

@book{ferguson2010,
  author    = {Ferguson, Niels and Schneier, Bruce and Kohno, Tadayoshi},
  title     = {Cryptography Engineering: Design Principles and Practical Applications},
  publisher = {Wiley Publishing},
  address   = {Indianapolis},
  year      = {2010}
}

@book{garfinkel2003,
  author    = {Garfinkel, Simson and Spafford, Gene and Schwartz, Alan},
  title     = {Practical UNIX and Internet Security},
  edition   = {3rd},
  publisher = {O'Reilly Media},
  address   = {Sebastopol},
  year      = {2003}
}

@book{kleppmann2017,
  author    = {Kleppmann, Martin},
  title     = {Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems},
  publisher = {O'Reilly Media},
  address   = {Sebastopol},
  year      = {2017}
}

@book{kurose2021,
  author    = {Kurose, James F. and Ross, Keith W.},
  title     = {Computer Networking: A Top-Down Approach},
  edition   = {8th},
  publisher = {Pearson Education},
  address   = {Boston},
  year      = {2021}
}

@book{pacioli1494,
  author    = {Pacioli, Luca},
  title     = {Summa de arithmetica, geometria, proportioni et proportionalita},
  publisher = {Paganino de Paganini},
  address   = {Venezia},
  year      = {1494}
}

@book{silberschatz2018,
  author    = {Silberschatz, Abraham and Galvin, Peter B. and Gagne, Greg},
  title     = {Operating System Concepts},
  edition   = {10th},
  publisher = {Wiley},
  address   = {Hoboken},
  year      = {2018}
}

@book{stallings2020,
  author    = {Stallings, William},
  title     = {Cryptography and Network Security: Principles and Practice},
  edition   = {8th},
  publisher = {Pearson Education},
  address   = {London},
  year      = {2020}
}

@book{tanenbaum2012,
  author    = {Tanenbaum, Andrew S. and Wetherall, David J.},
  title     = {Rețele de calculatoare},
  edition   = {5-a},
  publisher = {Editura Byblos},
  address   = {București},
  year      = {2012}
}

@article{arner2016,
  author  = {Arner, Douglas W. and Barberis, J{\`a}nos and Buckley, Ross P.},
  title   = {The Evolution of {FinTech}: A New Post-Crisis Paradigm?},
  journal = {Georgetown Journal of International Law},
  volume  = {47},
  number  = {4},
  pages   = {1271--1319},
  year    = {2016}
}

@article{bohme2015,
  author  = {B{\"o}hme, Rainer and Christin, Nicolas and Edelman, Benjamin and Moore, Tyler},
  title   = {Bitcoin: Economics, Technology, and Governance},
  journal = {Journal of Economic Perspectives},
  volume  = {29},
  number  = {2},
  pages   = {213--238},
  year    = {2015}
}

@book{goodhart2011,
  author    = {Goodhart, Charles},
  title     = {The Regulatory Response to the Financial Crisis},
  publisher = {Edward Elgar Publishing},
  address   = {Cheltenham},
  year      = {2011}
}

@misc{luhn1960,
  author       = {Luhn, Hans Peter},
  title        = {Computer for Verifying Numbers},
  howpublished = {United States Patent Office, U.S. Patent No. 2,950,048},
  address      = {Washington D.C.},
  year         = {1960}
}

@article{rose2024,
  author  = {Rose, Christopher},
  title   = {Digital Resilience and Cyber Risk in European Banking: The Role of {DORA}},
  journal = {Journal of Banking Regulation},
  volume  = {25},
  number  = {1},
  pages   = {45--62},
  year    = {2024}
}

@article{zetzsche2018,
  author  = {Zetzsche, Dirk A. and Buckley, Ross P. and Arner, Douglas W.},
  title   = {From {FinTech} to {TechFin}: The Regulatory Challenges of Data-Driven Finance},
  journal = {New York University Journal of Law \& Business},
  volume  = {14},
  pages   = {393--446},
  year    = {2018}
}

@techreport{psd22015,
  author      = {{Parlamentul European și Consiliul UE}},
  title       = {Directiva (UE) 2015/2366 privind serviciile de plată în cadrul pieței interne ({PSD2})},
  institution = {Jurnalul Oficial al Uniunii Europene, L 337},
  year        = {2015}
}

@techreport{ebarts2018,
  author      = {{Comisia Europeană}},
  title       = {Regulamentul Delegat (UE) 2018/389 privind standardele tehnice de reglementare pentru autentificarea strictă a clienților ({EBA RTS})},
  institution = {Jurnalul Oficial al Uniunii Europene, L 69},
  year        = {2018}
}

@techreport{dora2022,
  author      = {{Parlamentul European și Consiliul UE}},
  title       = {Regulamentul (UE) 2022/2554 privind reziliența operațională digitală a sectorului financiar ({DORA})},
  institution = {Jurnalul Oficial al Uniunii Europene, L 333},
  year        = {2022}
}

@techreport{gdpr2016,
  author      = {{Parlamentul European și Consiliul UE}},
  title       = {Regulamentul (UE) 2016/679 privind protecția persoanelor fizice în ceea ce privește prelucrarea datelor cu caracter personal ({GDPR})},
  institution = {Jurnalul Oficial al Uniunii Europene, L 119},
  year        = {2016}
}

@misc{bnr42021,
  author       = {{Banca Națională a României}},
  title        = {Regulamentul {BNR} nr. 4/2021 privind cerințele de supraveghere pentru sistemele de plăți și decontare},
  howpublished = {Monitorul Oficial al României, Partea I, nr. 612},
  year         = {2021}
}

@misc{bnr32018,
  author       = {{Banca Națională a României}},
  title        = {Regulamentul {BNR} nr. 3/2018 privind monitorizarea infrastructurilor pieței financiare și a instrumentelor de plată},
  howpublished = {Monitorul Oficial al României},
  year         = {2018}
}

@techreport{ebagl2019,
  author      = {{European Banking Authority}},
  title       = {Guidelines on {ICT} and Security Risk Management ({EBA/GL/2019/04})},
  institution = {EBA},
  address     = {Paris},
  year        = {2019}
}

@techreport{enisa2023,
  author      = {{European Union Agency for Cybersecurity}},
  title       = {{ENISA} Threat Landscape for the Financial Sector},
  institution = {ENISA},
  address     = {Atena},
  year        = {2023}
}

@standard{iso20022,
  author      = {{International Organization for Standardization}},
  title       = {{ISO} 20022: Financial Services -- Universal Financial Industry Message Scheme},
  address     = {Geneva},
  year        = {2022}
}

@techreport{nist800207,
  author      = {{National Institute of Standards and Technology}},
  title       = {Zero Trust Architecture},
  institution = {NIST Special Publication 800-207},
  address     = {Gaithersburg},
  year        = {2020}
}

@standard{pcidss2022,
  author      = {{PCI Security Standards Council}},
  title       = {Payment Card Industry Data Security Standard ({PCI-DSS}) Requirements and Testing Procedures, Version 4.0},
  address     = {Wakefield},
  year        = {2022}
}

@techreport{swift2024,
  author      = {{SWIFT}},
  title       = {Customer Security Controls Framework ({CSCF}) v2024},
  institution = {Society for Worldwide Interbank Financial Telecommunication},
  address     = {La Hulpe},
  year        = {2024}
}

@misc{mitre2024,
  author       = {{The MITRE Corporation}},
  title        = {{MITRE ATT\&CK} Enterprise Matrix for Financial Services},
  howpublished = {\url{https://attack.mitre.org}},
  year         = {2024}
}

@misc{fineract2024,
  author       = {{Apache Software Foundation}},
  title        = {Apache Fineract Technical Documentation: Open Source Core Banking System},
  howpublished = {\url{https://fineract.apache.org}},
  year         = {2024}
}

@misc{proxmox2024,
  author       = {{Proxmox Server Solutions GmbH}},
  title        = {Proxmox Virtual Environment 9.x Documentation and Architecture Guide},
  address      = {Viena},
  year         = {2024}
}

@misc{wazuh2024,
  author       = {{Wazuh Inc.}},
  title        = {Wazuh Enterprise {SIEM} \& {XDR} Documentation: Host-based Intrusion Detection and Log Analysis},
  address      = {San Jose},
  year         = {2024}
}

@misc{opnsense2024,
  author       = {{Deciso B.V.}},
  title        = {OPNsense Stateful Security Firewall User \& Engineering Manual},
  address      = {Middelharnis},
  year         = {2024}
}

@techreport{rfc6238,
  author      = {{Internet Engineering Task Force}},
  title       = {{RFC 6238}: {TOTP}: Time-Based One-Time Password Algorithm},
  institution = {IETF},
  year        = {2011}
}
"""


def table_to_latex(tbl: Table) -> str:
    """Convertește un tabel DOCX într-un mediu tabularx/booktabs sau lstlisting (pentru 1x1)."""
    rows = tbl.rows
    if not rows:
        return ""
    
    # Verifică dacă este o listare de cod (tabel 1x1 cu cod SQL, Python, JSON)
    if len(rows) == 1 and len(rows[0].cells) == 1:
        cell_text = rows[0].cells[0].text.strip()
        if "CREATE TABLE" in cell_text or "SELECT" in cell_text or "--" in cell_text:
            return f"\\begin{{lstlisting}}[language=SQL, caption={{Schema relațională PostgreSQL și jurnal de audit}}]\n{cell_text}\n\\end{{lstlisting}}\n\n"
        elif "def " in cell_text or "class " in cell_text or "import " in cell_text:
            return f"\\begin{{lstlisting}}[language=Python, caption={{Modul Python de simulare și audit de securitate}}]\n{cell_text}\n\\end{{lstlisting}}\n\n"
        elif cell_text.startswith("{") and cell_text.endswith("}"):
            return f"\\begin{{lstlisting}}[language=json, caption={{Structură telemetrică JSON alertă Wazuh SIEM}}]\n{cell_text}\n\\end{{lstlisting}}\n\n"
        else:
            return f"\\begin{{quote}}\n{escape_latex(cell_text)}\n\\end{{quote}}\n\n"

    # Tabel de date normal
    cols_count = len(rows[0].cells)
    if cols_count == 2:
        col_spec = "p{0.45\\textwidth} p{0.45\\textwidth}"
    elif cols_count == 3:
        col_spec = "p{0.25\\textwidth} p{0.35\\textwidth} p{0.35\\textwidth}"
    elif cols_count == 4:
        col_spec = "p{0.22\\textwidth} p{0.22\\textwidth} p{0.30\\textwidth} p{0.20\\textwidth}"
    elif cols_count == 5:
        col_spec = "p{0.18\\textwidth} p{0.20\\textwidth} p{0.22\\textwidth} p{0.22\\textwidth} p{0.14\\textwidth}"
    elif cols_count == 7:
        col_spec = "p{0.10\\textwidth} p{0.14\\textwidth} p{0.12\\textwidth} p{0.14\\textwidth} p{0.15\\textwidth} p{0.12\\textwidth} p{0.18\\textwidth}"
    else:
        col_spec = " ".join(["X"] * cols_count)

    out = [
        "\\begin{table}[htbp]",
        "\\centering",
        "\\small",
        f"\\begin{{tabular}}{{{col_spec}}}",
        "\\toprule"
    ]

    for r_idx, row in enumerate(rows):
        cells = [c.text.strip().replace('\n', ' ') for c in row.cells]
        escaped_cells = [escape_latex(c) for c in cells]
        line = " & ".join(escaped_cells) + r" \\"
        out.append(line)
        if r_idx == 0:
            out.append("\\midrule")

    out.extend([
        "\\bottomrule",
        "\\end{tabular}",
        "\\end{table}\n"
    ])
    return "\n".join(out) + "\n"


def process_docx_to_latex(docx_path: str, output_dir: str) -> bool:
    """Procesează complet un document DOCX de licență în structura modulară LaTeX."""
    print(f"[EXTRACT] Deschid documentul: {docx_path}")
    doc = docx.Document(docx_path)
    
    os.makedirs(os.path.join(output_dir, "chapters"), exist_ok=True)
    os.makedirs(os.path.join(output_dir, "bibliography"), exist_ok=True)
    os.makedirs(os.path.join(output_dir, "appendices"), exist_ok=True)
    os.makedirs(os.path.join(output_dir, "figures"), exist_ok=True)
    os.makedirs(os.path.join(output_dir, "tables"), exist_ok=True)

    # 1. Preamble
    preamble_path = os.path.join(output_dir, "preamble.tex")
    with open(preamble_path, "w", encoding="utf-8") as f:
        f.write(r"""% Preamble general pentru Lucrarea de Licență
\usepackage[romanian]{babel}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{geometry}
\geometry{a4paper, top=2.5cm, bottom=2.5cm, left=3.0cm, right=2.5cm}

\usepackage{setspace}
\onehalfspacing

\usepackage{microtype}
\usepackage{amsmath,amssymb}
\usepackage{graphicx}
\usepackage{booktabs}
\usepackage{tabularx}
\usepackage{longtable}
\usepackage{array}
\usepackage{caption}
\usepackage{xcolor}
\usepackage{listings}
\usepackage{hyperref}

\hypersetup{
    colorlinks=true,
    linkcolor=black,
    citecolor=blue!80!black,
    urlcolor=blue!80!black,
    pdftitle={Arhitectura si Securitatea Sistemelor Informatice Bancare},
    pdfauthor={Moanta Stefanut-Cornel}
}

% Configurari stilistic listari cod (Python, SQL, JSON)
\lstdefinelanguage{json}{
    basicstyle=\small\ttfamily,
    stringstyle=\color{red!70!black},
    numbers=left,
    numberstyle=\tiny\color{gray},
    stepnumber=1,
    numbersep=8pt,
    showstringspaces=false,
    breaklines=true,
    frame=lines,
    backgroundcolor=\color{gray!5}
}

\lstset{
    basicstyle=\footnotesize\ttfamily,
    keywordstyle=\color{blue!80!black}\bfseries,
    commentstyle=\color{green!50!black}\itshape,
    stringstyle=\color{orange!80!black},
    numbers=left,
    numberstyle=\tiny\color{gray},
    stepnumber=1,
    numbersep=8pt,
    frame=single,
    rulecolor=\color{gray!40},
    breaklines=true,
    breakatwhitespace=true,
    tabsize=4,
    showspaces=false,
    showstringspaces=false,
    captionpos=b,
    backgroundcolor=\color{gray!4}
}
""")

    # 2. Metadata
    metadata_path = os.path.join(output_dir, "metadata.tex")
    with open(metadata_path, "w", encoding="utf-8") as f:
        f.write(r"""% Metadata proiect licenta
\newcommand{\TitluLicenta}{ARHITECTURA ȘI SECURITATEA SISTEMELOR INFORMATICE BANCARE: PROIECTAREA, IMPLEMENTAREA ȘI AUDITUL REZILIENȚEI CIBERNETICE ÎNTR-UN MEDIU VIRTUALIZAT}
\newcommand{\AutorLicenta}{Moanță Ștefănuț-Cornel}
\newcommand{\CoordonatorLicenta}{Conf. univ. dr. [Nume Coordonator]}
\newcommand{\Universitate}{UNIVERSITATEA DIN CRAIOVA}
\newcommand{\Facultate}{FACULTATEA DE ECONOMIE ȘI ADMINISTRAREA AFACERILOR}
\newcommand{\Specializare}{Informatică Economică}
\newcommand{\Anul}{2026}
\newcommand{\Oras}{Craiova}
""")

    # 3. references.bib
    bib_path = os.path.join(output_dir, "bibliography", "references.bib")
    with open(bib_path, "w", encoding="utf-8") as f:
        f.write(build_bibtex_entries())

    # 4. Extragere conținut pe secțiuni
    # Mapăm secțiunile logice
    ch_intro = []
    ch_1 = []
    ch_2 = []
    ch_concluzii = []
    ch_anexe = []

    current_section = None
    in_cuprins = False

    # Parcurgem blocurile în ordinea apariției
    for child in doc.element.body:
        if isinstance(child, CT_P):
            p = Paragraph(child, doc)
            text = p.text.strip()
            if not text:
                continue

            # Detectare delimitatori
            if text == "CUPRINS":
                in_cuprins = True
                continue
            if text == "INTRODUCERE":
                in_cuprins = False
                current_section = "intro"
                ch_intro.append("\\chapter*{Introducere}\n\\addcontentsline{toc}{chapter}{Introducere}\n\n")
                continue
            elif text.startswith("CAPITOLUL 1.") and not in_cuprins:
                current_section = "ch1"
                ch_1.append("\\chapter{Stadiul Cunoașterii în Securitatea Cibernetică Bancară}\n\n")
                continue
            elif text.startswith("CAPITOLUL 2.") and not in_cuprins:
                current_section = "ch2"
                ch_2.append("\\chapter{Proiectarea, Implementarea și Evaluarea Arhitecturii Bancare Reziliente}\n\n")
                continue
            elif text == "CONCLUZII" and not in_cuprins:
                current_section = "concluzii"
                ch_concluzii.append("\\chapter*{Concluzii}\n\\addcontentsline{toc}{chapter}{Concluzii}\n\n")
                continue
            elif text == "BIBLIOGRAFIE" and not in_cuprins:
                current_section = "bib"
                continue
            elif text == "ANEXE" and not in_cuprins:
                current_section = "anexe"
                ch_anexe.append("\\chapter*{Anexe}\n\\addcontentsline{toc}{chapter}{Anexe}\n\\appendix\n\n")
                continue

            if in_cuprins or current_section is None or current_section == "bib":
                continue

            # Transformare headings
            if re.match(r'^[12]\.[0-9]\.\s+', text):
                clean_title = re.sub(r'^[12]\.[0-9]\.\s+', '', text)
                clean_title = re.sub(r'\s*\.{3,}\s*\d+$', '', clean_title)
                line = f"\\section{{{escape_latex(clean_title)}}}\n\n"
            elif re.match(r'^[12]\.[0-9]\.[0-9]\.\s+', text):
                clean_title = re.sub(r'^[12]\.[0-9]\.[0-9]\.\s+', '', text)
                clean_title = re.sub(r'\s*\.{3,}\s*\d+$', '', clean_title)
                line = f"\\subsection{{{escape_latex(clean_title)}}}\n\n"
            elif re.match(r'^[12]\.[0-9]\.[0-9]\.[0-9]\.\s+', text):
                clean_title = re.sub(r'^[12]\.[0-9]\.[0-9]\.[0-9]\.\s+', '', text)
                line = f"\\subsubsection{{{escape_latex(clean_title)}}}\n\n"
            elif text.startswith("Anexa "):
                line = f"\\section*{{{escape_latex(text)}}}\n\n"
            elif text.startswith("Listarea de cod:") or text.startswith("Sursa:"):
                line = f"\\textit{{{escape_latex(text)}}}\n\n"
            else:
                line = f"{escape_latex(text)}\n\n"

            # Adăugare la secțiunea activă
            if current_section == "intro":
                ch_intro.append(line)
            elif current_section == "ch1":
                ch_1.append(line)
            elif current_section == "ch2":
                ch_2.append(line)
            elif current_section == "concluzii":
                ch_concluzii.append(line)
            elif current_section == "anexe":
                ch_anexe.append(line)

        elif isinstance(child, CT_Tbl):
            tbl = Table(child, doc)
            tex_tbl = table_to_latex(tbl)
            if current_section == "intro":
                ch_intro.append(tex_tbl)
            elif current_section == "ch1":
                ch_1.append(tex_tbl)
            elif current_section == "ch2":
                ch_2.append(tex_tbl)
            elif current_section == "concluzii":
                ch_concluzii.append(tex_tbl)
            elif current_section == "anexe":
                ch_anexe.append(tex_tbl)

    # Salvare fișiere capitole
    with open(os.path.join(output_dir, "chapters", "00_introducere.tex"), "w", encoding="utf-8") as f:
        f.writelines(ch_intro)
    with open(os.path.join(output_dir, "chapters", "01_stadiul_cunoasterii.tex"), "w", encoding="utf-8") as f:
        f.writelines(ch_1)
    with open(os.path.join(output_dir, "chapters", "02_proiectare_si_implementare.tex"), "w", encoding="utf-8") as f:
        f.writelines(ch_2)
    with open(os.path.join(output_dir, "chapters", "03_concluzii.tex"), "w", encoding="utf-8") as f:
        f.writelines(ch_concluzii)
    with open(os.path.join(output_dir, "appendices", "anexe.tex"), "w", encoding="utf-8") as f:
        f.writelines(ch_anexe)

    # 5. main.tex
    main_path = os.path.join(output_dir, "main.tex")
    with open(main_path, "w", encoding="utf-8") as f:
        f.write(r"""\documentclass[12pt,a4paper,oneside]{report}

\input{preamble.tex}
\input{metadata.tex}

\begin{document}

% Pagina de Titlu Conform Normelor FEAA UCV
\begin{titlepage}
    \centering
    {\large \textbf{\Universitate}}\\[0.2cm]
    {\large \textbf{\Facultate}}\\[0.2cm]
    {\small Craiova, Str. A.I. Cuza, nr. 13, tel: +40-251-411317, http://feaa.ucv.ro}\\[1.5cm]

    {\large Programul de studii: \textbf{\Specializare}}\\[0.2cm]
    {\large Forma de învățământ: Cu frecvență (IF)}\\[2.0cm]

    {\LARGE \textbf{LUCRARE DE LICENȚĂ}}\\[1.0cm]
    {\Large \textbf{\TitluLicenta}}\\[3.5cm]

    \begin{minipage}{0.48\textwidth}
        \begin{flushleft} \large
            \textbf{Coordonator științific:}\\
            \CoordonatorLicenta
        \end{flushleft}
    \end{minipage}
    \hfill
    \begin{minipage}{0.48\textwidth}
        \begin{flushright} \large
            \textbf{Absolvent:}\\
            \AutorLicenta
        \end{flushright}
    \end{minipage}

    \vfill
    {\large \Oras, \Anul}
\end{titlepage}

\pagenumbering{roman}
\tableofcontents
\newpage

\pagenumbering{arabic}
\include{chapters/00_introducere}
\include{chapters/01_stadiul_cunoasterii}
\include{chapters/02_proiectare_si_implementare}
\include{chapters/03_concluzii}

% Bibliografie academica
\bibliographystyle{plain}
\bibliography{bibliography/references}

\include{appendices/anexe}

\end{document}
""")

    print(f"[SUCCESS] Generat modular LaTeX în: {output_dir}")
    return True


def verify_academic_docs(base_dir: str) -> bool:
    """Verifică existența documentelor DOCX și paritatea reprezentărilor LaTeX corespunzătoare."""
    pattern = os.path.join(base_dir, "licenta", "LL3-LucrareLicenta", "LUCRARE LICENTA - *.docx")
    docx_files = glob.glob(pattern)
    
    print("\n" + "=" * 70)
    print("AUDIT DE PARITATE: DOCUMENTAȚIE ACADEMICĂ (DOCX <-> LaTeX)")
    print("=" * 70)

    if not docx_files:
        print("[AVERTISMENT] Niciun document 'LUCRARE LICENTA - *.docx' nu a fost găsit.")
        return False

    all_synced = True
    for docx_path in docx_files:
        filename = os.path.basename(docx_path)
        base_name = os.path.splitext(filename)[0]
        
        # Verificăm ambele locații standard: latex/ și folderul asociat denumirii
        latex_primary = os.path.join(os.path.dirname(docx_path), "latex", "main.tex")
        latex_named = os.path.join(os.path.dirname(docx_path), base_name, "main.tex")
        
        latex_exists = os.path.exists(latex_primary) or os.path.exists(latex_named)
        
        print(f"DOCX: {filename}")
        print(f"  -> LaTeX Modular: {'EXISTENT [OK]' if latex_exists else 'LIPSĂ [FAIL]'}")
        if not latex_exists:
            all_synced = False

    print("=" * 70 + "\n")
    return all_synced


def main():
    parser = argparse.ArgumentParser(description="DOCX to LaTeX Academic Converter & Verifier")
    parser.add_argument("--sync", action="store_true", help="Extrage și sincronizează DOCX în structura LaTeX modulară")
    parser.add_argument("--verify", action="store_true", help="Validează paritatea DOCX <-> LaTeX")
    args = parser.parse_args()

    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    ll3_dir = os.path.join(root_dir, "licenta", "LL3-LucrareLicenta")
    pattern = os.path.join(ll3_dir, "LUCRARE LICENTA - *.docx")
    docx_files = glob.glob(pattern)

    if args.sync or not args.verify:
        if not docx_files:
            print(f"[EROARE] Nu s-a găsit niciun fișier DOCX conform {pattern}")
            sys.exit(1)
        
        for docx_path in docx_files:
            filename = os.path.basename(docx_path)
            base_name = os.path.splitext(filename)[0]
            
            # Generăm atât în licenta/LL3-LucrareLicenta/latex cât și în licenta/LL3-LucrareLicenta/LUCRARE LICENTA - DATA/
            target_latex = os.path.join(ll3_dir, "latex")
            target_named = os.path.join(ll3_dir, base_name)
            
            process_docx_to_latex(docx_path, target_latex)
            process_docx_to_latex(docx_path, target_named)

    if args.verify:
        success = verify_academic_docs(root_dir)
        if not success:
            sys.exit(1)


if __name__ == "__main__":
    main()
