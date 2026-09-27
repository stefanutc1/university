#include <iostream>
#include <iomanip>

#define MAX 20

int main() {
    int m, n, i, j, del_i, del_j;
    double a[MAX][MAX];

    std::cout << "Introduceti m si n: ";
    if (!(std::cin >> m >> n)) return 1;

    std::cout << "Introduceti elementele matricei:\n";
    for (i = 0; i < m; i++)
        for (j = 0; j < n; j++)
            if (!(std::cin >> a[i][j])) return 1;

    std::cout << "Introduceti linia si coloana de eliminat: ";
    if (!(std::cin >> del_i >> del_j)) return 1;
    
    del_i--; 
    del_j--;

    std::cout << "Matricea rezultata:\n";
    for (i = 0; i < m; i++) {
        if (i == del_i) continue;
        for (j = 0; j < n; j++) {
            if (j == del_j) continue;
            std::cout << std::fixed << std::setw(8) << std::setprecision(2) << a[i][j] << " ";
        }
        std::cout << "\n";
    }
    return 0;
}