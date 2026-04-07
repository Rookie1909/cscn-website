import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'de' | 'en';

type Translations = {
  [key in Language]: {
    [key: string]: string | any;
  };
};

export const translations: Translations = {
  de: {
    nav: {
      home: "Home",
      verein: "Verein",
      about: "Über uns",
      health: "Gesundheits- & Jugendschutz",
      assortment: "Sortiment",
      locations: "Standorte",
      membership: "Mitgliedsbeiträge"
    },
    header: {
      title: "Cannabis Social Club",
      subtitle: "Nordheide E.V.",
      desc: "Vereinswebsite des CSC Nordheide e.V."
    },
    hero: {
      titleLine1: "Pioniere des",
      titleLine2: "biologischen",
      titleLine3: "Anbaus in Niedersachsen",
      subtitle: "Der erste CSC in Niedersachsen mit über 170 engagierten Mitgliedern – Qualität, die überzeugt.",
      exclusive: "Exklusive Auswahl",
      exclusiveDesc: "Blüten, Hash (Dry Sift), Bubble Hash, Hash Rosin, Piattella, WPFF Rosin.",
      exclusiveTag: "Nur bei uns erhältlich",
      cta: "Jetzt Teil der Bewegung werden",
      imgTitle: "Biologischer Anbau",
      imgSubtitle: "100% Reinheit ohne Kompromisse",
      badgeTitle: "100% Legal",
      badgeSubtitle: "Regulierter Anbau"
    }
  },
  en: {
    nav: {
      home: "Home",
      verein: "Club",
      about: "About Us",
      health: "Health & Youth Protection",
      assortment: "Strains",
      locations: "Locations",
      membership: "Memberships"
    },
    header: {
      title: "Cannabis Social Club",
      subtitle: "Nordheide E.V.",
      desc: "Official website of CSC Nordheide e.V."
    },
    hero: {
      titleLine1: "Pioneers of",
      titleLine2: "organic",
      titleLine3: "cultivation in Lower Saxony",
      subtitle: "The first CSC in Lower Saxony with over 170 dedicated members – Quality that convinces.",
      exclusive: "Exclusive Selection",
      exclusiveDesc: "Flowers, Hash (Dry Sift), Bubble Hash, Hash Rosin, Piattella, WPFF Rosin.",
      exclusiveTag: "Only available here",
      cta: "Join the movement now",
      imgTitle: "Organic Cultivation",
      imgSubtitle: "100% Purity without compromise",
      badgeTitle: "100% Legal",
      badgeSubtitle: "Regulated Cultivation"
    }
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string | any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'de') ? saved : 'de';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (path: string) => {
    const keys = path.split('.');
    let current: any = translations[language];
    for (const key of keys) {
      if (current[key] === undefined) return path;
      current = current[key];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
