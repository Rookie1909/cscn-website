import { useTranslation } from 'react-i18next';
import { PageHero } from '@/components/sections/PageHero';
import { FeaturesGrid } from '@/components/sections/FeaturesGrid';

export function Verein() {
  const { t } = useTranslation();
  return (
    <div className="bg-background min-h-screen">
      <PageHero
        banner={{
          text: t('verein.hero.banner'),
          link: '/mitgliedsbeitraege',
        }}
        title={t('verein.hero.title')}
        description={t('verein.hero.description')}
        backgroundImage="/images/cannabis-sunset.jpg"
        cta={{
          text: t('verein.hero.cta'),
          link: '/mitmachen',
        }}
      />
      <div className="py-12 text-center bg-muted/30">
        <p className="text-muted-foreground font-sans text-lg max-w-2xl mx-auto px-4 leading-relaxed italic">
          {t('verein.intro')}
        </p>
      </div>
      <FeaturesGrid />
    </div>
  );
}
