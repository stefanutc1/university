import React from 'react';
import { AirQualityMetrics, Lang } from '@/lib/types';
import { DICTIONARY } from '@/lib/translations';

interface AirQualityCardProps {
  aqi?: AirQualityMetrics;
  lang: Lang;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ aqi, lang }) => {
  const t = DICTIONARY[lang];

  if (!aqi) {
    return null;
  }

  const getAqiStatus = (europeanAqi: number) => {
    if (europeanAqi <= 20) {
      return { label: t.aqiGood, desc: lang === 'ro' ? 'Calitatea aerului este ideală pentru activități în aer liber.' : 'Air quality is ideal for outdoor activities.' };
    }
    if (europeanAqi <= 40) {
      return { label: t.aqiModerate, desc: lang === 'ro' ? 'Calitate acceptabilă a aerului pentru majoritatea persoanelor.' : 'Air quality is acceptable for most people.' };
    }
    if (europeanAqi <= 60) {
      return { label: t.aqiUnhealthy, desc: lang === 'ro' ? 'Persoanele sensibile pot resimți iritații respiratorii ușoare.' : 'Sensitive individuals may experience minor irritation.' };
    }
    if (europeanAqi <= 80) {
      return { label: t.aqiVeryUnhealthy, desc: lang === 'ro' ? 'Se recomandă limitarea efortului fizic prelungit afară.' : 'Limit prolonged outdoor exertion.' };
    }
    return { label: t.aqiHazardous, desc: lang === 'ro' ? 'Nivel ridicat de poluare atmosferică.' : 'High atmospheric pollution level.' };
  };

  const status = getAqiStatus(aqi.europeanAqi);

  return (
    <div className="rounded-3xl bg-[#0c0e11] border border-obsidian-750 p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-wide uppercase font-mono text-slate-300">
          {t.airQuality}
        </h2>
        <span className="px-2.5 py-0.5 rounded-full bg-obsidian-800 border border-obsidian-700 text-xs font-mono text-slate-300">
          EU AQI {aqi.europeanAqi}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-obsidian-900/60 border border-obsidian-750 mb-4 gap-3">
        <div>
          <div className="text-lg font-bold text-white tracking-tight">
            {status.label}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {status.desc}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center font-mono">
          <span className="text-2xl font-black text-white">{aqi.europeanAqi}</span>
          <span className="text-xs text-slate-500 uppercase">Index</span>
        </div>
      </div>

      {/* Particulate pollutants grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="p-3 rounded-xl bg-obsidian-850/80 border border-obsidian-750/70">
          <div className="text-[10px] text-slate-400">PM2.5</div>
          <div className="text-sm font-bold text-white mt-0.5">{aqi.pm2_5} µg/m³</div>
        </div>

        <div className="p-3 rounded-xl bg-obsidian-850/80 border border-obsidian-750/70">
          <div className="text-[10px] text-slate-400">PM10</div>
          <div className="text-sm font-bold text-white mt-0.5">{aqi.pm10} µg/m³</div>
        </div>

        <div className="p-3 rounded-xl bg-obsidian-850/80 border border-obsidian-750/70">
          <div className="text-[10px] text-slate-400">Ozon (O₃)</div>
          <div className="text-sm font-bold text-white mt-0.5">{aqi.ozone} µg/m³</div>
        </div>

        <div className="p-3 rounded-xl bg-obsidian-850/80 border border-obsidian-750/70">
          <div className="text-[10px] text-slate-400">NO₂</div>
          <div className="text-sm font-bold text-white mt-0.5">{aqi.nitrogenDioxide} µg/m³</div>
        </div>
      </div>
    </div>
  );
};
