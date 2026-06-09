'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { locales, defaultLocale, Locale } from './config';

type Dictionary = Record<string, unknown>;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Cache for loaded dictionaries
const dictionaryCache: Record<Locale, Dictionary | null> = {
  en: null,
  fr: null,
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [dictionary, setDictionary] = useState<Dictionary>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load dictionary
  const loadDictionary = useCallback(async (loc: Locale) => {
    if (dictionaryCache[loc]) {
      setDictionary(dictionaryCache[loc] as Dictionary);
      return;
    }

    try {
      const dict = await import(`./dictionaries/${loc}.json`);
      dictionaryCache[loc] = dict.default || dict;
      setDictionary(dictionaryCache[loc] as Dictionary);
    } catch (error) {
      console.error(`Failed to load dictionary for ${loc}:`, error);
      // Fallback to default locale
      if (loc !== defaultLocale) {
        const defaultDict = await import(`./dictionaries/${defaultLocale}.json`);
        dictionaryCache[defaultLocale] = defaultDict.default || defaultDict;
        setDictionary(dictionaryCache[defaultLocale] as Dictionary);
      }
    }
  }, []);

  // Initialize locale from localStorage or browser
  useEffect(() => {
    const savedLocale = localStorage.getItem('smas-locale') as Locale | null;
    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale);
    } else {
      // Check browser language
      const browserLang = navigator.language.split('-')[0] as Locale;
      if (locales.includes(browserLang)) {
        setLocaleState(browserLang);
      }
    }
  }, []);

  // Load dictionary when locale changes
  useEffect(() => {
    setIsLoading(true);
    loadDictionary(locale).finally(() => setIsLoading(false));
  }, [locale, loadDictionary]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('smas-locale', newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  // Translation function
  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: unknown = dictionary;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if not found
      }
    }

    return typeof value === 'string' ? value : key;
  }, [dictionary]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export { locales, defaultLocale };
export type { Locale };
