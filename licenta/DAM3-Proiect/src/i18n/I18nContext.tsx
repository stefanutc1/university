import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Language } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['ro']) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'ro',
  setLanguage: () => {},
  t: (key) => translations.ro[key] || key,
});

const STORAGE_KEY = '@mesh_app_language';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ro');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'en' || saved === 'ro') {
        setLanguageState(saved);
      }
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang).catch(() => {});
  };

  const t = (key: keyof typeof translations['ro']): string => {
    const dict = translations[language] || translations.ro;
    return dict[key] || translations.ro[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
