import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { SOCIAL_ICONS } from '@/components/icons/SocialIcons';
import { activeSocialLinks, type SocialLink } from '@/data/social-links';

// Höhe der Leiste. RootLayout reserviert unten genau diesen Platz, damit der
// Footer nicht verdeckt wird.
export const SOCIAL_BAR_HEIGHT = '3.5rem';

function SocialButton({ link, index, reduceMotion }: { link: SocialLink; index: number; reduceMotion: boolean }) {
  const { t } = useTranslation();
  const Icon = SOCIAL_ICONS[link.id];

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('footer.open_new_tab', { name: link.label })}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.1, rotate: -4 }}
      whileTap={{ scale: 0.92 }}
      className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-foreground/70 transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Ring, der beim Hover einmal nach außen pulsiert */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-primary/50 opacity-0 group-hover:animate-ping motion-reduce:animate-none"
      />
      <Icon className="relative h-[18px] w-[18px]" />
      {/* Name als kleine Sprechblase über dem Icon */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 font-headline text-[10px] font-bold uppercase tracking-widest text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {link.label}
      </span>
    </motion.a>
  );
}

export function SocialBar() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion() ?? false;

  if (activeSocialLinks.length === 0) return null;

  return (
    <aside
      aria-label={t('footer.follow_title')}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div
        className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 sm:px-6 md:justify-between lg:px-8"
        style={{ height: SOCIAL_BAR_HEIGHT }}
      >
        <p className="hidden min-w-0 truncate font-sans text-xs text-muted-foreground md:block">
          <span className="font-headline font-black uppercase tracking-[0.2em] text-foreground/80">
            {t('footer.follow_title')}
          </span>
          <span className="mx-2 text-muted-foreground/50">·</span>
          {t('footer.follow_text')}
        </p>
        <div className="flex items-center gap-3">
          {activeSocialLinks.map((link, i) => (
            <SocialButton key={link.id} link={link} index={i} reduceMotion={reduceMotion} />
          ))}
        </div>
      </div>
    </aside>
  );
}
