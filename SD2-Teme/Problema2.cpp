#include <stdio.h>
#include <math.h>
#include <ctype.h>
#include <conio.h>
#include <stdlib.h> 

#define NMAX 20
#define M_PI 3.14159265358979323846

typedef enum tip_figura { DREPTUNGHI, CERC, TRIUNGHI, TRAPEZ, PARALELOGRAM } TIP_FIGURA;

typedef struct date_dreptunghi {
    float l,L;
} DATE_DREPTUNGHI;
typedef struct date_cerc {
    float r;
} DATE_CERC;
typedef struct date_triunghi {
    float a,b,c;
} DATE_TRIUNGHI;
typedef struct date_trapez {
    float B, b, h, l1, l2; 
} DATE_TRAPEZ;
typedef struct date_paralelogram {
    float a, b, h; 
} DATE_PARALELOGRAM;

typedef struct figura {
    TIP_FIGURA tip;
    union date {
        DATE_DREPTUNGHI d;
        DATE_CERC c;
        DATE_TRIUNGHI t;
        DATE_TRAPEZ tz;      
        DATE_PARALELOGRAM p; 
    } date;
} FIGURA;

typedef struct date_calculate {
    float a,p; 
} DATE_CALCULATE;

FIGURA CitesteFigura(void);
DATE_CALCULATE CalculDreptunghi(DATE_DREPTUNGHI d);
DATE_CALCULATE CalculCerc(DATE_CERC c);
DATE_CALCULATE CalculTriunghi(DATE_TRIUNGHI t);
DATE_CALCULATE CalculTrapez(DATE_TRAPEZ tz);           
DATE_CALCULATE CalculParalelogram(DATE_PARALELOGRAM p); 
DATE_CALCULATE Calcul(FIGURA f);

int n;
FIGURA figuri[NMAX];
DATE_CALCULATE dc;

FIGURA CitesteFigura() {
    FIGURA f;
    char c;
    do {
        printf("Introduceti tipul figurii (d-dreptunghi, c-cerc, t-triunghi, z-trapez, p-paralelogram):");
        c = getch(); 
        c = tolower(c);
    } while ((c != 'd') && (c != 'c') && (c != 't') && (c != 'z') && (c != 'p'));
    
    printf("\nIntroduceti dimensiunile figurii:\n");
    switch (c) {
        case 'd':
            f.tip = DREPTUNGHI;
            printf("Latimea, Lungimea: ");
            scanf("%f%f",&f.date.d.l, &f.date.d.L);
            break;
        case 'c':
            f.tip = CERC;
            printf("Raza: ");
            scanf("%f",&f.date.c.r);
            break;
        case 't':
            f.tip = TRIUNGHI;
            printf("Lungimile laturilor (a b c): ");
            scanf("%f%f%f", &f.date.t.a, &f.date.t.b, &f.date.t.c);
            break;
        case 'z': 
            f.tip = TRAPEZ;
            printf("Baza mare, Baza mica, Inaltime, Latura 1, Latura 2: ");
            scanf("%f%f%f%f%f", &f.date.tz.B, &f.date.tz.b, &f.date.tz.h, &f.date.tz.l1, &f.date.tz.l2);
            break;
        case 'p': 
            f.tip = PARALELOGRAM;
            printf("Latura a, Latura b, Inaltimea coresp. lui a: ");
            scanf("%f%f%f", &f.date.p.a, &f.date.p.b, &f.date.p.h);
            break;
    }
    return f;
} 

DATE_CALCULATE CalculDreptunghi(DATE_DREPTUNGHI d) {
    DATE_CALCULATE temp;
    temp.a = d.l*d.L;
    temp.p = 2*(d.l+d.L);
    return temp;
}


DATE_CALCULATE CalculCerc(DATE_CERC c) {
    DATE_CALCULATE temp;
    temp.p = 2*M_PI*c.r;
    temp.a = M_PI*c.r*c.r;
    return temp;
}

DATE_CALCULATE CalculTriunghi(DATE_TRIUNGHI t) {
    DATE_CALCULATE temp;
    float s; 
    temp.p = t.a+t.b+t.c;
    s = temp.p/2.;
    float arie_patrat = s * (s - t.a) * (s - t.b) * (s - t.c);
    if (arie_patrat >= 0) {
        temp.a = sqrt(arie_patrat);
    } else {
        temp.a = 0.0; /
    }
    return temp;
} 

DATE_CALCULATE CalculTrapez(DATE_TRAPEZ tz) {
    DATE_CALCULATE temp;
    temp.p = tz.B + tz.b + tz.l1 + tz.l2;
    temp.a = (tz.B + tz.b) * tz.h / 2.0;
    return temp;
} 

DATE_CALCULATE CalculParalelogram(DATE_PARALELOGRAM p) {
    DATE_CALCULATE temp;
    temp.p = 2.0 * (p.a + p.b);
    temp.a = p.a * p.h;
    return temp;
}

DATE_CALCULATE Calcul(FIGURA f) {
    switch (f.tip) {
        case DREPTUNGHI:
            return CalculDreptunghi(f.date.d);
        case CERC:
            return CalculCerc(f.date.c);
        case TRIUNGHI:
            return CalculTriunghi(f.date.t);
        case TRAPEZ: 
            return CalculTrapez(f.date.tz);
        case PARALELOGRAM: 
            return CalculParalelogram(f.date.p);
        default:
             printf("Eroare: Tip figura necunoscut.\n");
             exit(EXIT_FAILURE);
    }
} 

int main() {
    int i;
    

    printf("Introduceti numarul de figuri:");
    scanf("%d",&n);
    if (n > NMAX) {
        printf("Numarul de figuri depaseste limita maxima (%d). Se va lucra cu %d figuri.\n", NMAX, NMAX);
        n = NMAX;
    }

    for (i=0;i<n;i++)
        figuri[i] = CitesteFigura();
    
    printf("\nNr.crt. │ Tip            │ Perimetru │ Arie\n");
    printf("────────┼────────────────┼───────────┼────────\n");
    for (i=0;i<n;i++) {
        dc = Calcul(figuri[i]);
        printf("%3d │",i+1);
        
        switch (figuri[i].tip) {
            case DREPTUNGHI:
                printf(" dreptunghi     │");
                break;
            case CERC:
                printf(" cerc           │");
                break;
            case TRIUNGHI:
                printf(" triunghi       │");
                break;
            case TRAPEZ:
                printf(" trapez         │");
                break;
            case PARALELOGRAM:
                printf(" paralelogram   │");
                break;
        }
        
        printf("%10.2f │",dc.p);
        printf("%7.2f\n",dc.a);
    }
    return 0;
}