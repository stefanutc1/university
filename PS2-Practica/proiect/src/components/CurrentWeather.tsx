import React from 'react';
import { FullWeatherData, Lang, TempUnit } from '@/lib/types';
import { getWeatherCondition, DICTIONARY } from '@/lib/translations';
import { WeatherCodeIcon, MapPinIcon } from './WeatherIcons';

interface CurrentWeatherProps {
  data: FullWeatherData;
  lang: Lang;
  unit: TempUnit;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, lang, unit }) => {
  const t = DICTIONARY[lang];
  const { current, location, daily, lastUpdated } = data;
  const condition = getWeatherCondition(current.weatherCode, lang);

  const displayTemp = (tempC: number) => {
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  };

  const todayDaily = daily[0];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121519] via-[#0c0e11] to-[#08090b] border border-obsidian-750 p-6 sm:p-8 shadow-2xl">
      {/* Background radial glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-slate-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Location & Main Temperature */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPinIcon className="w-5 h-5 text-slate-400" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {location.name}
              <span className="text-slate-400 font-normal text-base ml-2">
                {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
              </span>
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-white font-mono">
              {displayTemp(current.temperature)}°
            </span>
            <div className="flex flex-col text-slate-400 font-mono text-xs">
              <span className="text-slate-300 font-medium">
                {unit === 'C' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
              </span>
              <span>
                {t.feelsLike}: <strong className="text-slate-200">{displayTemp(current.apparentTemperature)}°</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-obsidian-800 border border-obsidian-700 text-slate-200">
              Min: {displayTemp(todayDaily?.temperatureMin ?? current.temperature - 5)}° / Max: {displayTemp(todayDaily?.temperatureMax ?? current.temperature + 5)}°
            </span>
            <span className="px-3 py-1 rounded-full bg-obsidian-800 border border-obsidian-700 text-slate-400">
              {t.lastUpdated}: {lastUpdated}
            </span>
          </div>
        </div>

        {/* Right: Weather Condition Icon & Description */}
        <div className="flex items-center md:flex-col md:items-end gap-4 p-4 rounded-2xl bg-obsidian-900/60 border border-obsidian-800 backdrop-blur-sm">
          <div className="p-3 rounded-2xl bg-obsidian-850 border border-obsidian-750 text-slate-200 shadow-inner">
            <WeatherCodeIcon
              code={current.weatherCode}
              isDay={current.isDay}
              className="w-14 h-14 sm:w-16 sm:h-16 text-slate-200"
            />
          </div>

          <div className="md:text-right space-y-1">
            <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {condition.label}
            </div>
            <div className="text-xs text-slate-400 max-w-xs">
              {condition.description}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
