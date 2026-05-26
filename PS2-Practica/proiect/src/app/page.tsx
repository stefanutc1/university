'use client';

import React, { useState, useEffect } from 'react';
import { FullWeatherData, GeoLocation, Lang, TempUnit } from '@/lib/types';
import { DEFAULT_CITY, MOCK_WEATHER_CRAIOVA } from '@/lib/mock-data';
import { fetchWeatherData } from '@/lib/weather-api';
import { DICTIONARY } from '@/lib/translations';
import { WeatherHeader } from '@/components/WeatherHeader';
import { CitySearch } from '@/components/CitySearch';
import { CurrentWeather } from '@/components/CurrentWeather';
import { HourlyForecast } from '@/components/HourlyForecast';
import { DailyForecast } from '@/components/DailyForecast';
import { WeatherMetrics } from '@/components/WeatherMetrics';
import { AirQualityCard } from '@/components/AirQualityCard';
import { SunMoonTimes } from '@/components/SunMoonTimes';

export default function WeatherDashboard() {
  const [currentCity, setCurrentCity] = useState<GeoLocation>(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState<FullWeatherData>(MOCK_WEATHER_CRAIOVA);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lang, setLang] = useState<Lang>('ro');
  const [unit, setUnit] = useState<TempUnit>('C');

  // Load weather when selected city changes
  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchWeatherData(currentCity);
        if (isMounted) {
          setWeatherData(data);
        }
      } catch (err) {
        console.warn('Fallback to cached mock state:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [currentCity]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'ro' ? 'en' : 'ro'));
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const t = DICTIONARY[lang];
  const todayDaily = weatherData.daily[0];

  return (
    <div className="min-h-screen bg-[#08090b] text-[#f3f4f6] flex flex-col font-sans">
      {/* Container */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        
        {/* Header with Title and Settings */}
        <WeatherHeader
          lang={lang}
          unit={unit}
          onToggleLang={toggleLang}
          onToggleUnit={toggleUnit}
        />

        {/* City Search Bar & Popular Quick Filters */}
        <CitySearch
          onSelectCity={(city) => setCurrentCity(city)}
          currentCity={currentCity}
          lang={lang}
        />

        {/* Loading Bar Indicator */}
        {isLoading && (
          <div className="w-full h-1 bg-obsidian-850 rounded-full overflow-hidden">
            <div className="h-full bg-slate-400 animate-pulse w-1/2 rounded-full" />
          </div>
        )}

        {/* Main Current Weather Hero Card */}
        <CurrentWeather data={weatherData} lang={lang} unit={unit} />

        {/* 24-Hour Hourly Timeline */}
        <HourlyForecast items={weatherData.hourly} lang={lang} unit={unit} />

        {/* 2-Column Section: 7-Day Extended Forecast + Telemetry Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: 7-Day Extended Forecast (7 cols on lg) */}
          <div className="lg:col-span-6 space-y-6">
            <DailyForecast items={weatherData.daily} lang={lang} unit={unit} />

            {/* Sun & Moon Times */}
            <SunMoonTimes
              sunrise={todayDaily?.sunrise || '05:40'}
              sunset={todayDaily?.sunset || '20:55'}
              lang={lang}
            />
          </div>

          {/* Right: Atmospheric Telemetry & Air Quality (6 cols on lg) */}
          <div className="lg:col-span-6 space-y-6">
            <WeatherMetrics
              current={weatherData.current}
              uvIndexMax={todayDaily?.uvIndexMax || 6.5}
              lang={lang}
              unit={unit}
            />

            {/* Air Quality Index Card */}
            {weatherData.airQuality && (
              <AirQualityCard aqi={weatherData.airQuality} lang={lang} />
            )}
          </div>

        </div>

      </div>

      {/* Footer with UCV Practice attribution */}
      <footer className="w-full py-8 border-t border-obsidian-750/80 bg-[#050608] mt-12 text-xs font-sans text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-semibold text-slate-300">{t.universityCredit}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t.footerTech}</div>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Craiova, Dolj • Proiect PS2
          </div>
        </div>
      </footer>
    </div>
  );
}
