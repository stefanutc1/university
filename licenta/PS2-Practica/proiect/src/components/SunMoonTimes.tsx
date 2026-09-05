import React from 'react';
import { Lang } from '@/lib/types';
import { DICTIONARY } from '@/lib/translations';
import { SunriseIcon, SunsetIcon } from './WeatherIcons';

interface SunMoonTimesProps {
  sunrise: string;
  sunset: string;
  lang: Lang;
}

export const SunMoonTimes: React.FC<SunMoonTimesProps> = ({ sunrise, sunset, lang }) => {
  const t = DICTIONARY[lang];

  return (
    <div className="rounded-3xl bg-[#0c0e11] border border-obsidian-750 p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wide uppercase font-mono text-slate-300">
          {lang === 'ro' ? 'Ciclu Solar' : 'Solar Cycle'}
        </h2>
        <span className="text-xs font-mono text-slate-500">Daylight</span>
      </div>

      <div className="grid grid-cols-2 gap-3.5 font-mono">
        <div className="p-4 rounded-2xl bg-obsidian-900/60 border border-obsidian-750 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-slate-300">
            <SunriseIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase">{t.sunrise}</div>
            <div className="text-lg font-bold text-white mt-0.5">{sunrise}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-obsidian-900/60 border border-obsidian-750 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-obsidian-800 border border-obsidian-700 text-slate-300">
            <SunsetIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase">{t.sunset}</div>
            <div className="text-lg font-bold text-white mt-0.5">{sunset}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
