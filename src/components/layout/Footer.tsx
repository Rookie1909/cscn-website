import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { SOCIAL_ICONS } from '@/components/icons/SocialIcons';
import { socialLinks, type SocialLink } from '@/data/social-links';

function SocialButton({ link, index, reduceMotion }: { link: SocialLink; index: number; reduceMotion: boolean }) {
  const { t } = useTranslation();
  const Icon = SOCIAL_ICONS[link.id];

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('footer.open_new_tab', { name: link.label })}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.08, rotate: -4 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/60 text-foreground/70 shadow-lg shadow-black/5 transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-primary/30 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
    >
      {/* Ring, der beim Hover einmal nach außen pulsiert */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-primary/50 opacity-0 group-hover:animate-ping motion-reduce:animate-none"
      />
      <Icon className="relative h-5 w-5" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-headline text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {link.label}
      </span>
    </motion.a>
  );
}

export function Footer() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion() ?? false;

  const channels = socialLinks.filter((l) => l.url.startsWith('https://'));
  const hasSocial = channels.length > 0;

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
          <div className={`flex items-center gap-4 md:items-start ${hasSocial ? 'md:col-span-5' : 'md:col-span-6'}`}>
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
          <nav aria-label={t('footer.nav_title')} className={hasSocial ? 'md:col-span-4' : 'md:col-span-6'}>
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

          {/* Kanäle: erscheint nur, wenn in src/data/social-links.ts Adressen eingetragen sind */}
          {hasSocial && (
            <div className="md:col-span-3">
              <h2 className="mb-2 font-headline text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                {t('footer.follow_title')}
              </h2>
              <p className="mb-5 max-w-[16rem] font-sans text-sm text-muted-foreground">{t('footer.follow_text')}</p>
              <div className="flex flex-wrap gap-4 pb-6">
                {channels.map((link, i) => (
                  <SocialButton key={link.id} link={link} index={i} reduceMotion={reduceMotion} />
                ))}
              </div>
            </div>
          )}
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
