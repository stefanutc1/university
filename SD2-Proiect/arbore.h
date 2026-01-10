#pragma once
#include "fisier.h"

struct nodarb {
    cursa c;
    nodarb *st, *dr;
};

void creare_arbore(nodarb *&a);
void afis_arbore(nodarb *a);
