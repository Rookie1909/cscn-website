import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import genetics from '@/data/genetics.json';
import type { Genetics } from '@/types/genetics';

const PATH_TITLE_KEYS: Record<string, string> = {
  '/': 'nav.home',
  '/verein': 'nav.verein',
  '/gesundheitsschutz': 'nav.protection',
  '/anbau': 'grow_rooms.nav',
  '/ausgabe': 'nav.ausgabe',
  '/sortiment': 'nav.sortiment_overview',
  '/standorte': 'nav.standorte',
  '/mitgliedsbeitraege': 'nav.membership',
  '/neuigkeiten': 'nav.news',
  '/impressum-und-datenschutz': 'footer.impressum',
};

export function PageTitle() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    let pageTitle: string | undefined;

    if (pathname.startsWith('/sortiment/')) {
      const id = pathname.slice('/sortiment/'.length);
      const entry = (genetics as Genetics[]).find((g) => g.id === id);
      pageTitle = entry?.name;
    }
    if (!pageTitle) {
      const key = PATH_TITLE_KEYS[pathname];
      pageTitle = key ? t(key) : undefined;
    }

    document.title = pageTitle
      ? `${pageTitle} · CSC Nordheide`
      : 'CSC Nordheide';
  }, [pathname, t, i18n.language]);

  return null;
}
