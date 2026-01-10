#include "fisier.h"
#include <fstream>
#include <iostream>
#include <vector>
#include <cstring>
using namespace std;

void creare_fisier() {
    ofstream f("f1.dat", ios::binary);
    int n;
    cin >> n;
    cursa c;
    for (int i = 0; i < n; i++) {
        cin >> c.id >> c.dec >> c.dest >> c.durata >> c.avion;
        f.write((char*)&c, sizeof(c));
    }
}

void afis_fisier() {
    ifstream f("f1.dat", ios::binary);
    cursa c;
    while (f.read((char*)&c, sizeof(c))) {
        cout << c.id << " " << c.dec << " " << c.dest << " " << c.durata << " " << c.avion << "\n";
    }
}

void actualizare_fisier() {
    vector<cursa> v;
    cursa c;

    ifstream f("f1.dat", ios::binary);
    while (f.read((char*)&c, sizeof(c))) v.push_back(c);
    f.close();

    int op;
    cin >> op;

    if (op == 1) {
        string id; cin >> id;
        for (auto &x : v)
            if (id == x.id)
                cin >> x.durata >> x.avion >> x.id;
    }

    if (op == 2) {
        cin >> c.id >> c.dec >> c.dest >> c.durata >> c.avion;
        v.push_back(c);
    }

    if (op == 3) {
        string id; cin >> id;
        vector<cursa> nv;
        for (auto &x : v)
            if (id != x.id) nv.push_back(x);
        v = nv;
    }

    for (int i = 0; i < v.size(); i++)
        for (int j = i + 1; j < v.size(); j++)
            if (strcmp(v[i].id, v[j].id) > 0)
                swap(v[i], v[j]);

    ofstream g("f1.dat", ios::binary);
    for (auto &x : v)
        g.write((char*)&x, sizeof(x));
}
