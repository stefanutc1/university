# MeteoPulse UCV — Aplicație Web Next.js pentru Prognoză Meteo

> **Universitatea din Craiova** • Facultatea de Științe  
> **Disciplina**: Proiectare Software 2 (PS2) / Practică de Specialitate Anul 2  
> **Perioadă Implementare**: 18 Mai 2026 – 27 Mai 2026  
> **Locație în Repozitoriu**: `PS2-Practica/proiect`  
> **Student**: Ștefănuț

---

## 1. Descrierea Proiectului

**MeteoPulse UCV** este o aplicație web modernă, performantă și reactivă dedicată monitorizării condițiilor meteorologice în timp real, telemetriei atmosferice și prognozei pe termen mediu și lung. 

Aplicația este dezvoltată utilizând framework-ul **Next.js 15 (App Router)**, **React 19**, **TypeScript** și **Tailwind CSS**, integrând API-ul internațional gratuit și deschis **Open-Meteo** (fără necesitate de API keys, cu timp de răspuns redus și acoperire globală prin modelele numerice ECMWF, DWD ICON și NOAA GFS).

Aplicația oferă suport complet bilingv (**Română / English**) și este optimizată cu o temă vizuală elegantă *Obsidian Charcoal* cu accente *Slate Gray*, conform principiilor moderne de design UI/UX.

---

## 2. Arhitectură și Tehnologii Utilizate

