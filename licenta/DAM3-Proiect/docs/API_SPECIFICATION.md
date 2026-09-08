# Specificatie API & Protocol WebSocket - DAM3 Backend

Microserviciul Go Fiber expune urmatoarele puncte de interactiune REST si streaming WebSocket:

## Endpoints REST (/api/v1)

### 1. Verificare Stare Sistem
- **GET `/api/v1/health`**
  - Raspuns: Uptime, stare SQLite, consum memorie RAM in MB si numar goroutines active.

### 2. Cursuri Valutare
- **GET `/api/v1/rates`**
  - Raspuns: Lista celor 16 valute si cursul acestora raportat la RON.
- **POST `/api/v1/rates/refresh`**
  - Forteaza re-descarcarea cursurilor BNR/BCE in baza de date SQLite.

### 3. Gestiune Cheltuieli
- **GET `/api/v1/groups`**
  - Returneaza grupurile inregistrate.
- **POST `/api/v1/groups`**
  - Creaza un grup nou cu participanti asociati.
- **GET `/api/v1/groups/:id/settle`**
  - Calculeaza si returneaza lista simplificata de transferuri pentru stingerea datoriilor din grup.

### 4. Telemetrie Anonima
- **POST `/api/v1/telemetry`**
  - Inregistreaza rapoarte de crash sau erori neprevazute pentru diagnoza.

## Protocol WebSocket (/ws)
- **Endpoint**: `/ws/expenses/:groupId`
- **Descriere**: Conexiune bidirectionala prin care clientii conectati la acelasi grup primesc notificari in timp real cand se adauga o noua cheltuiala.
