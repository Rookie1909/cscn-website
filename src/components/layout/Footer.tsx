import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Die Social-Media-Kanäle stehen nicht hier, sondern in der festen Leiste am
// unteren Bildschirmrand (SocialBar, eingebunden in RootLayout).
export function Footer() {
  const { t } = useTranslation();

  const pages = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '/verein' },
    { label: t('nav.protection'), href: '/gesundheitsschutz' },
    { label: t('nav.ausgabe_current'), href: '/ausgabe' },
    { label: t('nav.sortiment_overview'), href: '/sortiment' },
    { label: t('nav.standorte'), href: '/standorte' },
    { label: t('nav.membership'), href: '/mitgliedsbeitraege' },
    { label: t('nav.news'), href: '/neuigkeiten' },
  ];

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Verein */}
          <div className="flex items-center gap-4 md:col-span-6 md:items-start">
            <img src="/images/logo.webp" alt="CSCN Logo" className="h-16 w-16 shrink-0 object-contain" loading="lazy" />
            <div>
              <p className="font-headline text-lg font-black leading-tight tracking-tight text-foreground">
                Cannabis Social Club
                <br />
                Nordheide E.V.
              </p>
              <p className="mt-2 max-w-xs font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {t('header.logo_subtitle')}
              </p>
            </div>
          </div>

          {/* Seiten */}
          <nav aria-label={t('footer.nav_title')} className="md:col-span-6">
            <h2 className="mb-4 font-headline text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              {t('footer.nav_title')}
            </h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {pages.map((p) => (
                <li key={p.href}>
                  <Link
                    to={p.href}
                    className="inline-block font-sans text-sm font-medium text-foreground/70 transition-all duration-300 hover:translate-x-1 hover:text-primary"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <Link
            to="/impressum-und-datenschutz"
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-sans font-medium"
          >
            {t('footer.impressum')}
          </Link>
          <div className="text-center md:text-right">
            <p className="text-muted-foreground/80 text-sm font-sans">
              Copyright © 2026 Cannabis Social Club Nordheide e.V.
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1 font-sans italic">
              Powered by Cannabis Social Club Nordheide e.V.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
