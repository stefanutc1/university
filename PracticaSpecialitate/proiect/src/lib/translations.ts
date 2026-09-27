import { Lang } from './types';

export interface WeatherConditionInfo {
  label: string;
  description: string;
  icon: string;
}

export const WMO_CODES: Record<number, { ro: WeatherConditionInfo; en: WeatherConditionInfo }> = {
  0: {
    ro: { label: 'Senin', description: 'Cer complet senin, fără nori', icon: 'sun' },
    en: { label: 'Clear Sky', description: 'Completely clear sky', icon: 'sun' },
  },
  1: {
    ro: { label: 'Predominant Senin', description: 'Câțiva nori răzleți', icon: 'sun-cloud' },
    en: { label: 'Mainly Clear', description: 'Mostly sunny with scattered clouds', icon: 'sun-cloud' },
  },
  2: {
    ro: { label: 'Parțial Noros', description: 'Nori și soare alternativ', icon: 'cloud-sun' },
    en: { label: 'Partly Cloudy', description: 'Intermittent clouds and sunshine', icon: 'cloud-sun' },
  },
  3: {
    ro: { label: 'Înnorat', description: 'Cer acoperit complet de nori', icon: 'cloud' },
    en: { label: 'Overcast', description: 'Continuous overcast sky', icon: 'cloud' },
  },
  45: {
    ro: { label: 'Ceață', description: 'Ceață densă la sol', icon: 'fog' },
    en: { label: 'Fog', description: 'Dense fog near ground', icon: 'fog' },
  },
  48: {
    ro: { label: 'Ceață cu Chiciură', description: 'Depunere de chiciură', icon: 'fog' },
    en: { label: 'Depositing Rime Fog', description: 'Fog with rime deposition', icon: 'fog' },
  },
  51: {
    ro: { label: 'Burniță Ușoară', description: 'Precipitații fine și dese', icon: 'drizzle' },
    en: { label: 'Light Drizzle', description: 'Fine light droplets', icon: 'drizzle' },
  },
  53: {
    ro: { label: 'Burniță Moderată', description: 'Burniță continuă', icon: 'drizzle' },
    en: { label: 'Moderate Drizzle', description: 'Steady drizzle', icon: 'drizzle' },
  },
  55: {
    ro: { label: 'Burniță Densă', description: 'Burniță abundentă', icon: 'drizzle' },
    en: { label: 'Dense Drizzle', description: 'Heavy drizzle', icon: 'drizzle' },
  },
  61: {
    ro: { label: 'Ploaie Ușoară', description: 'Ploaie slabă intermitentă', icon: 'rain' },
    en: { label: 'Slight Rain', description: 'Intermittent slight rain', icon: 'rain' },
  },
  63: {
    ro: { label: 'Ploaie Moderată', description: 'Ploaie susținută', icon: 'rain' },
    en: { label: 'Moderate Rain', description: 'Sustained rain showers', icon: 'rain' },
  },
  65: {
    ro: { label: 'Ploaie Torențială', description: 'Averse torențiale abundente', icon: 'heavy-rain' },
    en: { label: 'Heavy Rain', description: 'Intense heavy rain shower', icon: 'heavy-rain' },
  },
  71: {
    ro: { label: 'Ninsoare Slabă', description: 'Fulgulire ușoară', icon: 'snow' },
    en: { label: 'Slight Snow Fall', description: 'Light flurries of snow', icon: 'snow' },
  },
  73: {
    ro: { label: 'Ninsoare Moderată', description: 'Ninsoare stabilă', icon: 'snow' },
    en: { label: 'Moderate Snow Fall', description: 'Steady snowfall', icon: 'snow' },
  },
  75: {
    ro: { label: 'Ninsoare Abundentă', description: 'Ninsoare viscolită puternică', icon: 'heavy-snow' },
    en: { label: 'Heavy Snow Fall', description: 'Heavy blizzard snowfall', icon: 'heavy-snow' },
  },
  80: {
    ro: { label: 'Averse Slabe', description: 'Averse scurte de ploaie', icon: 'rain' },
    en: { label: 'Slight Rain Showers', description: 'Brief scattered showers', icon: 'rain' },
  },
  81: {
    ro: { label: 'Averse Moderate', description: 'Averse puternice locale', icon: 'heavy-rain' },
    en: { label: 'Moderate Showers', description: 'Localized rain downpours', icon: 'heavy-rain' },
  },
  82: {
    ro: { label: 'Averse Violente', description: 'Ploaie torențială extremă', icon: 'heavy-rain' },
    en: { label: 'Violent Showers', description: 'Violent cloudbursts', icon: 'heavy-rain' },
  },
  95: {
    ro: { label: 'Furtună cu Descărcări', description: 'Furtună electrică cu tunete', icon: 'thunder' },
    en: { label: 'Thunderstorm', description: 'Thunderstorm with lightning', icon: 'thunder' },
  },
  96: {
    ro: { label: 'Furtună cu Grindină Slabă', description: 'Furtună însoțită de grindină', icon: 'thunder' },
    en: { label: 'Thunderstorm with Slight Hail', description: 'Thunderstorm with small hail', icon: 'thunder' },
  },
  99: {
    ro: { label: 'Furtună Violentă cu Grindină', description: 'Grindină masivă și vijelie', icon: 'thunder' },
    en: { label: 'Severe Thunderstorm with Heavy Hail', description: 'Severe convective storm with hail', icon: 'thunder' },
  },
};

