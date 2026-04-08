import { useTranslation } from 'react-i18next';
import { PageHero } from '@/components/sections/PageHero';
import { NewsSection } from '@/components/sections/NewsSection';

export function Neuigkeiten() {
  const { t } = useTranslation();
  
  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title={t('news_page.title')}
        description={t('news_page.description')}
        backgroundImage="/images/cannabis-plants.jpg"
      />
      <NewsSection />
    </div>
  );
}
