"""
Punct de intrare pentru generarea Lucrării de Licență FEAA UCV
Execută scriptul modular din thesis_generator/build.py
"""

import os
import sys

# Adăugare director curent în sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from thesis_generator.build import generate_word_document, generate_markdown_document

if __name__ == "__main__":
    target_docx = os.path.join(BASE_DIR, "LUCRARE LICENTA - 31.08.2026.docx")
    target_md = os.path.join(BASE_DIR, "LUCRARE_LICENTA_COMPLETA.md")
    
    print("======================================================================")
    print("  GENERATOR LUCRARE DE LICENȚĂ FEAA UCV - MOANȚĂ ȘTEFĂNUȚ-CORNEL")
    print("======================================================================")
    generate_word_document(target_docx)
    generate_markdown_document(target_md)
    print("======================================================================")
    print("  COMPILARE FINALIZATĂ CU SUCCES PENTRU AMBELE FORMATE (.docx și .md)")
    print("======================================================================")
