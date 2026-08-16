#include <stdio.h>
#include <string.h>
#include <stdlib.h> 

#define MAX_STUDENTI 25
#define MAX_NUME 50
#define MAX_TEL 15

typedef struct {
    int an, luna, zi;
} DataNasterii;

typedef struct {
    int cod;
    char nume[MAX_NUME];
    char prenume[MAX_NUME];
    char telefon[MAX_TEL];
    DataNasterii data_nasterii;
    char sex; 
} Student;

Student grupa[MAX_STUDENTI];
int numar_studenti = 0;

int compara_studenti(const void *a, const void *b) {
    const Student *sa = (const Student *)a;
    const Student *sb = (const Student *)b;
    
    int cmp_nume = strcmp(sa->nume, sb->nume);
    if (cmp_nume != 0) {
        return cmp_nume;
    }
    
    return strcmp(sa->prenume, sb->prenume);
}

void introducere_studenti() {
    char raspuns;
    do {
        if (numar_studenti >= MAX_STUDENTI) {
            printf("Limita maxima de studenti (%d) a fost atinsa.\n", MAX_STUDENTI);
            break;
        }

        printf("\n--- Introducere Student Nou (%d/%d) ---\n", numar_studenti + 1, MAX_STUDENTI);

        grupa[numar_studenti].cod = numar_studenti + 1; 
        printf("Cod student: %d\n", grupa[numar_studenti].cod);

        printf("Nume: ");
        scanf("%s", grupa[numar_studenti].nume);
        
        printf("Prenume: ");
        scanf("%s", grupa[numar_studenti].prenume);

        printf("Numar de telefon: ");
        scanf("%s", grupa[numar_studenti].telefon);

        printf("Data nasterii (an luna zi): ");
        scanf("%d %d %d", 
              &grupa[numar_studenti].data_nasterii.an, 
              &grupa[numar_studenti].data_nasterii.luna, 
              &grupa[numar_studenti].data_nasterii.zi);

        printf("Sex (M/F): ");
        scanf(" %c", &grupa[numar_studenti].sex);

        numar_studenti++;

        printf("Doriti sa adaugati alt student? (d/n): ");
        scanf(" %c", &raspuns);
    } while (raspuns == 'd' || raspuns == 'D');
}

void afisare_studenti() {
    printf("\n=== Lista Studenti (%d) ===\n", numar_studenti);
    for (int i = 0; i < numar_studenti; ++i) {
        printf("Cod: %d | Nume: %s %s | Tel: %s | Data: %04d-%02d-%02d | Sex: %c\n",
               grupa[i].cod, grupa[i].nume, grupa[i].prenume,
               grupa[i].telefon,
               grupa[i].data_nasterii.an, grupa[i].data_nasterii.luna, grupa[i].data_nasterii.zi,
               grupa[i].sex);
    }
}

int main() {
    introducere_studenti();
    qsort(grupa, numar_studenti, sizeof(Student), compara_studenti);
    afisare_studenti();
    return 0;
}