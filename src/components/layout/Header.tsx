import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Cannabis, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PriorityNav, type PriorityNavItem } from './PriorityNav';

export function Header() {
  const { isScrolled } = useScrollPosition();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileLangMenuOpen, setMobileLangMenuOpen] = useState(false);
  const [isLogoFullscreen, setIsLogoFullscreen] = useState(false);

  const isActive = (href: string) => location.pathname === href;

  const languages = [
    { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
    { code: 'nds', flag: '🇩🇪', label: 'Plattdüütsch' },
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'fi', flag: '🇫🇮', label: 'Suomi' },
    { code: 'it', flag: '🇮🇹', label: 'Italiano' },
  ];
  const currentLanguage = languages.find((l) => l.code === i18n.language) || languages[0];

  const selectLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setLangMenuOpen(false);
    setMobileLangMenuOpen(false);
  };

  const navItems = [
    { label: t('nav.home'), href: '/' },
    {
      label: t('nav.verein'),
      href: '/verein',
      children: [
        { label: t('nav.about'), href: '/verein' },
        { label: t('nav.protection'), href: '/gesundheitsschutz' },
      ],
    },
    {
      label: t('nav.sortiment'),
      href: '/sortiment',
      children: [
        { label: t('nav.ausgabe_current'), href: '/ausgabe' },
        { label: t('nav.sortiment_overview'), href: '/sortiment' },
      ],
    },
    { label: t('nav.standorte'), href: '/standorte' },
    { label: t('nav.membership'), href: '/mitgliedsbeitraege' },
    { label: t('nav.news'), href: '/neuigkeiten' },
  ];

  // Desktop-Leiste: Ausgabe und Genetiken sind eigene Punkte und immer sichtbar
  // (pinned). Bei Platzmangel wandert zuerst weg, was die größte priority hat,
  // in das „Mehr“-Menü; bei mehr Platz erscheinen die Punkte wieder in der Leiste.
  const desktopItems: PriorityNavItem[] = [
    { id: 'home', label: t('nav.home'), href: '/', priority: 6 },
    {
      id: 'verein',
      label: t('nav.verein'),
      href: '/verein',
      priority: 4,
      children: [
        { label: t('nav.about'), href: '/verein' },
        { label: t('nav.protection'), href: '/gesundheitsschutz' },
      ],
    },
    { id: 'ausgabe', label: t('nav.ausgabe_current'), href: '/ausgabe', priority: 0, pinned: true },
    { id: 'genetiken', label: t('nav.sortiment_overview'), href: '/sortiment', priority: 1, pinned: true },
    { id: 'standorte', label: t('nav.standorte'), href: '/standorte', priority: 5 },
    { id: 'mitglied', label: t('nav.membership'), href: '/mitgliedsbeitraege', priority: 2 },
    { id: 'news', label: t('nav.news'), href: '/neuigkeiten', priority: 3 },
  ];
  // Genetiken bleiben auch auf den Detailseiten (/sortiment/…) markiert.
  const isDesktopActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname === href || location.pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      {/* Etwas breiter als der Seiteninhalt (max-w-7xl), damit auf großen Bildschirmen
          mehr Menüpunkte direkt in der Leiste Platz haben. */}
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-28">
          {/* Logo */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsLogoFullscreen(true)}
              className="w-12 h-12 sm:w-16 sm:h-16 xl:w-[4.5rem] xl:h-[4.5rem] shrink-0 rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-500 hover:rotate-6 hover:scale-105 p-0.5 group"
            >
              <img 
                src="/images/logo.webp" 
                alt="CSCN Logo" 
                className="w-full h-full object-contain"
              />
            </button>
            <Link to="/" className="block group">
              {/* Name bricht nie um (nur die feste Zeilenschaltung); der Untertitel
                  richtet sich mit w-0/min-w-full nach der Breite des Namens und
                  umbricht in zwei Zeilen darunter. */}
              <h1 className="whitespace-nowrap text-foreground font-headline font-black text-[13px] sm:text-xl lg:text-lg xl:text-2xl leading-[1.15] sm:leading-[1.05] tracking-tight group-hover:text-primary transition-colors duration-300">
                Cannabis Social Club
                <br />
                Nordheide E.V.
              </h1>
              <p className="w-0 min-w-full text-muted-foreground text-[8px] sm:text-[11px] font-sans uppercase tracking-[0.1em] sm:tracking-[0.2em] leading-snug mt-1.5 sm:mt-2 font-bold">
                {t('header.logo_subtitle')}
              </p>
            </Link>
          </div>

          {/* Desktop: Prioritäts-Menü (passt sich der Breite an) + Schalter */}
          <div className="hidden min-w-0 flex-1 items-center justify-end gap-4 lg:flex">
            <PriorityNav items={desktopItems} isActive={isDesktopActive} />

            <div className="flex shrink-0 items-center gap-3">
              {/* Language Switcher */}
              <div
                className="relative"
                onMouseEnter={() => setLangMenuOpen(true)}
                onMouseLeave={() => setLangMenuOpen(false)}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setLangMenuOpen((o) => !o)}
                  className="w-11 h-11 rounded-xl border-border bg-background/50 hover:bg-primary/5 hover:border-primary/50 text-xl transition-all duration-500 hover:scale-110 shadow-lg shadow-black/5"
                  title={currentLanguage.label}
                >
                  {currentLanguage.flag}
                </Button>
                <AnimatePresence>
                  {langMenuOpen && (
                    <div className="absolute top-full right-0 pt-3 w-44">
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden py-2"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => selectLanguage(lang.code)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-headline font-bold transition-all ${
                              lang.code === i18n.language
                                ? 'text-primary bg-primary/5'
                                : 'text-foreground/70 hover:bg-primary/5 hover:text-primary'
                            }`}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            {lang.label}
                          </button>
                        ))}
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-11 h-11 rounded-xl border-border bg-background/50 hover:bg-primary/5 hover:border-primary/50 text-primary transition-all duration-500 hover:rotate-[30deg] shadow-lg shadow-black/5"
                title={theme === 'dark' ? t('header.switch_light') : t('header.switch_dark')}
              >
                <Cannabis className={`w-6 h-6 transition-all duration-700 ${theme === 'dark' ? 'fill-primary scale-110' : 'scale-90'}`} />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-4 lg:hidden">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileLangMenuOpen((o) => !o)}
                className="text-xl"
              >
                {currentLanguage.flag}
              </Button>
              <AnimatePresence>
                {mobileLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-3 w-44 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden py-2 z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => selectLanguage(lang.code)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-headline font-bold transition-all ${
                          lang.code === i18n.language
                            ? 'text-primary bg-primary/5'
                            : 'text-foreground/70 hover:bg-primary/5 hover:text-primary'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-primary"
            >
              <Cannabis className={`w-6 h-6 ${theme === 'dark' ? 'fill-primary' : ''}`} />
            </Button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-foreground/80 hover:text-foreground">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background border-border">
                  <div className="mt-8 mb-6 px-2">
                    <h2 className="text-xl font-headline font-black text-foreground">{t('header.menu')}</h2>
                  </div>
                  <div className="flex flex-col gap-6">
                    {navItems.map((item) => (
                      <div key={item.label}>
                        {item.children ? (
                          <div className="space-y-4">
                            <span className="text-muted-foreground text-xs font-headline font-black uppercase tracking-[0.2em] px-2">{item.label}</span>
                            <div className="space-y-2">
                              {item.children.map((child) => (
                                <Link
                                  key={child.label}
                                  to={child.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`block text-xl font-headline font-black tracking-tight px-4 py-2 rounded-xl transition-all ${
                                    isActive(child.href) 
                                      ? 'bg-primary/10 text-primary' 
                                      : 'text-foreground hover:bg-muted'
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block text-3xl font-headline font-black tracking-tighter px-2 transition-all ${
                              isActive(item.href) ? 'text-primary scale-105' : 'text-foreground active:scale-95'
                            }`}
                          >
                            {item.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Fullscreen Logo Overlay */}
      <AnimatePresence>
        {isLogoFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setIsLogoFullscreen(false)}
          >
            <motion.button
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute top-8 right-8 p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsLogoFullscreen(false);
              }}
            >
              <X className="w-8 h-8" />
            </motion.button>
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="max-w-4xl w-full aspect-square flex items-center justify-center p-8 bg-white/5 rounded-[3rem] border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src="/images/logo.webp" 
                alt="CSCN Logo Fullscreen" 
                className="max-w-full max-h-full object-contain drop-shadow-[0_0_50px_rgba(34,197,94,0.3)]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
