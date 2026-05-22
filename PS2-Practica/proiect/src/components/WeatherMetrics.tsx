import React from 'react';
import { CurrentWeatherMetrics, Lang, TempUnit } from '@/lib/types';
import { DICTIONARY } from '@/lib/translations';
import { WindIcon, DropletsIcon, GaugeIcon, EyeIcon, CompassIcon } from './WeatherIcons';

interface WeatherMetricsProps {
  current: CurrentWeatherMetrics;
  uvIndexMax: number;
  lang: Lang;
  unit: TempUnit;
}

export const WeatherMetrics: React.FC<WeatherMetricsProps> = ({ current, uvIndexMax, lang, unit }) => {
  const t = DICTIONARY[lang];

  // Wind cardinal direction
  const getWindDirectionLabel = (deg: number) => {
    const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const idx = Math.round(deg / 45) % 8;
    return cardinals[idx];
  };

  // UV index level
  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { text: lang === 'ro' ? 'Scăzut' : 'Low', color: 'text-slate-300' };
    if (uv <= 5) return { text: lang === 'ro' ? 'Moderat' : 'Moderate', color: 'text-slate-200' };
    if (uv <= 7) return { text: lang === 'ro' ? 'Ridicat' : 'High', color: 'text-slate-100 font-bold' };
    if (uv <= 10) return { text: lang === 'ro' ? 'Foarte Ridicat' : 'Very High', color: 'text-white font-bold' };
    return { text: lang === 'ro' ? 'Extrem' : 'Extreme', color: 'text-white font-black' };
  };

  const uvInfo = getUvLevel(uvIndexMax);

  // Dew point approximation (Magnus formula)
  const calculateDewPoint = (tempC: number, rh: number) => {
    const a = 17.27;
    const b = 237.7;
    const alpha = (a * tempC) / (b + tempC) + Math.log(rh / 100);
    const dp = (b * alpha) / (a - alpha);
    if (unit === 'F') return `${Math.round((dp * 9) / 5 + 32)}°F`;
    return `${Math.round(dp * 10) / 10}°C`;
  };

  const metrics = [
    {
      title: t.wind,
      value: `${current.windSpeed} ${t.kmh}`,
      subtext: `${t.windGusts}: ${current.windGusts} ${t.kmh} • ${getWindDirectionLabel(current.windDirection)} (${current.windDirection}°)`,
      icon: <WindIcon className="w-5 h-5 text-slate-400" />,
    },
    {
      title: t.humidity,
      value: `${current.relativeHumidity}%`,
      subtext: `${t.dewPoint}: ${calculateDewPoint(current.temperature, current.relativeHumidity)}`,
      icon: <DropletsIcon className="w-5 h-5 text-slate-400" />,
    },
    {
      title: t.pressure,
      value: `${Math.round(current.pressure)} ${t.hpa}`,
      subtext: current.pressure > 1013 ? (lang === 'ro' ? 'Presiune ridicată' : 'High pressure') : (lang === 'ro' ? 'Presiune scăzută' : 'Low pressure'),
      icon: <GaugeIcon className="w-5 h-5 text-slate-400" />,
    },
    {
      title: t.uvIndex,
      value: `${uvIndexMax}`,
      subtext: `${uvInfo.text} • ${lang === 'ro' ? 'Maximul zilei' : 'Daily peak'}`,
      icon: <EyeIcon className="w-5 h-5 text-slate-400" />,
    },
    {
      title: t.visibility,
      value: '10.0+ km',
      subtext: lang === 'ro' ? 'Vizibilitate excelentă' : 'Excellent visibility',
      icon: <CompassIcon className="w-5 h-5 text-slate-400" />,
    },
    {
      title: t.precipitation,
      value: `${current.precipitation} mm`,
      subtext: current.precipitation > 0 ? (lang === 'ro' ? 'Precipitații active' : 'Active precipitation') : (lang === 'ro' ? 'Fără ploaie înregistrată' : 'No rain recorded'),
      icon: <DropletsIcon className="w-5 h-5 text-slate-400" />,
    },
  ];

  return (
    <div className="rounded-3xl bg-[#0c0e11] border border-obsidian-750 p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wide uppercase font-mono text-slate-300">
          {t.telemetryTitle}
        </h2>
        <span className="text-xs font-mono text-slate-500">Telemetry</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-obsidian-900/70 border border-obsidian-750 hover:bg-obsidian-850 hover:border-obsidian-700 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">{m.title}</span>
              {m.icon}
            </div>

            <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight my-1">
              {m.value}
            </div>

            <div className="text-[11px] text-slate-400 font-mono mt-1">
              {m.subtext}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
