"""
Modul pentru generarea Paginii de Titlu, Cuprinsului și Introducerii
Lucrare de Licență FEAA UCV - Moanță Ștefănuț-Cornel
"""

import docx
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from thesis_generator.styles import (
    add_chapter_title, add_subchapter_title, add_subsub_title,
    add_body_p, add_bullet_p
)


def build_title_page(doc):
    p1 = doc.add_paragraph()
    p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p1.paragraph_format.space_before = Pt(0)
    p1.paragraph_format.space_after = Pt(2)
    p1.paragraph_format.first_line_indent = Inches(0)
    
    r1 = p1.add_run("R O M Â N I A\nMINISTERUL EDUCAȚIEI\nUNIVERSITATEA DIN CRAIOVA\nFACULTATEA DE ECONOMIE ȘI ADMINISTRAREA AFACERILOR")
    r1.font.name = 'Times New Roman'
    r1.font.size = Pt(13)
    r1.font.bold = True
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(4)
    p_sub.paragraph_format.space_after = Pt(18)
    p_sub.paragraph_format.first_line_indent = Inches(0)
    r_sub = p_sub.add_run("Craiova, Str. A.I. Cuza, nr. 13, 200585, tel/fax: +40-251-411317, http://feaa.ucv.ro")
    r_sub.font.name = 'Times New Roman'
    r_sub.font.size = Pt(9.5)
    r_sub.font.italic = True
    
    p_prog = doc.add_paragraph()
    p_prog.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_prog.paragraph_format.space_before = Pt(14)
    p_prog.paragraph_format.space_after = Pt(36)
    p_prog.paragraph_format.first_line_indent = Inches(0)
    r_prog = p_prog.add_run("Programul de studii: Informatică Economică\nForma de învățământ: Cu frecvență (IF)")
    r_prog.font.name = 'Times New Roman'
    r_prog.font.size = Pt(12)
    r_prog.font.bold = True
    
    p_lic = doc.add_paragraph()
    p_lic.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_lic.paragraph_format.space_before = Pt(18)
    p_lic.paragraph_format.space_after = Pt(18)
    p_lic.paragraph_format.first_line_indent = Inches(0)
    r_lic = p_lic.add_run("LUCRARE DE LICENȚĂ")
    r_lic.font.name = 'Times New Roman'
    r_lic.font.size = Pt(18)
    r_lic.font.bold = True
    
    p_titlu = doc.add_paragraph()
    p_titlu.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_titlu.paragraph_format.space_before = Pt(18)
    p_titlu.paragraph_format.space_after = Pt(72)
    p_titlu.paragraph_format.first_line_indent = Inches(0)
    r_titlu = p_titlu.add_run("ARHITECTURA ȘI SECURITATEA SISTEMELOR INFORMATICE BANCARE:\nPROIECTAREA, IMPLEMENTAREA ȘI AUDITUL REZILIENȚEI CIBERNETICE ÎNTR-UN MEDIU VIRTUALIZAT")
    r_titlu.font.name = 'Times New Roman'
    r_titlu.font.size = Pt(14)
    r_titlu.font.bold = True
    
    # Coordonator și Absolvent (aranjament tabelar invizibil)
    table = doc.add_table(rows=1, cols=2)
    table.autofit = True
    
    cell_coord = table.cell(0, 0)
    p_c = cell_coord.paragraphs[0]
    p_c.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_c.paragraph_format.first_line_indent = Inches(0)
    rc1 = p_c.add_run("Coordonator științific,\n")
    rc1.font.name = 'Times New Roman'
    rc1.font.size = Pt(12)
    rc1.font.bold = True
    rc2 = p_c.add_run("Conf. univ. dr. [Nume Coordonator]")
    rc2.font.name = 'Times New Roman'
    rc2.font.size = Pt(12)
    
    cell_abs = table.cell(0, 1)
    p_a = cell_abs.paragraphs[0]
    p_a.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_a.paragraph_format.first_line_indent = Inches(0)
    ra1 = p_a.add_run("Absolvent,\n")
    ra1.font.name = 'Times New Roman'
    ra1.font.size = Pt(12)
    ra1.font.bold = True
    ra2 = p_a.add_run("Moanță Ștefănuț-Cornel")
    ra2.font.name = 'Times New Roman'
    ra2.font.size = Pt(12)
    
    p_an = doc.add_paragraph()
    p_an.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_an.paragraph_format.space_before = Pt(72)
    p_an.paragraph_format.space_after = Pt(0)
    p_an.paragraph_format.first_line_indent = Inches(0)
    r_an = p_an.add_run("Craiova\n2026")
    r_an.font.name = 'Times New Roman'
    r_an.font.size = Pt(12)
    r_an.font.bold = True
    
    doc.add_page_break()


