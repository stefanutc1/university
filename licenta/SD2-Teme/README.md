# Probleme și Teme Algoritmice (C++ / Structuri de Date)

<div align="center">

[![Language](https://img.shields.io/badge/Language-C%2B%2B%20%2F%20C-blue?style=flat&logo=cplusplus)](Problema1.cpp)
[![Domain](https://img.shields.io/badge/Domain-Algorithms%20%26%20Data%20Structures-orange?style=flat)](../../PROJECTS.md)
[![Complexity](https://img.shields.io/badge/Algorithms-Sorting%20%7C%20Polymorphism%20%7C%20Matrices-teal?style=flat)](Problema6.cpp)
[![Academic Year](https://img.shields.io/badge/Year-Anul%202%20(SD)-purple?style=flat)](../../PROJECTS.md)
[![Status](https://img.shields.io/badge/Status-Completed-brightgreen?style=flat)](../../PROJECTS.md)

</div>

---

## 1. Prezentare Generală

Acest director (`licenta/SD2-Teme`) conține rezolvările problemelor algoritmice practice dezvoltate în cadrul disciplinei **Structuri de Date (SD)** la Facultatea de Economie și Administrarea Afacerilor (FEAA), Universitatea din Craiova.

Fiecare fișier implementează soluții eficiente pentru probleme fundamentale de structuri de date eterogene, alocare dinamică, manipulare matricială și algoritmi generici de sortare.

---

## 2. Catalogul Problemelor Implementate

| Fișier | Domeniu Algoritmic | Tehnici & Concepte Utilizate |
| :--- | :--- | :--- |
| **`Problema1.cpp`** | Structuri de Date Eterogene & Căutare | Gestiune grupă studenți (`Student`, `DataNasterii`), sortare alfabetică prin `qsort`, căutare binară și filtrare după sex / dată. |
| **`Problema2.cpp`** | Tipuri de Date Abstracte & Geometrie | Modelare figuri geometrice (dreptunghi, cerc, triunghi, trapez, paralelogram) prin enumerări (`enum tip_figura`), calcul arie și perimetru. |
| **`Problema3.cpp`** | Algebră Matricială & Tablouri 2D | Eliminarea unei linii $i$ și a unei coloane $j$ specificate dintr-o matrice bidimensională și compactarea elementelor. |
| **`Problema4.cpp`** | Reprezentare Polinoame Rare | Structură de date pentru stocarea polinoamelor rare prin perechi (coeficient, exponent) și evaluarea numerică a expresiilor. |
| **`Problema5.cpp`** | Prelucrare Tablouri & Matrice | Operații de căutare și transformare pe matrice. |
| **`Problema6.cpp`** | Algoritm Generic de Sortare (Polimorfism C) | Implementare generică de sortare prin inserție (`insertion_sort`) lucrând pe blocuri de memorie `void*` și pointeri la funcție de comparare (`int (*cmp)(const void*, const void*)`). |

---

## 3. Exemplu: Sortare Generic prin Inserție (`Problema6.cpp`)

```cpp
void insertion_sort(void *base, int n, size_t size,
                    int (*cmp)(const void*, const void*)) {
    char *arr = (char*)base;
    void *key = std::malloc(size);
    if (!key) return;
    
    for (int i = 1; i < n; i++) {
        std::memcpy(key, arr + i * size, size);
        int j = i - 1;
        while (j >= 0 && cmp(arr + j * size, key) > 0) {
            std::memcpy(arr + (j + 1) * size, arr + j * size, size);
            j--;
        }
        std::memcpy(arr + (j + 1) * size, key, size);
    }
    std::free(key);
}
```

---

## 4. Compilare și Execuție

Orice problemă poate fi compilată individual:
```bash
g++ -std=c++17 -Wall Problema1.cpp -o p1 && ./p1
g++ -std=c++17 -Wall Problema6.cpp -o p6 && ./p6
```