export function getWeatherCondition(code: number, lang: Lang): WeatherConditionInfo {
  const item = WMO_CODES[code] || WMO_CODES[0];
  return item[lang];
}

export const DICTIONARY = {
  ro: {
    appName: 'MeteoPulse UCV',
    appSubtitle: 'Prognoză Atmosferică & Telemetrie Meteorologică',
    searchPlaceholder: 'Caută oraș (ex: Craiova, București, Cluj, Paris)...',
    useLocation: 'Locația Mea',
    locating: 'Se localizează...',
    popularCities: 'Orașe Populare:',
    lastUpdated: 'Actualizat',
    feelsLike: 'Se simte ca',
    humidity: 'Umiditate',
    wind: 'Vânt',
    windGusts: 'Rafale',
    pressure: 'Presiune',
    uvIndex: 'Indice UV',
    visibility: 'Vizibilitate',
    dewPoint: 'Punct de Rouă',
    precipitation: 'Precipitații',
    precipChance: 'Probabilitate ploaie',
    sunrise: 'Răsărit',
    sunset: 'Apus',
    hourlyForecast: 'Prognoză Orară (24 Ore)',
    dailyForecast: 'Prognoză Extinsă (7 Zile)',
    airQuality: 'Calitatea Aerului (AQI)',
    aqiGood: 'Excelent',
    aqiModerate: 'Moderat',
    aqiUnhealthy: 'Nefavorabil',
    aqiVeryUnhealthy: 'Poluat',
    aqiHazardous: 'Periculos',
    telemetryTitle: 'Parametri Atmosferici Detaliați',
    today: 'Astăzi',
    tomorrow: 'Mâine',
    celsius: '°C',
    fahrenheit: '°F',
    kmh: 'km/h',
    hpa: 'hPa',
    km: 'km',
    offlineBadge: 'Mod Offline (Date Salvate)',
    universityCredit: 'Universitatea din Craiova • Facultatea de Științe • Proiect Practică Software Anul 2',
    footerTech: 'Construit cu Next.js 15, React 19, TypeScript, Tailwind CSS & Open-Meteo API',
  },
  en: {
    appName: 'MeteoPulse UCV',
    appSubtitle: 'Atmospheric Forecast & Meteorological Telemetry',
    searchPlaceholder: 'Search city (e.g. Craiova, London, New York, Tokyo)...',
    useLocation: 'My Location',
    locating: 'Locating...',
    popularCities: 'Popular Cities:',
    lastUpdated: 'Updated',
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    wind: 'Wind',
    windGusts: 'Gusts',
    pressure: 'Pressure',
    uvIndex: 'UV Index',
    visibility: 'Visibility',
    dewPoint: 'Dew Point',
    precipitation: 'Precipitation',
    precipChance: 'Rain probability',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    hourlyForecast: 'Hourly Forecast (24h)',
    dailyForecast: 'Extended Forecast (7 Days)',
    airQuality: 'Air Quality (AQI)',
    aqiGood: 'Good',
    aqiModerate: 'Moderate',
    aqiUnhealthy: 'Unhealthy',
    aqiVeryUnhealthy: 'Very Unhealthy',
    aqiHazardous: 'Hazardous',
    telemetryTitle: 'Detailed Atmospheric Telemetry',
    today: 'Today',
    tomorrow: 'Tomorrow',
    celsius: '°C',
    fahrenheit: '°F',
    kmh: 'km/h',
    hpa: 'hPa',
    km: 'km',
    offlineBadge: 'Offline Mode (Cached Data)',
    universityCredit: 'University of Craiova • Faculty of Sciences • Year 2 Software Practice Project',
    footerTech: 'Built with Next.js 15, React 19, TypeScript, Tailwind CSS & Open-Meteo API',
  },
};
