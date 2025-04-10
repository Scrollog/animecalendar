import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { translations, LanguageCode, TranslationKeys } from './translations';

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: TranslationKeys;
}

// Create context with default values
export const LanguageContext = createContext<LanguageContextProps>({
  language: 'en-US',
  setLanguage: () => {},
  t: translations['en-US'],
});

// Create provider
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with localStorage value or default to 'en-US'
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const savedLanguage = localStorage.getItem('language') as LanguageCode;
    // Check if the saved language is valid
    return savedLanguage && translations[savedLanguage] ? savedLanguage : 'en-US';
  });

  // Get the current translations
  const t = translations[language];

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);