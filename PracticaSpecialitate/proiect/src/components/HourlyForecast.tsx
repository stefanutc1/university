import React from 'react';
import { HourlyForecastItem, Lang, TempUnit } from '@/lib/types';
import { DICTIONARY } from '@/lib/translations';
import { WeatherCodeIcon, DropletsIcon } from './WeatherIcons';

interface HourlyForecastProps {
  items: HourlyForecastItem[];
  lang: Lang;
  unit: TempUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ items, lang, unit }) => {
  const t = DICTIONARY[lang];

  const displayTemp = (tempC: number) => {
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  };

  return (
    <div className="rounded-3xl bg-[#0c0e11] border border-obsidian-750 p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wide uppercase font-mono text-slate-300">
          {t.hourlyForecast}
        </h2>
        <span className="text-xs font-mono text-slate-500">24h</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-obsidian-700">
        {items.map((item, index) => {
          const isCurrentHour = index === 0;

          return (
            <div
              key={`${item.time}-${index}`}
              className={`flex-shrink-0 flex flex-col items-center justify-between w-20 py-3.5 px-2 rounded-2xl border transition-all ${
                isCurrentHour
                  ? 'bg-obsidian-800 border-slate-600 shadow-md ring-1 ring-slate-500/20'
                  : 'bg-obsidian-900/60 border-obsidian-750 hover:bg-obsidian-850 hover:border-obsidian-700'
              }`}
            >
              <span className={`text-xs font-mono ${isCurrentHour ? 'text-white font-bold' : 'text-slate-400'}`}>
                {isCurrentHour ? (lang === 'ro' ? 'Acum' : 'Now') : item.time}
              </span>

              <div className="my-2.5 text-slate-300">
                <WeatherCodeIcon code={item.weatherCode} className="w-7 h-7" />
              </div>

              <span className="text-base font-bold font-mono text-white">
                {displayTemp(item.temperature)}°
              </span>

              {item.precipitationProbability > 0 ? (
                <div className="flex items-center gap-0.5 mt-2 text-[10px] font-mono text-slate-400">
                  <DropletsIcon className="w-3 h-3 text-slate-400" />
                  <span>{item.precipitationProbability}%</span>
                </div>
              ) : (
                <div className="mt-2 text-[10px] font-mono text-slate-600">0%</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
