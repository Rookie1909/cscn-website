import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { CannabisLeaf } from '@/components/icons/CannabisLeaf';

export function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <CannabisLeaf size={48} className="text-primary mx-auto" />
        <h1 className="text-6xl font-black tracking-tighter text-foreground">404</h1>
        <p className="text-lg font-bold text-foreground">{t('not_found.title')}</p>
        <p className="text-muted-foreground">{t('not_found.description')}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('not_found.back_home')}
        </Link>
      </div>
    </div>
  );
}
