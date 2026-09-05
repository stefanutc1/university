import React from 'react';
import { DailyForecastItem, Lang, TempUnit } from '@/lib/types';
import { getWeatherCondition, DICTIONARY } from '@/lib/translations';
import { WeatherCodeIcon, DropletsIcon } from './WeatherIcons';

interface DailyForecastProps {
  items: DailyForecastItem[];
  lang: Lang;
  unit: TempUnit;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ items, lang, unit }) => {
  const t = DICTIONARY[lang];

  const displayTemp = (tempC: number) => {
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  };

  // Find min and max across entire week for proportional bars
  const weekMin = Math.min(...items.map((it) => it.temperatureMin));
  const weekMax = Math.max(...items.map((it) => it.temperatureMax));
  const tempRange = Math.max(1, weekMax - weekMin);

  return (
    <div className="rounded-3xl bg-[#0c0e11] border border-obsidian-750 p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wide uppercase font-mono text-slate-300">
          {t.dailyForecast}
        </h2>
        <span className="text-xs font-mono text-slate-500">7 Days</span>
      </div>

      <div className="space-y-2.5">
        {items.map((item, index) => {
          const condition = getWeatherCondition(item.weatherCode, lang);
          const isToday = index === 0;

          // Bar calculation
          const leftPercent = ((item.temperatureMin - weekMin) / tempRange) * 100;
          const widthPercent = Math.max(15, ((item.temperatureMax - item.temperatureMin) / tempRange) * 100);

          return (
            <div
              key={`${item.date}-${index}`}
              className="flex items-center justify-between p-3 rounded-2xl bg-obsidian-900/60 border border-obsidian-750/70 hover:bg-obsidian-850 hover:border-obsidian-700 transition-colors gap-3 sm:gap-4"
            >
              {/* Day name */}
              <div className="w-24 sm:w-28 flex-shrink-0">
                <span className={`text-sm font-medium ${isToday ? 'text-white font-bold' : 'text-slate-300'}`}>
                  {isToday ? (lang === 'ro' ? 'Astăzi' : 'Today') : item.date}
                </span>
                <div className="text-[11px] text-slate-500 truncate hidden sm:block">
                  {condition.label}
                </div>
              </div>

              {/* Weather icon & rain chance */}
              <div className="flex items-center gap-2 w-16 sm:w-20 justify-start flex-shrink-0">
                <WeatherCodeIcon code={item.weatherCode} className="w-6 h-6 text-slate-300" />
                {item.precipitationProbabilityMax > 0 && (
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-0.5">
                    <DropletsIcon className="w-2.5 h-2.5" />
                    {item.precipitationProbabilityMax}%
                  </span>
                )}
              </div>

              {/* Min temp */}
              <span className="text-xs font-mono text-slate-400 w-8 text-right flex-shrink-0">
                {displayTemp(item.temperatureMin)}°
              </span>

              {/* Horizontal range bar */}
              <div className="flex-1 h-2 rounded-full bg-obsidian-800 overflow-hidden relative mx-1 sm:mx-2 hidden xs:block">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-slate-600 via-slate-400 to-slate-200"
                  style={{
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                />
              </div>

              {/* Max temp */}
              <span className="text-xs font-mono font-bold text-white w-8 text-right flex-shrink-0">
                {displayTemp(item.temperatureMax)}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
