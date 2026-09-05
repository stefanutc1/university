#include <iostream>
#include <cstring> 
#include <cstdlib> 
#include <iomanip> 

void insertion_sort(void *base, int n, size_t size,
                    int (*cmp)(const void*, const void*)) {
    char *arr = (char*)base;
    void *key = std::malloc(size);
    if (!key) { /* handle error */ return; }
    
    for (int i = 1; i < n; i++) {
        std::memcpy(key, arr + i * size, size);
        int j = i - 1;
        while (j >= 0 && cmp(arr + j * size, key) > 0) {
            std::memcpy(arr + (j + 1) * size, arr + j * size, size);
            j--;
        }
        std::memcpy(arr + (j + 1) * size, key, size);
    }
    std::free(key);
}

int cmp_double(const void *a, const void *b) {
    double x = *(const double*)a, y = *(const double*)b;
    if (x < y) return -1;
    if (x > y) return 1;
    return 0;
}

int cmp_str(const void *a, const void *b) {
    const char * const *x = (const char * const *)a;
    const char * const *y = (const char * const *)b;
    return std::strcmp(*x, *y);
}

int main() {
    double v[] = {5.1, -2.3, 7.0, 0.1, 5.1};
    int n = sizeof(v)/sizeof(v[0]);
    insertion_sort(v, n, sizeof(double), cmp_double);
    std::cout << "Vector de numere reale ordonat:\n";
    for (int i = 0; i < n; i++) 
        std::cout << std::fixed << std::setprecision(2) << v[i] << " ";
    std::cout << "\n";

    const char *s[] = {"Sir1", "Sir2", "Sir3", "Sir4", "Sir5"};
    n = sizeof(s)/sizeof(s[0]);
    insertion_sort(s, n, sizeof(const char*), cmp_str);
    std::cout << "Vector de siruri ordonat:\n";
    for (int i = 0; i < n; i++) std::cout << s[i] << " ";
    std::cout << "\n";
    return 0;
}