- **Framework Web**: [Next.js 15](https://nextjs.org/) cu arhitectură App Router (`src/app`).
- **Librărie UI**: [React 19](https://react.dev/) cu Client Components reactive (`use client`) și Server Route Handlers.
- **Limbaj**: [TypeScript 5](https://www.typescriptlang.org/) pentru siguranță strictă a tipurilor de date.
- **Stilizare**: [Tailwind CSS 3](https://tailwindcss.com/) cu paletă customizată de culori Obsidian & Slate, animații fluide și design adaptat pentru ecrane mobile, tablete și desktop.
- **API Meteorologic**: [Open-Meteo API](https://open-meteo.com/):
  - *Weather Forecast API*: Temperatură, umiditate, viteza/direcția vântului, presiune atmosferică, vizibilitate, indice UV, probabilitate precipitații.
  - *Air Quality API*: Indicele European AQI, particule în suspensie PM2.5 / PM10, $NO_2$, $O_3$, $SO_2$, $CO$.
  - *Geocoding API*: Căutare instantanee după denumirea orașelor cu autocomplete și suport pentru limba română.
- **Pictograme**: Set customizat de pictograme vectoriale SVG optimizate inline (zero dependențe externe la runtime).

---

## 3. Funcționalități Principale

1. **Card Principal Meteorologic (Hero Weather)**:
   - Afișarea temperaturii curente, a temperaturii resimțite (*Feels Like*) și a extremelor zilei (Min/Max).
   - Pictogramă meteo dinamică adaptată codurilor standard WMO (Organizația Meteorologică Mondială) și ciclului zi/noapte.
   - Denumirea completă a localității, județ/regiune și țară.
   - Indicator al orei ultimei actualizări.

2. **Căutare & Selectare Rapidă a Localităților**:
   - Căutare automată cu *debounce* pentru orice oraș din România sau din lume.
   - Butoane rapide (*chips*) pentru marile centre urbane: **Craiova**, **București**, **Cluj-Napoca**, **Timișoara**, **Iași**, **Brașov**, **Constanța**.
   - Buton de geolocalizare automată (*Locația Mea*) prin API-ul nativ de geolocație al browserului.

3. **Prognoză Orară pe 24 de Ore (Hourly Timeline)**:
   - Bandă orizontală derulabilă cu temperatura pentru fiecare oră.
   - Probabilitatea procentuală a precipitațiilor (% ploaie).
   - Marcarea vizuală distinctivă a orei curente.

4. **Prognoză Extinsă pe 7 Zile (Daily Forecast)**:
   - Zilele săptămânii în limba română sau engleză.
   - Bare vizuale proporționale ce ilustrează ecartul termic (min/max).
   - Probabilitatea maximă de precipitații pentru fiecare zi.

5. **Telemetrie Atmosferică Detaliată (6 Indicatori)**:
   - **Vânt**: Viteză în km/h, rafale maxime și direcție cardinală (ex: N, NE, E, SE, S, SW, W, NW).
   - **Umiditate Relativă**: Procentaj și calcul al *Punctului de Rouă* (formula Magnus).
   - **Presiune Atmosferică**: Valoare în hPa și evaluare barometrică.
   - **Indice UV**: Nivel solar maxim cu avertismente de expunere (Scăzut, Moderat, Ridicat, Extrem).
   - **Vizibilitate**: Distanță estimată în kilometri.
   - **Precipitații**: Volum cumulat în milimetri.

6. **Monitorizare Calitatea Aerului (Air Quality Index - AQI)**:
   - Indicele european oficial AQI încadrat pe nivele de risc (Excelent, Moderat, Poluat, Periculos).
   - Concentrațiile particulelor fine PM2.5 și PM10 ($\mu g/m^3$).
   - Concentrațiile de Ozon ($O_3$) și Dioxid de Azot ($NO_2$).

7. **Ciclu Solar & Ore Astronomice**:
   - Ora exactă a răsăritului și apusului soarelui pentru coordonatele geografice curente.

8. **Comutator Bilingv & Unități de Măsură**:
   - Comutare instantanee între **Română (RO)** și **Engleză (EN)**.
   - Comutare rapidă între grade **Celsius (°C)** și **Fahrenheit (°F)**.

9. **Mod Offline & Toleranță la Erori**:
   - În caz de întrerupere a conexiunii la internet sau rate-limiting, aplicația încarcă automat setul de date demonstrativ integrat pentru Craiova (`lib/mock-data.ts`), garantând funcționarea fără blocaje.

---

## 4. Structura Fișierelor din Proiect

```text
PS2-Practica/
├── 11mai.md - 29mai.md      # Jurnalul zilnic de activitate din stagiul de practică
└── proiect/                 # Folderul dedicat aplicației web de meteo
    ├── package.json         # Dependențele proiectului și scripturile de rulare
    ├── tsconfig.json        # Configurația compilatorului TypeScript
    ├── next.config.mjs      # Configurația runtime Next.js
    ├── tailwind.config.ts   # Tema Obsidian Charcoal & Slate Gray
    ├── postcss.config.mjs   # Configurația PostCSS / Autoprefixer
    ├── README.md            # Această documentație tehnică
    └── src/
        ├── app/
        │   ├── globals.css      # Stiluri globale și bare de defilare custom
        │   ├── layout.tsx       # Root layout cu metadata și clasa dark
        │   ├── page.tsx         # Dashboard-ul interactiv principal
        │   └── api/
        │       └── weather/
        │           └── route.ts # API route handler pentru cereri server-side
        ├── components/
        │   ├── WeatherHeader.tsx    # Antet cu titlu, selector de limbă și unitate
        │   ├── CitySearch.tsx       # Bară de căutare geocoding și butoane rapide
        │   ├── CurrentWeather.tsx   # Cardul principal cu temperatura și condiția meteo
        │   ├── HourlyForecast.tsx   # Prognoza orară pe 24h (scroll orizontal)
        │   ├── DailyForecast.tsx    # Prognoza pe 7 zile cu bare termice
        │   ├── WeatherMetrics.tsx   # Grila cu telemetria vântului, presiunii, UV etc.
        │   ├── AirQualityCard.tsx   # Cardul dedicat calității aerului (AQI & PM)
        │   ├── SunMoonTimes.tsx     # Orele de răsărit și apus
        │   └── WeatherIcons.tsx     # Setul vectorial de pictograme meteorologice
        └── lib/
            ├── types.ts             # Interfețele TypeScript pentru toate modelele de date
            ├── translations.ts      # Dicționarul bilingv și interpretarea codurilor WMO
            ├── weather-api.ts       # Serviciul de consum al API-urilor Open-Meteo
            └── mock-data.ts         # Date demonstrative offline pentru Craiova
```

---

## 5. Corelarea cu Jurnalul de Practică (18 Mai – 27 Mai 2026)

Dezvoltarea aplicației din `proiect/` a fost structurată și documentată progresiv de-a lungul stagiului de practică:

| Data Commit | Mesaj Commit | Activități Corelate în Jurnal |
| :--- | :--- | :--- |
| **18 Mai 2026** | `feat(weather): initialize Next.js 15 project structure and styling baseline` | Configurare mediu dezvoltare, inițializare Next.js, configurare Tailwind (`18mai.md`) |
| **19 Mai 2026** | `feat(weather): implement Open-Meteo API client, TypeScript types, and bilingual dictionary` | Definire modele de date, client HTTP Open-Meteo, dicționar RO/EN (`19mai.md`) |
| **20 Mai 2026** | `feat(weather): build current weather hero card and meteorological condition icons` | Componentă vizuală pentru temperatura curentă, pictograme SVG WMO (`20mai.md`) |
| **21 Mai 2026** | `feat(weather): add 24-hour timeline and 7-day extended forecast components` | Timeline orar derulabil și grafic săptămânal pe 7 zile (`21mai.md`) |
| **22 Mai 2026** | `feat(weather): implement weather telemetry metrics and air quality index monitoring` | Suport dezvoltare aplicație meteo: senzori presiune, vânt, UV, calitatea aerului (`22mai.md`) |
| **25 Mai 2026** | `feat(weather): integrate dynamic city search with geocoding and geolocation support` | Căutare geocoding, autocomplete, geolocalizare HTML5 (`25mai.md`) |
| **26 Mai 2026** | `feat(weather): assemble main dashboard page with reactive state and temperature toggle` | Asamblare pagină principală, comutare °C/°F, optimizare flux reactiv (`26mai.md`) |
| **27 Mai 2026** | `docs(weather): finalize practice project documentation and deployment guide` | Finalizare raport practică, redactare documentație tehnică completă (`27mai.md`) |

---

## 6. Instrucțiuni de Instalare și Rulare Locală

### Cerințe Preliminare:
- **Node.js**: versiunea 18.18+ sau 20+ (recomandat Node.js LTS)
- **npm** sau **yarn** / **pnpm**

### Pași de Rulare:

1. Navigați în directorul proiectului:
   ```bash
   cd PS2-Practica/proiect
   ```

2. Instalați dependențele:
   ```bash
   npm install
   ```

3. Porniți serverul de dezvoltare:
   ```bash
   npm run dev
   ```

4. Deschideți în browser adresa locală:
   ```text
   http://localhost:3000
   ```

5. Pentru compilarea versiunii de producție:
   ```bash
   npm run build
   npm run start
   ```

---

*Proiect realizat în cadrul stagiului de practică de specialitate la Universitatea din Craiova.*
