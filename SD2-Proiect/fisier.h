#pragma once
using namespace std;

struct cursa {
    char id[20];
    char dec[30];
    char dest[30];
    int durata;
    char avion[20];
};

void creare_fisier();
void afis_fisier();
void actualizare_fisier();

