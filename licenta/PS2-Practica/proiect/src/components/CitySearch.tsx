'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GeoLocation, Lang } from '@/lib/types';
import { DICTIONARY } from '@/lib/translations';
import { POPULAR_CITIES } from '@/lib/mock-data';
import { searchCities } from '@/lib/weather-api';
import { SearchIcon, MapPinIcon } from './WeatherIcons';

interface CitySearchProps {
  onSelectCity: (city: GeoLocation) => void;
  currentCity: GeoLocation;
  lang: Lang;
}

export const CitySearch: React.FC<CitySearchProps> = ({ onSelectCity, currentCity, lang }) => {
  const t = DICTIONARY[lang];
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const found = await searchCities(query);
        setResults(found);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (city: GeoLocation) => {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === 'ro' ? 'Geolocația nu este suportată de browser.' : 'Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const userLoc: GeoLocation = {
          id: 999999,
          name: lang === 'ro' ? 'Locația Ta Curentă' : 'Your Current Location',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          country: lang === 'ro' ? 'Coordonate GPS' : 'GPS Coordinates',
        };
        onSelectCity(userLoc);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        alert(lang === 'ro' ? 'Nu s-a putut obține locația curentă. Permisiune refuzată.' : 'Unable to retrieve current location.');
      },
      { timeout: 8000 }
    );
  };

  return (
    <div ref={containerRef} className="w-full space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Search input bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <SearchIcon className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-obsidian-900 border border-obsidian-750 focus:border-slate-500 text-sm text-white placeholder-slate-500 font-sans focus:outline-none transition-colors shadow-inner"
          />

          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
              <div className="w-4 h-4 rounded-full border-2 border-slate-500 border-t-transparent animate-spin" />
            </div>
          )}
        </div>

        {/* Geolocation Button */}
        <button
          onClick={handleUseLocation}
          disabled={isLocating}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-750 hover:border-obsidian-700 text-xs font-mono text-slate-300 transition-colors flex-shrink-0"
        >
          <MapPinIcon className="w-4 h-4 text-slate-400" />
          <span>{isLocating ? t.locating : t.useLocation}</span>
        </button>
      </div>

      {/* Autocomplete Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-w-xl rounded-2xl bg-obsidian-900 border border-obsidian-700 shadow-2xl overflow-hidden font-sans">
          <div className="max-h-60 overflow-y-auto divide-y divide-obsidian-800">
            {results.map((city) => (
              <button
                key={`${city.id}-${city.latitude}-${city.longitude}`}
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-3 text-left hover:bg-obsidian-800 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-white text-sm">{city.name}</span>
                  {city.admin1 && <span className="text-slate-400 text-xs">{city.admin1}</span>}
                </div>
                <span className="text-slate-400 font-mono text-[11px] px-2 py-0.5 rounded bg-obsidian-950 border border-obsidian-800">
                  {city.country}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular City Quick Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
        <span className="text-slate-500 flex-shrink-0 text-[11px] uppercase tracking-wider">
          {t.popularCities}
        </span>
        {POPULAR_CITIES.map((city) => {
          const isSelected = currentCity.name === city.name;
          return (
            <button
              key={city.id}
              onClick={() => handleSelect(city)}
              className={`flex-shrink-0 px-3 py-1 rounded-full border text-xs transition-colors ${
                isSelected
                  ? 'bg-slate-700 border-slate-500 text-white font-semibold'
                  : 'bg-obsidian-900/80 border-obsidian-750 text-slate-400 hover:text-white hover:bg-obsidian-800'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
