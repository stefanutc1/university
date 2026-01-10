#pragma once
#include "fisier.h"

struct lista {
    cursa c;
    lista *prev, *next;
};

void creare_lista(lista *&l);
void afis_lista(lista *l);
void actualizare_lista(lista *&l);
