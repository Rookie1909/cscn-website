import { useTranslation } from 'react-i18next';
import { PageHero } from '@/components/sections/PageHero';
import { CannabisLeaf } from '@/components/icons/CannabisLeaf';

export function Sortiment() {
  const { t } = useTranslation();

  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title={t('sortiment_page.title')}
        description={t('sortiment_page.description')}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
        <div className="glass-card-premium inline-flex flex-col items-center gap-4 py-14 px-10">
          <div className="p-4 bg-primary/10 rounded-full">
            <CannabisLeaf size={28} className="text-primary" />
          </div>
          <p className="text-muted-foreground font-sans">{t('sortiment_page.placeholder')}</p>
        </div>
      </div>
    </div>
  );
}