def build_table_of_contents(doc):
    p_t = doc.add_paragraph()
    p_t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t.paragraph_format.space_before = Pt(12)
    p_t.paragraph_format.space_after = Pt(16)
    p_t.paragraph_format.first_line_indent = Inches(0)
    r_t = p_t.add_run("CUPRINS")
    r_t.font.name = 'Times New Roman'
    r_t.font.size = Pt(14)
    r_t.font.bold = True
    
    toc_items = [
        ("INTRODUCERE", "3"),
        ("CAPITOLUL 1. STADIUL CUNOAȘTERII ÎN SECURITATEA CIBERNETICĂ BANCARĂ", "5"),
        ("1.1. Cadrul de reglementare și conformitate în sectorul bancar european și național", "5"),
        ("    1.1.1. Directiva Revizuită privind Serviciile de Plată (PSD2) și Cerințele EBA RTS", "5"),
        ("    1.1.2. Regulamentul DORA (Digital Operational Resilience Act - UE 2022/2554)", "7"),
        ("    1.1.3. Standardul de Securitate a Datelor din Industria Cardurilor (PCI-DSS v4.0)", "9"),
        ("    1.1.4. Standardul ISO 20022 și Reglementările Băncii Naționale a României (BNR)", "11"),
        ("1.2. Arhitectura sistemelor informatice financiar-bancare", "13"),
        ("    1.2.1. Sistemele de Core-Banking și Registrul General în Partidă Dublă", "13"),
        ("    1.2.2. Porțile de Plată Electronice (Payment Gateways) și Procesarea Tranzacțiilor", "15"),
        ("    1.2.3. Comunicațiile Interbancare și Rețeaua SWIFT", "17"),
        ("1.3. Vectori de atac contemporani și analiza amenințărilor în sectorul bancar", "19"),
        ("    1.3.1. Manipularea Bazelor de Date și Atacurile de tip SQL Injection", "19"),
        ("    1.3.2. Fraudele Tranzacționale: Card Stuffing, Velocity Floods și Credential Stuffing", "21"),
        ("    1.3.3. Mișcarea Laterală, Compromiterea Nodurilor Administrative și Infostealers", "23"),
        ("    1.3.4. Alterarea Mesageriei Financiare și Campaniile Ransomware cu Dublă Extorcare", "25"),
        ("1.4. Principii și mecanisme de securitate defensivă bancară", "27"),
        ("    1.4.1. Paradigma Zero Trust (ZTA) și Principiul Privilegiului Minim (PoLP)", "27"),
        ("    1.4.2. Segmentarea Rețelei, VLAN-uri și Firewalling Stateful cu Inspecție Profundă", "29"),
        ("    1.4.3. Monitorizarea Integrității Datelor și Sistemele HIDS/SIEM (Wazuh)", "31"),
        ("    1.4.4. Bastioane Administrative (Jump-Box) cu Autentificare Ed25519 și MFA", "33"),
        ("CAPITOLUL 2. PROIECTAREA, IMPLEMENTAREA ȘI EVALUAREA ARHITECTURII BANCARE REZILIENTE ÎNTR-UN MEDIU VIRTUALIZAT", "35"),
        ("2.1. Arhitectura generală și topologia laboratorului virtual bancar", "35"),
        ("    2.1.1. Platforma de Virtualizare Proxmox VE 9.2 și Dimensionarea Resurselor", "35"),
        ("    2.1.2. Segmentarea Rețelei prin Firewall OPNsense și Politici Inter-VLAN", "37"),
        ("2.2. Implementarea componentelor bancare fundamentale", "39"),
        ("    2.2.1. Mașina Virtuală Core-Banking Engine (VM 310) și Ledger-ul Criptografic", "39"),
        ("    2.2.2. Mașina Virtuală Financial Database (VM 311) și Motorul de Audit Wazuh", "43"),
        ("    2.2.3. Containerul LXC Payment Gateway & SWIFT Simulator (CT 312)", "47"),
        ("    2.2.4. Mașina Virtuală SWIFT Jump-Box (VM 313) cu Securitate Sporită", "51"),
        ("2.3. Scenarii experimentale de atac, simulare și validare defensivă", "54"),
        ("    2.3.1. Scenariul 1: Linia de Bază Tranzacțională Kiosk/Casierie (T1078)", "54"),
        ("    2.3.2. Scenariul 2: Atac SQL Injection și Alterare de Sold - Balance Tampering (T1190/T1565)", "56"),
        ("    2.3.3. Scenariul 3: Atac de tip Card Stuffing și Velocity Flood pe Poarta de Plăți (T1110)", "59"),
        ("    2.3.4. Scenariul 4: Tentativă de Mișcare Laterală și Eludare Jump-Box (T1021)", "61"),
        ("    2.3.5. Scenariul 5: Falsificarea Mesageriei SWIFT și Coruperea UETR (T1565)", "63"),
        ("2.4. Monitorizarea securității, colectarea telemetriei și corelarea evenimentelor în Wazuh SIEM", "65"),
        ("2.5. Evaluarea performanței, a rezilienței cibernetice și a conformității de reglementare", "69"),
        ("CONCLUZII", "74"),
        ("BIBLIOGRAFIE", "77"),
        ("ANEXE", "81"),
        ("    Anexa A: Schema SQL DDL a Bazei de Date Financiare și a Registrului Contabil", "81"),
        ("    Anexa B: Implementarea Motorului de Verificare a Integrității și Detecție a Manipulării Soldurilor", "84"),
        ("    Anexa C: Jurnalul Telemetric de Securitate și Structura Alertelor Wazuh JSON", "88")
    ]
    
    for title, page in toc_items:
        p = doc.add_paragraph()
        p.paragraph_format.line_spacing = 1.0
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.first_line_indent = Inches(0)
        
        # Formatare diferențiată pentru capitole
        is_main = title.startswith("CAPITOLUL") or title in ["INTRODUCERE", "CONCLUZII", "BIBLIOGRAFIE", "ANEXE"]
        
        r1 = p.add_run(title)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(11) if not is_main else Pt(11.5)
        r1.font.bold = is_main
        
        # Tab leader punctat
        dots_count = max(5, 75 - len(title))
        r_dots = p.add_run(" " + "." * dots_count + " ")
        r_dots.font.name = 'Times New Roman'
        r_dots.font.size = Pt(10)
        r_dots.font.color.rgb = RGBColor(128, 128, 128)
        
        r_page = p.add_run(page)
        r_page.font.name = 'Times New Roman'
        r_page.font.size = Pt(11)
        r_page.font.bold = is_main
        
    doc.add_page_break()


