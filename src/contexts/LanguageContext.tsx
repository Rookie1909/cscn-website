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
      membership: "Mitgliedsanträge"
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
      badgeSubtitle: "Regulierter Anbau",
      stats: {
        csc: { title: "1. CSC", sub: "In Niedersachsen" },
        members: { title: "170+", sub: "Mitglieder" },
        plants: { title: "500+", sub: "Bio-Pflanzen" },
        yield: { title: "2500g+", sub: "Erfolgreiche Abgabe" }
      },
      features: {
        support: { title: "Experten-Support", text: "Best Practices & Wissensaustausch." },
        organic: { title: "100% Bio-Anbau", text: "0% Chemie, rein biologisch." },
        legal: { title: "Rechtssicher", text: "Garantierte Compliance & Legalität." }
      }
    },
    footer: {
      imprint: "Impressum und Datenschutz"
    },
    motivation: {
      title: "Unsere Motivation",
      subtitle: "saubere Blüten",
      text: "Unsere Motivation ist es, jedem Mitglied den freien Zugang zu kontrolliert angebautem, qualitativ hochwertigem Cannabis zu ermöglichen, ohne dabei auf den Schwarzmarkt und die damit einhergehenden Risiken zurückgreifen zu müssen.",
      features: [
        { title: "Qualitätsansprüche", subtitle: "ausgiebig getestet", text: "wir testen in umfangreichen Probenahmen auf THC/CBD Gehalte und Qualität" },
        { title: "Sortenvielfalt", subtitle: "vielfältige Auswahl", text: "wir wollen eine ansprechende Sortenauswahl - immer das richtige Kraut" },
        { title: "100% Organisch", subtitle: "natürlicher Anbau", text: "wir werden keine chemischen oder synthetischen Dünger in der Zucht verwenden" }
      ]
    },
    clubInfo: {
      title: "Der Verein",
      imageText: "Alles für die Pflanze - Alles für den Club",
      tags: [
        "100% organischer Anbau",
        "True Living Organics",
        "modernste LED-Systeme",
        "umfangreiches Fachwissen",
        "sorgfältig getestet",
        "gemeinschaftlich angebaut",
        "Sortenvielfalt",
        "legal"
      ],
      text: "Wir sind ein nicht-kommerzieller Verein, mit Sitz in Buchholz in der Nordheide, der sich durch Mitgliedsbeiträge finanziert. Jetzt, nach dem Erhalt der Lizenz werden wir uns als Cannabis Social Club Nordheide ausschließlich darauf konzentrieren, unsere Mitglieder umfassend zu informieren und innerhalb der gesetzlichen Vorgaben eine begrenzte Menge hochwertiger Cannabisprodukte für den Eigenkonsum bereitzustellen. Dabei legen wir besonderen Wert auf eine professionelle und nachhaltige Arbeitsweise, eine besondere, exklusive Sortenauswahl und qualitativ hochwertige Produkte für unsere Mitglieder!",
      more: "Mehr erfahren"
    },
    safety: {
      title: "sicher unterwegs",
      subtitle: "geschützter Raum",
      text1: "Als Cannabis Social Club Nordheide legen wir großen Wert auf Prävention, Jugendschutz und Gesundheitsschutz. Unsere Präventionsbeauftragte stellt sicher, dass alle Maßnahmen zum Schutz der Mitglieder eingehalten werden und bietet Unterstützung für Mitglieder mit problematischem Konsumverhalten.",
      text2: "Bitte beachte, dass der Bezug von Cannabisprodukten exklusiv unseren geschätzten Mitgliedern vorbehalten sein wird. Anfragen bezüglich des Erwerbs von Cannabisprodukten ohne der Absicht unserem Verein beizutreten, bleiben unsererseits unbeantwortet. Als verantwortungsbewusster Verein legen wir größten Wert auf die Sicherheit und Zufriedenheit unserer Mitglieder. Wir distanzieren uns entschieden von illegalen Aktivitäten und verpflichten uns, die strengen Vorgaben des Cannabisgesetzes gewissenhaft einzuhalten.",
      boxTitle: "Gesundheits- & Jugendschutz",
      more: "Mehr erfahren"
    },
    newsletter: {
      title: "Melde dich für unseren Newsletter an!",
      subtitle: "Du möchtest immer auf dem Laufenden bleiben?",
      text: "Bei uns gibt es nicht nur interessante politische Themen und Diskussionen, sondern auch immer wieder Tipps und Tricks für den Eigenanbau und alles rund um das Thema Cannabis.",
      success: "Vielen Dank für deine Anmeldung!",
      emailPlaceholder: "E-Mail",
      consentRequired: "Ich willige ein, dass diese Website meine übermittelten Informationen speichert, sodass meine Anfrage beantwortet werden kann.",
      button: "Anmelden"
    },
    contact: {
      title: "Informier dich!",
      text: "Schreib uns einfach eine E-Mail und wir versuchen dir mit Rat und Tat zur Seite zu stehen.",
      button: "Nimm Kontakt auf!"
    },
    membership: {
      title: "Gemeinsam ans Ziel",
      heading: "Unsere Mitgliedschaften",
      limitText: "Limitiertes Kontingent – Nur noch wenige Plätze!",
      availableSpots: "Verfügbare Plätze",
      fast: "Schnell sein!",
      earlyBird: "Plätze werden laufend vergeben – jetzt Early Bird sein!",
      feeOnce: "einmalige",
      feeNone: "entfällt die",
      feeAmountHighlight: "300,-€",
      feeAmountNormal: "komplett",
      textHighlight: " Die Supporter-Mitgliedschaft enthält:",
      textNormal: " In der Standard-Mitgliedschaft enthalten:",
      cards: [
        {
          name: "Standard-Mitgliedschaft",
          price: "0,-€",
          priceNote: "Aufnahmegebühr!",
          monthly: "Monatlicher Mindestbeitrag 50€",
          features: [
            "Zugriff auf das Standardsortiment (Blüten- und Haschischprodukte)",
            "Bezug von Stecklingen für den Eigenanbau (demnächst)",
            "kein Zugriff auf Testgenetiken (Cannabisblüten)",
            "keine Reservierungsmöglichkeit",
            "Upgrade zur Supporter-Mitgliedschaft ist jederzeit möglich"
          ],
          cta: "Mitgliedsantrag Standard-Mitgliedschaft"
        },
        {
          name: "Supporter-Mitgliedschaft",
          price: "300,-€",
          priceNote: "einmalige Aufnahmegebühr!",
          monthly: "Monatlicher Mindestbeitrag 50€",
          features: [
            "25% Vergünstigung auf alle Pauschalen/Beiträge/TopUps",
            "Alle 6 Monate ein Premium-Steckling für den Homegrow (optional)",
            "Exklusiver Zugriff auf limitierte Testgenetiken (Cannabisblüten)",
            "Reservierungsmöglichkeit für Lieblingssorten (demnächst)",
            "ein offizielles CSC Nordheide e.V. Polo-Shirt/T-Shirt"
          ],
          cta: "Mitgliedsantrag Supporter-Mitgliedschaft"
        }
      ]
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
      badgeSubtitle: "Regulated Cultivation",
      stats: {
        csc: { title: "1st CSC", sub: "In Lower Saxony" },
        members: { title: "170+", sub: "Members" },
        plants: { title: "500+", sub: "Organic Plants" },
        yield: { title: "2500g+", sub: "Successful Supply" }
      },
      features: {
        support: { title: "Expert Support", text: "Best Practices & Knowledge Exchange." },
        organic: { title: "100% Organic", text: "0% Chemicals, purely organic." },
        legal: { title: "Legally Secure", text: "Guaranteed Compliance & Legality." }
      }
    },
    footer: {
      imprint: "Imprint & Privacy Policy"
    },
    motivation: {
      title: "Our Motivation",
      subtitle: "clean flowers",
      text: "Our motivation is to provide every member with free access to controlled, high-quality cannabis without having to rely on the black market and its associated risks.",
      features: [
        { title: "Quality Standards", subtitle: "extensively tested", text: "we test extensively for THC/CBD levels and quality" },
        { title: "Strain Variety", subtitle: "diverse selection", text: "we want an appealing selection - always the right herb" },
        { title: "100% Organic", subtitle: "natural cultivation", text: "we do not use chemical or synthetic fertilizers" }
      ]
    },
    clubInfo: {
      title: "The Club",
      imageText: "Everything for the plant - Everything for the club",
      tags: [
        "100% organic cultivation",
        "True Living Organics",
        "modern LED systems",
        "extensive expertise",
        "carefully tested",
        "communally grown",
        "strain variety",
        "legal"
      ],
      text: "We are a non-commercial club based in Buchholz in der Nordheide, financed by membership fees. Now, after receiving our license, we focus exclusively on informing our members comprehensively and providing a limited amount of high-quality cannabis products for personal consumption within legal requirements. We place particular value on professional, sustainable work, an exclusive selection of strains, and high-quality products for our members!",
      more: "Learn more"
    },
    safety: {
      title: "Safe on the go",
      subtitle: "protected space",
      text1: "As Cannabis Social Club Nordheide, we attach great importance to prevention, youth protection, and health protection. Our prevention officer ensures that all measures to protect members are observed and offers support for members with problematic consumption behavior.",
      text2: "Please note that the supply of cannabis products will be exclusively reserved for our esteemed members. Inquiries regarding the purchase of cannabis products without the intention of joining our club will remain unanswered. As a responsible club, we attach the utmost importance to the safety and satisfaction of our members. We strictly distance ourselves from illegal activities and commit to conscientiously complying with the strict requirements of the Cannabis Act.",
      boxTitle: "Health & Youth Protection",
      more: "Learn more"
    },
    newsletter: {
      title: "Sign up for our newsletter!",
      subtitle: "Want to stay up to date?",
      text: "We not only offer interesting political topics and discussions but also tips and tricks for home growing and everything related to cannabis.",
      success: "Thank you for subscribing!",
      emailPlaceholder: "Email",
      consentRequired: "I consent to this website storing my submitted information so my request can be answered.",
      button: "Subscribe"
    },
    contact: {
      title: "Get Informed!",
      text: "Just write us an email and we will try to help you with words and deeds.",
      button: "Contact Us!"
    },
    membership: {
      title: "Reaching goals together",
      heading: "Our Memberships",
      limitText: "Limited Quota – Only a few spots left!",
      availableSpots: "Available spots",
      fast: "Be fast!",
      earlyBird: "Spots are given continuously – be an Early Bird now!",
      feeOnce: "one-time",
      feeNone: "no",
      feeAmountHighlight: "300,-€",
      feeAmountNormal: "upfront",
      textHighlight: " The Supporter Membership includes:",
      textNormal: " The Standard Membership includes:",
      cards: [
        {
          name: "Standard Membership",
          price: "0,-€",
          priceNote: "Admission fee!",
          monthly: "Monthly minimum fee 50€",
          features: [
            "Access to standard assortment (flowers and hash products)",
            "Purchase of cuttings for home growing (coming soon)",
            "no access to test genetics (cannabis flowers)",
            "no reservation option",
            "Upgrade to Supporter Membership is always possible"
          ],
          cta: "Standard Membership Application"
        },
        {
          name: "Supporter Membership",
          price: "300,-€",
          priceNote: "one-time admission fee!",
          monthly: "Monthly minimum fee 50€",
          features: [
            "25% discount on all flat rates/fees/top-ups",
            "A premium cutting for home grow every 6 months (optional)",
            "Exclusive access to limited test genetics (cannabis flowers)",
            "Reservation option for favorite strains (coming soon)",
            "an official CSC Nordheide e.V. Polo-Shirt/T-Shirt"
          ],
          cta: "Supporter Membership Application"
        }
      ]
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
      if (current === undefined || current[key] === undefined) return path;
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
