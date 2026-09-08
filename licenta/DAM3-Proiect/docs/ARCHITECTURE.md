# Arhitectura Sistemului - DAM3 Utility Suite

## 1. Paradigma Local-First

Aplicatia DAM3-Proiect este proiectata conform principiilor **Local-First Software**:
1. **Disponibilitate Implicita**: Fiecare utilitar functioneaza complet offline direct pe procesorul dispozitivului mobil.
2. **Date Suverane**: Toate datele (grupuri, cheltuieli, documente scanate, chei si configurari) sunt stocate local in MMKV de inalta viteza.
3. **Sincronizare Oportunista**: Cand este configurat un backend self-hosted, schimbarile sunt propagate bidirectional prin REST si WebSocket.

```
+-------------------------------------------------------------------+
|                        MOBILE CLIENT (EXPO)                       |
|                                                                   |
|   +-------------------+  +-------------------+  +---------------+  |
|   |   Network Suite   |  | Document Scanner  |  |  Converters   |  |
|   +-------------------+  +-------------------+  +---------------+  |
|   | Expense Splitter  |  | Hardware Sensors  |  |  Dev Tools    |  |
|   +-------------------+  +-------------------+  +---------------+  |
|                             |                                     |
|             +---------------+---------------+                     |
|             |        Zustand Stores         |                     |
|             +---------------+---------------+                     |
|                             |                                     |
|             +---------------+---------------+                     |
|             |      MMKV Local Storage       |                     |
|             +---------------+---------------+                     |
+-----------------------------|-------------------------------------+
                              | (REST / WebSocket)
                              v
+-------------------------------------------------------------------+
|                       BACKEND ENGINE (GO)                         |
|                                                                   |
|   +-----------------------------------------------------------+   |
|   |         Fiber HTTP Router + WebSocket Connection Hub      |   |
|   +-----------------------------------------------------------+   |
|         |                           |                      |      |
|         v                           v                      v      |
|   +------------+             +------------+         +-----------+ |
|   | Debt Engine|             | BNR Cron   |         | Telemetry | |
|   +------------+             +------------+         +-----------+ |
|         |                           |                      |      |
|         +---------------------------+----------------------+      |
|                                     v                             |
|                        +-------------------------+                |
|                        | SQLite3 (WAL Mode)      |                |
|                        +-------------------------+                |
|                                     |                             |
|                        +-------------------------+                |
|                        | Litestream Replication  |                |
|                        +-------------------------+                |
+-------------------------------------------------------------------+
```

## 2. Analiza Algoritmica a Simplificarii Datoriilor

Problema impartirii cheltuielilor intr-un grup de $N$ participanti genereaza in mod naiv pana la $O(N^2)$ tranzactii individuale. Algoritmul implementat in `src/algorithms/debtSimplifier.ts`:

1. Calculeaza balanta neta a fiecarui membru:
   $$B_i = \text{Platit}_i - \text{Datorat}_i$$
2. Separa participantii in creditori ($B_i > 0$) si debitori ($B_i < 0$).
3. Aplica o abordare Greedy cu Min-Cash-Flow:
   - Extrage cel mai mare debitor $D$ si cel mai mare creditor $C$.
   - Sumeaza transferul $T = \min(-B_D, B_C)$.
   - Emite tranzactia $D \to C$ cu suma $T$.
   - Actualizeaza balantele pana cand toate sunt 0.
4. **Complexitate**:
   - Timp: $O(N \log N)$ datorita sortarilor repetate pe multimea creditorilor si debitorilor.
   - Numar maxim de tranzactii: cel mult $N - 1$.
