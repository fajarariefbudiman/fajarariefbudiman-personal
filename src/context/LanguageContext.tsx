import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "id" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  id: {
    // Navbar
    "nav.home": "Beranda",
    "nav.about": "Tentang",
    "nav.journey": "Perjalanan",
    "nav.portfolio": "Portofolio",
    "nav.contact": "Kontak",

    // Hero
    "hero.greeting": "Halo, Saya",
    "hero.name": "Fajar Arief",
    "hero.role": "Web Developer & Mobile App Enthusiast",
    "hero.cta": "Lihat Portofolio",

    // About
    "about.title": "Tentang Saya",
    "about.description":
      "Saya seorang developer dengan fokus pada pengembangan website dan aplikasi mobile, berpengalaman dalam membangun produk digital yang fungsional dan estetis.",
    "about.skills": "Keahlian",
    "about.cv": "Download CV",

    // Portfolio
    "portfolio.title": "Portofolio",
    "portfolio.website": "Website",
    "portfolio.mobile": "Aplikasi Mobile",
    "portfolio.liveDemo": "Live Demo",
    "portfolio.download": "Download APK",

    // Contact
    "contact.title": "Hubungi Saya",
    "contact.name": "Nama",
    "contact.email": "Email",
    "contact.subject": "Subjek",
    "contact.message": "Pesan",
    "contact.send": "Kirim Pesan",
    "contact.success": "Pesan berhasil dikirim!",
    "contact.error": "Gagal mengirim pesan. Silakan coba lagi.",
  },
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.about": "About",
    "nav.journey": "Journey",
    "nav.portfolio": "Portfolio",
    "nav.contact": "Contact",

    // Hero
    "hero.greeting": "Hello, I'm",
    "hero.name": "Fajar Arief",
    "hero.role": "Web Developer & Mobile App Enthusiast",
    "hero.cta": "View Portfolio",

    // About
    "about.title": "About Me",
    "about.description":
      "I am a developer focused on web and mobile app development, with experience in building digital products that are both functional and visually appealing.",
    "about.skills": "Skills",
    "about.cv": "Download Resume",

    // Portfolio
    "portfolio.title": "Portfolio",
    "portfolio.website": "Website",
    "portfolio.mobile": "Mobile App",
    "portfolio.liveDemo": "Live Demo",
    "portfolio.download": "Download APK",

    // Contact
    "contact.title": "Contact Me",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.subject": "Subject",
    "contact.message": "Message",
    "contact.send": "Send Message",
    "contact.success": "Message sent successfully!",
    "contact.error": "Failed to send message. Please try again.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("language");
    if (stored) return stored as Language;

    // Auto-detect based on browser language
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith("id") ? "id" : "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "id" ? "en" : "id"));
  };

  const t = (key: string): string => {
    return (
      translations[language][key as keyof (typeof translations)["id"]] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
