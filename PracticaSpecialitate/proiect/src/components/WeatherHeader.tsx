import React from 'react';
import { Lang, TempUnit } from '@/lib/types';
import { DICTIONARY } from '@/lib/translations';

interface WeatherHeaderProps {
  lang: Lang;
  unit: TempUnit;
  onToggleLang: () => void;
  onToggleUnit: () => void;
}

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  lang,
  unit,
  onToggleLang,
  onToggleUnit,
}) => {
  const t = DICTIONARY[lang];

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-obsidian-750/80">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-obsidian-800 to-slate-700 border border-slate-600 flex items-center justify-center text-white font-bold font-mono text-lg shadow-lg">
          ☁
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white">{t.appName}</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-obsidian-800 border border-obsidian-700 text-slate-400">
              UCV
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans">{t.appSubtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 font-mono text-xs self-end sm:self-center">
        {/* Language switch button */}
        <button
          onClick={onToggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-900 border border-obsidian-750 hover:border-obsidian-600 text-slate-300 hover:text-white transition-colors"
          title="Schimbă Limba / Change Language"
        >
          <span className="text-[10px] text-slate-500">LANG</span>
          <span className="font-bold text-white">{lang.toUpperCase()}</span>
        </button>

        {/* Temperature unit switch button */}
        <div className="flex items-center p-1 rounded-xl bg-obsidian-900 border border-obsidian-750">
          <button
            onClick={() => {
              if (unit !== 'C') onToggleUnit();
            }}
            className={`px-2.5 py-1 rounded-lg transition-colors font-bold ${
              unit === 'C'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => {
              if (unit !== 'F') onToggleUnit();
            }}
            className={`px-2.5 py-1 rounded-lg transition-colors font-bold ${
              unit === 'F'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
};
