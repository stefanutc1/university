export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone?: string;
}

export interface CurrentWeatherMetrics {
  time: string;
  temperature: number;
  apparentTemperature: number;
  isDay: number;
  weatherCode: number;
  relativeHumidity: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  cloudCover: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  pressure: number;
  visibility: number;
  windSpeed: number;
  uvIndex: number;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
}

export interface AirQualityMetrics {
  europeanAqi: number;
  usAqi: number;
  pm10: number;
  pm2_5: number;
  carbonMonoxide: number;
  nitrogenDioxide: number;
  sulphurDioxide: number;
  ozone: number;
}

export interface FullWeatherData {
  location: GeoLocation;
  current: CurrentWeatherMetrics;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  airQuality?: AirQualityMetrics;
  lastUpdated: string;
}

export type TempUnit = 'C' | 'F';
export type Lang = 'ro' | 'en';
