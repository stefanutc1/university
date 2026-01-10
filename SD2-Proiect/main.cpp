#include <iostream>
#include "fisier.h"
#include "lista.h"
#include "arbore.h"
using namespace std;

int main() {
    lista *l = nullptr;
    nodarb *a = nullptr;
    int op;

    do {
        cin >> op;
        if (op == 1) creare_fisier();
        if (op == 2) afis_fisier();
        if (op == 3) actualizare_fisier();
        if (op == 4) creare_lista(l);
        if (op == 5) afis_lista(l);
        if (op == 6) actualizare_lista(l);
        if (op == 7) creare_arbore(a);
        if (op == 8) afis_arbore(a);
    } while (op != 0);

    return 0;
}

