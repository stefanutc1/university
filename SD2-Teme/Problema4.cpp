#include <iostream>
#include <cmath>
#include <iomanip>

#define MAX 20

typedef struct {
    int k;
    double C[MAX];
    int E[MAX];
} Polinom;

void citire(Polinom &p) {
    std::cout << "Numar de termeni nenuli: ";
    if (!(std::cin >> p.k)) return;
    for (int i = 0; i < p.k; i++) {
        std::cout << "Coeficient si exponent: ";
        if (!(std::cin >> p.C[i] >> p.E[i])) return;
    }
}

void afisare(const Polinom &p) {
    for (int i = 0; i < p.k; i++) {
        if (p.C[i] >= 0 && i > 0) std::cout << "+";
        std::cout << std::fixed << std::setprecision(2) << p.C[i] << "x^" << p.E[i] << " ";
    }
    std::cout << "\n";
}

double valoare(const Polinom &p, double x) {
    double s = 0;
    for (int i = 0; i < p.k; i++)
        s += p.C[i] * std::pow(x, p.E[i]);
    return s;
}

Polinom derivata(const Polinom &p) {
    Polinom d;
    d.k = 0;
    for (int i = 0; i < p.k; i++)
        if (p.E[i] != 0) {
            d.C[d.k] = p.C[i] * p.E[i];
            d.E[d.k] = p.E[i] - 1;
            d.k++;
        }
    return d;
}

int main() {
    Polinom p;
    citire(p); 
    std::cout << "Polinomul: ";
    afisare(p); 

    double x;
    std::cout << "x = ";
    if (!(std::cin >> x)) return 1;
    
    std::cout << "Valoarea P(" << std::fixed << std::setprecision(2) << x << ") = " 
              << std::setprecision(4) << valoare(p, x) << "\n";

    Polinom d = derivata(p);
    std::cout << "Derivata: ";
    afisare(d);
    return 0;
}