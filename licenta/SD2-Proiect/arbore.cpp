#include "arbore.h"
#include <cstring>
#include <iostream>
using namespace std;

nodarb* inserare(nodarb *a, cursa c) {
    if (!a) {
        a = new nodarb;
        a->c = c;
        a->st = a->dr = nullptr;
        return a;
    }
    if (strcmp(c.id, a->c.id) < 0) a->st = inserare(a->st, c);
    else a->dr = inserare(a->dr, c);
    return a;
}

void creare_arbore(nodarb *&a) {
    a = nullptr;
    int n; cin >> n;
    cursa c;
    for (int i = 0; i < n; i++) {
        cin >> c.id >> c.dec >> c.dest >> c.durata >> c.avion;
        a = inserare(a, c);
    }
}

void afis_arbore(nodarb *a) {
    if (!a) return;
    afis_arbore(a->st);
    cout << a->c.id << " " << a->c.dec << " " << a->c.dest << " " << a->c.durata << " " << a->c.avion << "\n";
    afis_arbore(a->dr);
}
