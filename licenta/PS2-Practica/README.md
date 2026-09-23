# Practică de Specialitate Anul 2 & Aplicație Web Meteo (ucv-ps2-vremea)

<div align="center">

[![Framework](https://img.shields.io/badge/Framework-Next.js%2015.1%20%7C%20React%2019-black?style=flat&logo=nextdotjs)](proiect/package.json)
[![Language](https://img.shields.io/badge/Language-TypeScript%205.7-blue?style=flat&logo=typescript)](proiect/tsconfig.json)
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS%203.4-38bdf8?style=flat&logo=tailwindcss)](proiect/tailwind.config.ts)
[![Journal](https://img.shields.io/badge/Logbook-14%20Daily%20Entries-orange?style=flat)](11mai.md)
[![Academic Year](https://img.shields.io/badge/Year-Anul%202%20(Practic%C4%83)-purple?style=flat)](../../PROJECTS.md)
[![Status](https://img.shields.io/badge/Status-Completed-brightgreen?style=flat)](../../PROJECTS.md)

</div>

---

## 1. Prezentare Generală

Acest director (`licenta/PS2-Practica`) găzduiește documentația stagiului de **Practică de Specialitate (Anul 2)** desfășurat de studentul Moanță Ștefănuț-Cornel în cadrul programului de licență *Informatică Economică*, Facultatea de Economie și Administrarea Afacerilor (FEAA), Universitatea din Craiova.

Directorul include două componente corelate:
1. **Jurnalul Zilnic de Practică (14 Înregistrări Bilingve RO/EN):** Documentează activitățile tehnice, setup-ul mediilor de virtualizare, configurarea rețelelor și procesul iterativ de dezvoltare software.
2. **Aplicația Web de Prognoză Meteo (`proiect` / `ucv-ps2-vremea`):** Aplicație web modernă construită cu **Next.js 15 App Router**, **React 19**, **TypeScript** și **Tailwind CSS**.

---

## 2. Jurnalul Zilnic de Practică (Index Calendaristic)

| Dată | Fișier Jurnal | Activități și Tehnologii Abordate |
| :---: | :--- | :--- |
| **11 mai** | [`11mai.md`](11mai.md) | Setup mediu de lucru (VS Code, Node.js, Git, virtualizare macOS $\rightarrow$ Windows). |
| **12 mai** | [`12mai.md`](12mai.md) | Proiectare arhitecturală UI/UX, explorare API-uri de telemetrie meteo, configurare Next.js. |
| **13 mai** | [`13mai.md`](13mai.md) | Structurare componente modulare React, integrare Tailwind CSS, stilizare layout receptiv. |
| **14 mai** | [`14mai.md`](14mai.md) | Implementare servicii de fetch asincron, parsare răspunsuri JSON, tratarea erorilor HTTP. |
| **15 mai** | [`15mai.md`](15mai.md) | Integrare componente căutare orașe, persistență stare locală, optimizare randare. |
| **18 mai** | [`18mai.md`](18mai.md) | Testare compatibilitate cross-browser și adaptare pentru dispozitive mobile. |
| **19 mai** | [`19mai.md`](19mai.md) | Rafinare tranziții CSS, grafice termice și indicatoare de vânt/umiditate. |
| **20 mai** | [`20mai.md`](20mai.md) | Optimizare performanță Core Web Vitals, analiză bundle size. |
| **21 mai** | [`21mai.md`](21mai.md) | Documentare cod sursă și pregătirea structurii de livrabil. |
| **22 mai** | [`22mai.md`](22mai.md) | Testare manuală a scenariilor de deconectare și degradare grațioasă a rețelei. |
| **25 mai** | [`25mai.md`](25mai.md) | Integrare teme vizuale (Light / Dark mode) și suport accesibilitate a11y. |
| **26 mai** | [`26mai.md`](26mai.md) | Revizuire conformitate cerințe academice stagiu de practică. |
| **27 mai** | [`27mai.md`](27mai.md) | Verificare build de producție (`npm run build`) și remediere erori TypeScript. |
| **28 mai** | [`28mai.md`](28mai.md) | Finalizare raport tehnic de practică și sinteză rezultate. |
| **29 mai** | [`29mai.md`](29mai.md) | Încheiere stagiu practică, arhivare proiect și predare portofoliu. |

---

## 3. Aplicația Web Meteo (`ucv-ps2-vremea`)

Aplicația este localizată în subdirectorul [`proiect/`](proiect/) și implementează:
* **Server-Side Rendering (SSR) & Static Generation:** Folosind cele mai noi capacități Next.js 15.
* **Componente Tipizate:** Interfețe TypeScript stricte pentru modelele meteorologice.
* **Design Receptiv:** Tailwind CSS cu suport complet pentru ecrane de smartphone, tabletă și desktop.

### Rulare Locală:
```bash
cd licenta/PS2-Practica/proiect
npm install
npm run dev
# Deschideți http://localhost:3000 în browser
```

### Build de Producție:
```bash
npm run build
npm run start
```
