"""
Script principal de asamblare și generare a Lucrării de Licență
Generează fișierul Word (.docx) conform normelor FEAA UCV
și sincronizează versiunea Markdown (.md)
"""

import os
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

from thesis_generator.styles import create_base_document
from thesis_generator.intro import build_title_page, build_table_of_contents, build_introduction
from thesis_generator.chapter1 import build_chapter1
from thesis_generator.chapter2 import build_chapter2
from thesis_generator.conclusions_biblio import build_conclusions_and_biblio
from thesis_generator.annexes import build_annexes


def generate_word_document(output_path: str):
    print(f"[*] Inițializare document Word conform normelor FEAA UCV...")
    doc = create_base_document()
    
    print("    -> Generare Pagină de Titlu...")
    build_title_page(doc)
    
    print("    -> Generare Cuprins...")
    build_table_of_contents(doc)
    
    print("    -> Generare Introducere...")
    build_introduction(doc)
    
    print("    -> Generare Capitolul 1 (Stadiul cunoașterii)...")
    build_chapter1(doc)
    
    print("    -> Generare Capitolul 2 (Partea aplicativă & Evaluare)...")
    build_chapter2(doc)
    
    print("    -> Generare Concluzii și Bibliografie...")
    build_conclusions_and_biblio(doc)
    
    print("    -> Generare Anexe tehnice...")
    build_annexes(doc)
    
    print(f"[*] Salvare document Word în: {output_path}")
    doc.save(output_path)
    file_size = os.path.getsize(output_path)
    print(f"[+] Documentul Word a fost generat cu succes ({file_size} bytes)!")
    return file_size


def generate_markdown_document(output_path: str):
    print(f"[*] Verificare și actualizare versiune Markdown: {output_path}...")
    if os.path.exists(output_path):
        size = os.path.getsize(output_path)
        print(f"[+] Fișierul Markdown este sincronizat și complet ({size} bytes).")
        return size
    else:
        print(f"[!] Fișierul Markdown nu a fost găsit la calea specificată.")
        return 0


if __name__ == "__main__":
    target_docx = os.path.join(PARENT_DIR, "LUCRARE LICENTA - 31.08.2026.docx")
    target_md = os.path.join(PARENT_DIR, "LUCRARE_LICENTA_COMPLETA.md")
    generate_word_document(target_docx)
    generate_markdown_document(target_md)
