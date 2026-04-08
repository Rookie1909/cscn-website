import { useTranslation } from 'react-i18next';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { HeroSection } from '@/components/sections/HeroSection';
import { MotivationSection } from '@/components/sections/MotivationSection';
import { ClubInfoSection } from '@/components/sections/ClubInfoSection';
import { SafetySection } from '@/components/sections/SafetySection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { ContactSection } from '@/components/sections/ContactSection';

export function Home() {
  const { t } = useTranslation();
  return (
    <div className="bg-background">
      <AnnouncementBanner
        text={t('home.banner')}
        link="/mitgliedsbeitraege"
      />
      <HeroSection />
      <MotivationSection />
      <ClubInfoSection />
      <SafetySection />
      <NewsletterSection />
      <ContactSection />
    </div>
  );
}
