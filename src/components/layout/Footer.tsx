import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-muted border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Link
            to="/impressum-und-datenschutz"
            className="text-muted-foreground hover:text-primary transition-colors text-sm font-sans font-medium"
          >
            {t("footer.imprint")}
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
