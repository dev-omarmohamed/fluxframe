"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, Language } from "@/lib/i18n";

type TranslationKey = keyof typeof translations.ar;

interface LanguageContextType {
  lang: Language;
  dir: "rtl" | "ltr";
  t: (key: TranslationKey) => any;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  dir: "rtl",
  t: (key) => translations.ar[key] || key,
  toggleLang: () => {},
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("ar");

  useEffect(() => {
    // Check saved preference or default to Arabic
    const saved = localStorage.getItem("fluxframe_lang") as Language | null;
    if (saved && (saved === "ar" || saved === "en")) {
      setLangState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    } else {
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("fluxframe_lang", newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const toggleLang = () => {
    const next = lang === "ar" ? "en" : "ar";
    setLang(next);
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  const t = (key: TranslationKey): any => {
    const currentDict = translations[lang] || translations.ar;
    return currentDict[key] ?? translations.en[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, t, toggleLang, setLang }}>
      <div dir={dir} className={lang === "ar" ? "font-sans font-normal" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

