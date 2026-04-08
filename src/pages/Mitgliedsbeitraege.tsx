import { useTranslation } from 'react-i18next';
import { PageHero } from '@/components/sections/PageHero';
import { DocumentLinks } from '@/components/sections/DocumentLinks';
import { RequirementsSection } from '@/components/sections/RequirementsSection';
import { MembershipCards } from '@/components/sections/MembershipCards';
import { AmortisationSection } from '@/components/sections/AmortisationSection';

export function Mitgliedsbeitraege() {
  const { t } = useTranslation();
  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title={t('membership.hero.title')}
        description={t('membership.hero.description')}
        backgroundImage="/images/cannabis-jars.jpg"
      />
      <MembershipCards />
      <AmortisationSection />
      <RequirementsSection />
      <DocumentLinks />
    </div>
  );
}
