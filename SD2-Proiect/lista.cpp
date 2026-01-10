#include "lista.h"
#include <iostream>
using namespace std;

void creare_lista(lista *&l) {
    int n; cin >> n;
    l = nullptr;
    for (int i = 0; i < n; i++) {
        lista *p = new lista;
        cin >> p->c.id >> p->c.dec >> p->c.dest >> p->c.durata >> p->c.avion;
        p->prev = nullptr;
        p->next = l;
        if (l) l->prev = p;
        l = p;
    }
}

void afis_lista(lista *l) {
    while (l) {
        cout << l->c.id << " " << l->c.dec << " " << l->c.dest << " " << l->c.durata << " " << l->c.avion << "\n";
        l = l->next;
    }
}

void actualizare_lista(lista *&l) {
    int op; cin >> op;

    if (op == 1) {
        string id; cin >> id;
        lista *p = l;
        while (p) {
            if (id == p->c.id)
                cin >> p->c.durata >> p->c.avion >> p->c.id;
            p = p->next;
        }
    }

    if (op == 2) {
        lista *p = new lista;
        cin >> p->c.id >> p->c.dec >> p->c.dest >> p->c.durata >> p->c.avion;
        p->prev = nullptr;
        p->next = l;
        if (l) l->prev = p;
        l = p;
    }

    if (op == 3) {
        string id; cin >> id;
        lista *p = l;
        while (p) {
            if (id == p->c.id) {
                if (p->prev) p->prev->next = p->next;
                else l = p->next;
                if (p->next) p->next->prev = p->prev;
                delete p;
                break;
            }
            p = p->next;
        }
    }
}
