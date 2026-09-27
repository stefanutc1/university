import { FullWeatherData, GeoLocation, AirQualityMetrics } from './types';
import { MOCK_WEATHER_CRAIOVA } from './mock-data';

export async function searchCities(query: string): Promise<GeoLocation[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=6&language=ro&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding search failed');
    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      admin1: item.admin1,
      timezone: item.timezone,
    }));
  } catch (err) {
    console.warn('Geocoding API unavailable, falling back to local filter:', err);
    return [];
  }
}

export async function fetchWeatherData(location: GeoLocation): Promise<FullWeatherData> {
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,visibility,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.latitude}&longitude=${location.longitude}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;

    const [weatherRes, aqiRes] = await Promise.all([
      fetch(weatherUrl, { next: { revalidate: 300 } }),
      fetch(aqiUrl, { next: { revalidate: 600 } }).catch(() => null),
    ]);

    if (!weatherRes.ok) {
      throw new Error(`Weather API returned status ${weatherRes.status}`);
    }

    const wData = await weatherRes.json();
    let airQuality: AirQualityMetrics | undefined = undefined;

    if (aqiRes && aqiRes.ok) {
      const aqiData = await aqiRes.json();
      if (aqiData && aqiData.current) {
        airQuality = {
          europeanAqi: aqiData.current.european_aqi ?? 25,
          usAqi: aqiData.current.us_aqi ?? 35,
          pm10: aqiData.current.pm10 ?? 14,
          pm2_5: aqiData.current.pm2_5 ?? 8,
          carbonMonoxide: aqiData.current.carbon_monoxide ?? 210,
          nitrogenDioxide: aqiData.current.nitrogen_dioxide ?? 15,
          sulphurDioxide: aqiData.current.sulphur_dioxide ?? 2.5,
          ozone: aqiData.current.ozone ?? 45,
        };
      }
    }

    const cur = wData.current;
    const hourlyTimes: string[] = wData.hourly?.time || [];
    const hourlyTemps: number[] = wData.hourly?.temperature_2m || [];
    const hourlyApparent: number[] = wData.hourly?.apparent_temperature || [];
    const hourlyPrecipProb: number[] = wData.hourly?.precipitation_probability || [];
    const hourlyPrecip: number[] = wData.hourly?.precipitation || [];
    const hourlyCode: number[] = wData.hourly?.weather_code || [];
    const hourlyPressure: number[] = wData.hourly?.pressure_msl || [];
    const hourlyVis: number[] = wData.hourly?.visibility || [];
    const hourlyWind: number[] = wData.hourly?.wind_speed_10m || [];
    const hourlyUV: number[] = wData.hourly?.uv_index || [];

    // Find current hour index
    const nowISO = new Date().toISOString().slice(0, 13);
    let startIdx = hourlyTimes.findIndex((t) => t.startsWith(nowISO));
    if (startIdx === -1) startIdx = 0;

    const hourly = hourlyTimes.slice(startIdx, startIdx + 24).map((timeStr, i) => {
      const idx = startIdx + i;
      const dateObj = new Date(timeStr);
      const formattedTime = dateObj.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
      return {
        time: formattedTime,
        temperature: hourlyTemps[idx] ?? 20,
        apparentTemperature: hourlyApparent[idx] ?? 20,
        precipitationProbability: hourlyPrecipProb[idx] ?? 0,
        precipitation: hourlyPrecip[idx] ?? 0,
        weatherCode: hourlyCode[idx] ?? 0,
        pressure: hourlyPressure[idx] ?? 1013,
        visibility: Math.round((hourlyVis[idx] ?? 10000) / 100) / 10,
        windSpeed: hourlyWind[idx] ?? 10,
        uvIndex: hourlyUV[idx] ?? 0,
      };
    });

    const dailyDates: string[] = wData.daily?.time || [];
    const dailyCode: number[] = wData.daily?.weather_code || [];
    const dailyTempMax: number[] = wData.daily?.temperature_2m_max || [];
    const dailyTempMin: number[] = wData.daily?.temperature_2m_min || [];
    const dailyAppMax: number[] = wData.daily?.apparent_temperature_max || [];
    const dailyAppMin: number[] = wData.daily?.apparent_temperature_min || [];
    const dailySunrise: string[] = wData.daily?.sunrise || [];
    const dailySunset: string[] = wData.daily?.sunset || [];
    const dailyUVMax: number[] = wData.daily?.uv_index_max || [];
    const dailyPrecipSum: number[] = wData.daily?.precipitation_sum || [];
    const dailyPrecipProbMax: number[] = wData.daily?.precipitation_probability_max || [];
    const dailyWindMax: number[] = wData.daily?.wind_speed_10m_max || [];

    const daysRO = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă'];

    const daily = dailyDates.slice(0, 7).map((dStr, idx) => {
      const dObj = new Date(dStr);
      const dayName = daysRO[dObj.getDay()];
      const sRise = dailySunrise[idx] ? new Date(dailySunrise[idx]).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }) : '05:40';
      const sSet = dailySunset[idx] ? new Date(dailySunset[idx]).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }) : '20:50';

      return {
        date: idx === 0 ? 'Astăzi' : dayName,
        weatherCode: dailyCode[idx] ?? 0,
        temperatureMax: dailyTempMax[idx] ?? 24,
        temperatureMin: dailyTempMin[idx] ?? 12,
        apparentTemperatureMax: dailyAppMax[idx] ?? 24,
        apparentTemperatureMin: dailyAppMin[idx] ?? 12,
        sunrise: sRise,
        sunset: sSet,
        uvIndexMax: dailyUVMax[idx] ?? 5,
        precipitationSum: dailyPrecipSum[idx] ?? 0,
        precipitationProbabilityMax: dailyPrecipProbMax[idx] ?? 0,
        windSpeedMax: dailyWindMax[idx] ?? 12,
      };
    });

    return {
      location,
      lastUpdated: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
      current: {
        time: cur.time,
        temperature: cur.temperature_2m,
        apparentTemperature: cur.apparent_temperature,
        isDay: cur.is_day,
        weatherCode: cur.weather_code,
        relativeHumidity: cur.relative_humidity_2m,
        precipitation: cur.precipitation,
        rain: cur.rain,
        showers: cur.showers,
        snowfall: cur.snowfall,
        cloudCover: cur.cloud_cover,
        pressure: cur.pressure_msl,
        windSpeed: cur.wind_speed_10m,
        windDirection: cur.wind_direction_10m,
        windGusts: cur.wind_gusts_10m,
      },
      hourly,
      daily,
      airQuality,
    };
  } catch (err) {
    console.warn('Weather API failed, returning offline mock data:', err);
    return {
      ...MOCK_WEATHER_CRAIOVA,
      location,
      lastUpdated: new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
    };
  }
}