def build_introduction(doc):
    add_chapter_title(doc, "INTRODUCERE")
    
    add_body_p(doc, 
        "Sectorul financiar-bancar traversează în prezent cea mai amplă și accelerată transformare tehnologică din istoria sa modernă. Migrarea accelerată de la modelele bancare tradiționale, bazate pe sucursale fizice și canale de comunicare închise, către ecosisteme financiare digitale descentralizate, platforme de open banking, microservicii în cloud și interfețe de programare a aplicațiilor (API-uri) a redefinit fundamental modul în care instituțiile de credit interacționează cu clienții și cu partenerii de afaceri. Această evoluție a adus beneficii economice substanțiale: tranzacții în timp real, costuri operaționale optimizate, accesibilitate continuă și o eficiență sporită a fluxurilor de capital."
    )
    
    add_body_p(doc, 
        "Totuși, digitalizarea extinsă a condus la o expansiune fără precedent a suprafeței de atac. Pentru entitățile rău-intenționate – variind de la grupări de criminalitate cibernetică organizată motivate financiar, până la actori statali persistenți avansați (APT – Advanced Persistent Threats) – sistemele informatice bancare reprezintă ținta supremă. O breșă de securitate într-o instituție financiară nu produce doar pierderi patrimoniale directe, ci poate declanșa crize de lichiditate, falimente bancare, erodarea ireversibilă a încrederii publice și chiar instabilitate sistemică la nivel macroeconomic. În acest peisaj operațional ostil, abordările convenționale de securitate, bazate exclusiv pe apărarea perimetrică clasică, s-au dovedit complet inadecvate."
    )
    
    add_body_p(doc, 
        "Conștientizând această vulnerabilitate sistemică, organismele internaționale și europene de reglementare au instituit cadre normative extrem de riguroase. Directiva Revizuită privind Serviciile de Plată (PSD2) a impus mecanisme obligatorii de Autentificare Strictă a Clienților (SCA – Strong Customer Authentication) și legături dinamice tranzacționale. Standardul de Securitate a Datelor din Industria Cardurilor de Plată (PCI-DSS v4.0) a stabilit cerințe stricte pentru criptarea și izolarea mediului datelor titularilor de card (CDE). În paralel, noul Regulament European privind Reziliența Operațională Digitală (DORA – Regulamentul UE 2022/2554) obligă instituțiile financiare să demonstreze nu doar existența unor controale defensive, ci capacitatea demonstrabilă de a rezista, de a absorbi șocurile și de a se recupera rapid în urma unor incidente cibernetice disruptive majore."
    )
    
    add_body_p(doc, 
        "Alegerea acestei teme de cercetare este motivată de necesitatea acută de a crea o punte solidă între teoria economică financiar-bancară (evidența contabilă în partidă dublă, decontarea tranzacțiilor, gestiunea riscurilor) și ingineria sistemelor informatice securizate (rețele de calculatoare, sisteme de operare întărite, baze de date tranzacționale și securitate ofensivă/defensivă). În cadrul programului de studii Informatică Economică din cadrul Facultății de Economie și Administrarea Afacerilor a Universității din Craiova, înțelegerea mecanismelor interne care garantează integritatea și confidențialitatea activelor digitale reprezintă o competență fundamentală pentru formarea specialiștilor capabili să gestioneze riscul operațional modern."
    )
    
    add_body_p(doc, 
        "Obiectivul principal al prezentei lucrări de licență constă în proiectarea, implementarea completă, testarea experimentală și auditarea unei arhitecturi informatice bancare reziliente, complet virtualizate într-un laborator de cercetare avansat. Pentru îndeplinirea acestui deziderat general, au fost stabilite următoarele obiective specifice de cercetare:"
    )
    
    add_bullet_p(doc, "Obiectivul 1:", "Analiza critică a stadiului actual al cunoașterii privind securitatea cibernetică în mediul bancar, investigând cerințele de conformitate (DORA, PSD2 RTS, PCI-DSS v4.0, ISO 20022), principiile contabile ale sistemelor Core-Banking și vectorii de atac contemporani.")
    add_bullet_p(doc, "Obiectivul 2:", "Proiectarea unei topologii de laborator complet virtualizate pe platforma de hypervisor bare-metal Proxmox VE 9.2, bazată pe segmentare logică de rețea prin VLAN-uri (Management, Services, CyberLab) și firewalling perimetral de ultimă generație prin OPNsense.")
    add_bullet_p(doc, "Obiectivul 3:", "Implementarea practică a celor patru active bancare fundamentale: un motor central de Core-Banking (VM 310) inspirat de standardul deschis Apache Fineract cu registru contabil în partidă dublă și înlănțuire criptografică SHA-256 a tranzacțiilor; un server de bază de date relațională (VM 311 - PostgreSQL) cu tabele de audit nealterabile; o poartă de plăți (CT 312) cu validare Luhn, verificare anti-fraudă și suport pentru schemele de mesagerie SWIFT MT103 și ISO 20022 pacs.008; precum și un bastion de acces securizat (VM 313 - Jump-Box) protejat prin chei criptografice Ed25519 și autentificare cu factori multipli (MFA).")
    add_bullet_p(doc, "Obiectivul 4:", "Dezvoltarea și executarea unei suite automatizate de simulare a atacurilor cibernetice (Red Team vs. Blue Team) acoperind 5 scenarii critice: de la tranzacționarea nominală de referință, la atacuri de tip SQL Injection și alterare directă de sold (Balance Tampering), atacuri de tip Card Stuffing pe fluxul de autorizare, mișcare laterală și eludare a bastionului administrativ, până la coruperea structurilor de mesagerie interbancară.")
    add_bullet_p(doc, "Obiectivul 5:", "Integrarea unui sistem de monitorizare a integrității și detecție a intruziunilor (HIDS/SIEM - Wazuh), configurarea unor reguli analitice de corelare în timp real capabile să identifice decalajele contabile și maparea integrală a incidentelor pe matricea internațională MITRE ATT&CK for Financial Services.")
    add_bullet_p(doc, "Obiectivul 6:", "Evaluarea riguroasă a performanței operaționale, a rezilienței la incidente și a gradului de conformitate de reglementare obținut, evidențiind valoarea adăugată a cercetării și impactul economic direct asupra diminuării pierderilor operaționale din fraude.")
    
    add_body_p(doc, 
        "Metodologia de cercetare adoptată îmbină analiza teoretică și normativă a literaturii de specialitate cu o abordare cantitativă experimentală. Întreaga arhitectură a fost instanțiată pe nodul fizic de calcul x86_64 bare-metal al infrastructurii de laborator (procesor Intel Core i3-10100F cu 4 nuclee fizice / 8 fire de execuție la 4.30 GHz Turbo, 12 GB memorie RAM DDR4 completată cu subsistem dinamic ZRAM de 6.0 GB lz4 și subsistem de stocare de 512 GB SSD LVM-Thin sub Proxmox VE 9.2). Toate componentele software au fost dezvoltate în limbajul Python 3, utilizând cadre de lucru moderne (FastAPI, SQLite/PostgreSQL, hashlib) și au fost supuse unor teste de penetrare automate riguroase, asigurând reproductibilitatea completă a rezultatelor obținute."
    )
    
    add_body_p(doc, 
        "Lucrarea este structurată riguros pe două capitole principale, conform ghidului de elaborare al facultății. Primul capitol, „Stadiul cunoașterii în securitatea cibernetică bancară”, sintetizează fundamentele legislative, arhitecturale, vulnerabilitățile curente și paradigmele defensive de ultimă generație. Al doilea capitol, „Proiectarea, implementarea și evaluarea arhitecturii bancare reziliente într-un mediu virtualizat”, constituie contribuția originală extinsă a autorului, detaliind construcția mediului experimental, codul sursă al serviciilor bancare, derularea atacurilor controlate, telemetria sistemului SIEM și validarea ipotezelor de cercetare. Lucrarea se încheie cu o secțiune de concluzii, bibliografia consultată și anexe tehnice cuprinzătoare."
    )
    
    doc.add_page_break()
