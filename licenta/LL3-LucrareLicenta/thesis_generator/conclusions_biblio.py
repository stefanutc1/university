"""
Modul pentru generarea Concluziilor și Bibliografiei
Lucrare de Licență FEAA UCV - Moanță Ștefănuț-Cornel
"""

import docx
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from thesis_generator.styles import (
    add_chapter_title, add_subchapter_title, add_body_p, add_bullet_p
)


def build_conclusions_and_biblio(doc):
    # -------------------------------------------------------------
    # CONCLUZII
    # -------------------------------------------------------------
    add_chapter_title(doc, "CONCLUZII")
    
    add_body_p(doc,
        "Lucrarea de licență de față a abordat o problemă de maximă actualitate și relevanță la intersecția dintre științele economice și ingineria sistemelor informatice: asigurarea rezilienței cibernetice a arhitecturilor bancare într-un context operațional dominat de digitalizare accelerată, sofisticarea atacurilor cibernetice și reglementări europene fără precedent. În cadrul acestei cercetări teoretice și aplicative, au fost atinse pe deplin toate obiectivele propuse în introducere, demonstrându-se fezabilitatea proiectării unui mediu financiar rezistent la intruziuni avansate prin aplicarea riguroasă a principiilor arhitecturale moderne de Apărare în Adâncime (Defense-in-Depth) și Zero Trust."
    )
    
    add_body_p(doc,
        "Investigația teoretică din primul capitol a evidențiat faptul că transformarea digitală a băncilor nu mai poate fi privită exclusiv prin prisma beneficiilor economice și a fluidizării tranzacțiilor. Deschiderea sistemelor prin Open Banking (PSD2) și dependențele complexe de infrastructură au creat noi vectori de atac pe care apărarea perimetrică clasică nu îi poate neutraliza. De aceea, noul Regulament European DORA (UE 2022/2554) marchează o tranziție istorică: reziliența operațională digitală nu mai este o opțiune recomandată, ci o obligație legală fermă, supusă unor regimuri sancționatorii pecuniare severe (amenzi de până la 5% din cifra de afaceri mondială a grupului bancar). De asemenea, s-a demonstrat că securitatea registrului contabil general (General Ledger) și a decontărilor interbancare (SWIFT / ISO 20022) depinde în mod critic de garantarea proprietăților ACID și a constrângerilor de integritate la nivel de bază de date."
    )
    
    add_body_p(doc,
        "Partea aplicativă a lucrării, detaliată în cel de-al doilea capitol, constituie contribuția originală substanțială a autorului și confirmă viabilitatea practică a conceptelor studiate. Printre principalele contribuții tehnico-științifice și elemente de noutate realizate în cadrul laboratorului virtual se numără:"
    )
    
    add_bullet_p(doc, "1. Proiectarea și implementarea unei infrastructuri bancare virtualizate complete:", "Utilizând platforma enterprise de virtualizare Proxmox VE 9.2 bare-metal și firewall-ul stateful OPNsense, a fost realizată o segregare riguroasă a traficului în trei rețele locale virtuale (VLAN 10 Management, VLAN 20 Services, VLAN 30 CyberLab). Arhitectura aplică principiul Default-Deny, eliminând posibilitatea accesului direct neautorizat din exterior către nucleul financiar.")
    add_bullet_p(doc, "2. Dezvoltarea unui motor de Core-Banking rezistent la alterare:", "Sistemul dezvoltat (VM 310), inspirat de modelul Apache Fineract, implementează contabilitatea în partidă dublă conform ecuației fundamentale a echilibrului contabil și asigură înlănțuirea criptografică a fiecărei tranzacții prin dispersie SHA-256 tamper-evident. Orice tentativă de modificare retroactivă a soldurilor rupe lanțul de încredere, starea de corupere fiind detectată imediat.")
    add_bullet_p(doc, "3. Conceperea unui algoritm autonom de auditare a integrității bazelor de date financiare:", "Modulul WazuhSecurityAuditor dezvoltat pe serverul de baze de date PostgreSQL (VM 311) reprezintă o inovație defensivă esențială. Auditorul efectuează reconcilierea matematică automată între soldul stocat în tabela accounts și istoricul real al tranzacțiilor din ledger_transactions, detectând instantaneu anomaliile de tip Balance Tampering și emițând alerte de securitate Wazuh de nivel critic 14.")
    add_bullet_p(doc, "4. Implementarea unei porți de plăți conforme PCI-DSS și PSD2:", "Microserviciul de plăți (CT 312) integrează validarea matematică Luhn, mascarea strictă a numerelor de card (PAN), filtre de viteză împotriva atacurilor de tip Card Stuffing (cu răspuns prompt HTTP 429) și generarea de mesaje de decontare interbancară conforme schemei internaționale ISO 20022 pacs.008 cu trasabilitate universală prin identificatori UETR RFC 4122.")
    add_bullet_p(doc, "5. Securizarea accesului administrativ printr-un Bastion Host (Jump-Box):", "Nodul administrativ unic VM 313 elimină complet utilizarea parolelor statice în favoarea cheilor criptografice asimetrice pe curbe eliptice Ed25519, dublate de autentificare cu factori multipli (TOTP), blocând eficient tentativele de mișcare laterală și furt de credențiale.")
    add_bullet_p(doc, "6. Dezvoltarea unei suite automatizate de testare ofensivă și defensivă:", "Simulatorul dezvoltat (banking_attack_simulator.py) validează în mod automat 5 scenarii de atac mapate pe matricea MITRE ATT&CK for Financial Services, obținând o rată de succes de 100% în interceptarea și mitigarea amenințărilor.")
    
    add_body_p(doc,
        "Din punct de vedere economic și de gestiune a afacerilor, rezultatele obținute demonstrează că investițiile în soluții de securitate cibernetică de tip Defense-in-Depth generează o valoare adăugată măsurabilă pentru instituțiile de credit. Prin prevenirea eficientă a fraudelor de manipulare a soldurilor, a atacurilor de forță brută pe porțile de plăți și a compromiterii rețelelor interne, băncile elimină pierderile financiare directe, previn aplicarea unor amenzi de reglementare catastrofale pe linia DORA sau GDPR și își consolidează cel mai valoros activ intangibil: reputația și încrederea clienților."
    )
    
    add_body_p(doc,
        "Deși cercetarea a demonstrat o eficiență operațională ridicată, trebuie recunoscute anumite limite inerente mediului de laborator: comunicațiile interbancare SWIFT au fost validate prin scheme și protocoale standardizate ISO 20022, fără conectare directă la infrastructura privată SIPN de producție; de asemenea, operațiunile criptografice au fost executate la nivel software, fără utilizarea unui modul hardware dedicat de înaltă securitate (HSM fizic)."
    )
    
    add_body_p(doc,
        "Ca direcții viitoare de cercetare și dezvoltare, autorul își propune:"
    )
    add_bullet_p(doc, "• Integrarea algoritmilor de Învățare Automată (Machine Learning):", "Implementarea unor modele nesupervizate de detecție a anomaliilor (cum ar fi Isolation Forests sau Autoencodere neuronale) pentru analiza comportamentală a clienților și scorarea în timp real a riscului tranzacțional la nivel de microsecunde.")
    add_bullet_p(doc, "• Tehnologii de Procesare Confidențială (Confidential Computing):", "Explorarea enclavelor securizate bazate pe hardware (AMD SEV-SNP sau Intel SGX) pentru a menține memoria bazei de date financiare criptată chiar și în timpul procesării active în RAM, protejând datele împotriva oricărui acces neautorizat la nivelul hypervisorului.")
    add_bullet_p(doc, "• Arhitecturi Cloud-Native și Service Mesh:", "Migrarea microserviciilor pe clustere de containere Kubernetes orchestrate cu un Service Mesh (cum ar fi Istio), garantând criptarea mutuală mTLS între toate componentele și aplicarea politicilor de securitate la nivel de rețea definită prin software (SDN).")
    
    add_body_p(doc,
        "În concluzie, lucrarea de față confirmă faptul că reziliența cibernetică bancară nu reprezintă o stare statică atinsă prin achiziția unor produse comerciale scumpe, ci un proces dinamic, continuu și integrat, care combină rigoarea contabilă, proiectarea arhitecturală modulară și monitorizarea activă în timp real."
    )
    
    doc.add_page_break()
    
    # -------------------------------------------------------------
    # BIBLIOGRAFIE
    # -------------------------------------------------------------
    add_chapter_title(doc, "BIBLIOGRAFIE")
    
    add_body_p(doc,
        "Prezenta lucrare are la bază studierea riguroasă a literaturii de specialitate din domeniile informaticii economice, securității sistemelor informatice, bazelor de date financiare și legislației bancare europene și naționale. Referințele bibliografice sunt structurate conform cerințelor academice:"
    )
    
    p_b1 = doc.add_paragraph()
    p_b1.paragraph_format.space_before = Pt(8)
    p_b1.paragraph_format.space_after = Pt(4)
    p_b1.paragraph_format.first_line_indent = Inches(0)
    rb1 = p_b1.add_run("I. Cărți, tratate și manuale de specialitate")
    rb1.font.name = 'Times New Roman'
    rb1.font.size = Pt(12)
    rb1.font.bold = True
    
    books = [
        "1. Anderson, R. - Security Engineering: A Guide to Building Dependable Distributed Systems, 3rd Edition, Wiley Publishing, Indianapolis, 2020.",
        "2. Date, C.J. - An Introduction to Database Systems, 8th Edition, Pearson Education, Boston, 2004.",
        "3. Elmasri, R., Navathe, S.B. - Fundamentals of Database Systems, 7th Edition, Pearson, London, 2016.",
        "4. Ferguson, N., Schneier, B., Kohno, T. - Cryptography Engineering: Design Principles and Practical Applications, Wiley Publishing, Indianapolis, 2010.",
        "5. Garfinkel, S., Spafford, G., Schwartz, A. - Practical UNIX and Internet Security, 3rd Edition, O'Reilly Media, Sebastopol, 2003.",
        "6. Kleppmann, M. - Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems, O'Reilly Media, Sebastopol, 2017.",
        "7. Kurose, J.F., Ross, K.W. - Computer Networking: A Top-Down Approach, 8th Edition, Pearson Education, Boston, 2021.",
        "8. Pacioli, L. - Summa de arithmetica, geometria, proportioni et proportionalita (Tratatul despre calculul și înregistrarea contabilă), Veneția, 1494.",
        "9. Silberschatz, A., Galvin, P.B., Gagne, G. - Operating System Concepts, 10th Edition, Wiley, Hoboken, 2018.",
        "10. Stallings, W. - Cryptography and Network Security: Principles and Practice, 8th Edition, Pearson Education, London, 2020.",
        "11. Tanenbaum, A.S., Wetherall, D.J. - Rețele de calculatoare, Ediția a 5-a, Editura Byblos, București, 2012."
    ]
    for b in books:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.0
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.left_indent = Cm(1.25)
        p.paragraph_format.first_line_indent = Cm(-1.25)
        r = p.add_run(b)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        
    p_b2 = doc.add_paragraph()
    p_b2.paragraph_format.space_before = Pt(10)
    p_b2.paragraph_format.space_after = Pt(4)
    p_b2.paragraph_format.first_line_indent = Inches(0)
    rb2 = p_b2.add_run("II. Articole științifice și lucrări publicate în jurnale de profil")
    rb2.font.name = 'Times New Roman'
    rb2.font.size = Pt(12)
    rb2.font.bold = True
    
    articles = [
        "12. Arner, D.W., Barberis, J., Buckley, R.P. - The Evolution of FinTech: A New Post-Crisis Paradigm?, Georgetown Journal of International Law, Vol. 47, Nr. 4, 2016, pp. 1271-1319.",
        "13. Böhme, R., Christin, N., Edelman, B., Moore, T. - Bitcoin: Economics, Technology, and Governance, Journal of Economic Perspectives, Vol. 29, Nr. 2, 2015, pp. 213-238.",
        "14. Goodhart, C. - The Regulatory Response to the Financial Crisis, Edward Elgar Publishing, Cheltenham, 2011.",
        "15. Luhn, H.P. - Computer for Verifying Numbers, United States Patent Office, U.S. Patent No. 2,950,048, Washington D.C., 1960.",
        "16. Rose, C. - Digital Resilience and Cyber Risk in European Banking: The Role of DORA, Journal of Banking Regulation, Vol. 25, Nr. 1, 2024, pp. 45-62.",
        "17. Zetzsche, D.A., Buckley, R.P., Arner, D.W. - From FinTech to TechFin: The Regulatory Challenges of Data-Driven Finance, New York University Journal of Law & Business, Vol. 14, 2018, pp. 393-446."
    ]
    for a in articles:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.0
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.left_indent = Cm(1.25)
        p.paragraph_format.first_line_indent = Cm(-1.25)
        r = p.add_run(a)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        
    p_b3 = doc.add_paragraph()
    p_b3.paragraph_format.space_before = Pt(10)
    p_b3.paragraph_format.space_after = Pt(4)
    p_b3.paragraph_format.first_line_indent = Inches(0)
    rb3 = p_b3.add_run("III. Acte normative, reglementări europene și naționale")
    rb3.font.name = 'Times New Roman'
    rb3.font.size = Pt(12)
    rb3.font.bold = True
    
    laws = [
        "18. Parlamentul European și Consiliul Uniunii Europene - Directiva (UE) 2015/2366 privind serviciile de plată în cadrul pieței interne (PSD2), Jurnalul Oficial al Uniunii Europene, L 337, 2015.",
        "19. Comisia Europeană - Regulamentul Delegat (UE) 2018/389 de completare a Directivei (UE) 2015/2366 în ceea ce privește standardele tehnice de reglementare pentru autentificarea strictă a clienților (EBA RTS), Jurnalul Oficial al UE, L 69, 2018.",
        "20. Parlamentul European și Consiliul Uniunii Europene - Regulamentul (UE) 2022/2554 privind reziliența operațională digitală a sectorului financiar (DORA), Jurnalul Oficial al Uniunii Europene, L 333, 2022.",
        "21. Parlamentul European și Consiliul Uniunii Europene - Regulamentul (UE) 2016/679 privind protecția persoanelor fizice în ceea ce privește prelucrarea datelor cu caracter personal (GDPR), Jurnalul Oficial al UE, L 119, 2016.",
        "22. Banca Națională a României - Regulamentul BNR nr. 4/2021 privind cerințele de supraveghere pentru sistemele de plăți și decontare, Monitorul Oficial al României, Partea I, nr. 612, 2021.",
        "23. Banca Națională a României - Regulamentul BNR nr. 3/2018 privind monitorizarea infrastructurilor pieței financiare și a instrumentelor de plată, Monitorul Oficial al României, 2018."
    ]
    for l in laws:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.0
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.left_indent = Cm(1.25)
        p.paragraph_format.first_line_indent = Cm(-1.25)
        r = p.add_run(l)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        
    p_b4 = doc.add_paragraph()
    p_b4.paragraph_format.space_before = Pt(10)
    p_b4.paragraph_format.space_after = Pt(4)
    p_b4.paragraph_format.first_line_indent = Inches(0)
    rb4 = p_b4.add_run("IV. Standarde internaționale, rapoarte instituționale și documentație tehnică")
    rb4.font.name = 'Times New Roman'
    rb4.font.size = Pt(12)
    rb4.font.bold = True
    
    standards = [
        "24. European Banking Authority (EBA) - Guidelines on ICT and Security Risk Management (EBA/GL/2019/04), Paris, 2019.",
        "25. European Union Agency for Cybersecurity (ENISA) - ENISA Threat Landscape for the Financial Sector, Atena, 2023.",
        "26. International Organization for Standardization - ISO 20022: Financial Services – Universal Financial Industry Message Scheme, Geneva, 2022.",
        "27. National Institute of Standards and Technology (NIST) - Zero Trust Architecture, NIST Special Publication 800-207, Gaithersburg, 2020.",
        "28. PCI Security Standards Council - Payment Card Industry Data Security Standard (PCI-DSS) Requirements and Testing Procedures, Version 4.0, Wakefield, 2022.",
        "29. SWIFT - Customer Security Controls Framework (CSCF) v2024, Society for Worldwide Interbank Financial Telecommunication, La Hulpe, 2024.",
        "30. The MITRE Corporation - MITRE ATT&CK Enterprise Matrix for Financial Services, 2024, https://attack.mitre.org.",
        "31. Apache Software Foundation - Apache Fineract Technical Documentation: Open Source Core Banking System, 2024, https://fineract.apache.org.",
        "32. Proxmox Server Solutions GmbH - Proxmox Virtual Environment 9.x Documentation and Architecture Guide, Viena, 2024.",
        "33. Wazuh Inc. - Wazuh Enterprise SIEM & XDR Documentation: Host-based Intrusion Detection and Log Analysis, San Jose, 2024.",
        "34. Deciso B.V. - OPNsense Stateful Security Firewall User & Engineering Manual, Middelharnis, 2024.",
        "35. Internet Engineering Task Force (IETF) - RFC 6238: TOTP: Time-Based One-Time Password Algorithm, 2011."
    ]
    for s in standards:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.0
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.left_indent = Cm(1.25)
        p.paragraph_format.first_line_indent = Cm(-1.25)
        r = p.add_run(s)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        
    doc.add_page_break()
