import { PageHero } from '@/components/sections/PageHero';
import { DocumentLinks } from '@/components/sections/DocumentLinks';
import { RequirementsSection } from '@/components/sections/RequirementsSection';
import { MembershipCards } from '@/components/sections/MembershipCards';
import { AmortisationSection } from '@/components/sections/AmortisationSection';

export function Mitgliedsbeitraege() {
  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title="Mitgliedsanträge"
        description="Stell jetzt deinen Mitgliedsantrag und werde Teil des CSC Nordheide e.V. Wähle zwischen der kostenlosen Standard-Mitgliedschaft oder der Supporter-Mitgliedschaft mit exklusiven Vorteilen."
        backgroundImage="/images/cannabis-jars.jpg"
      />
      <MembershipCards />
      <AmortisationSection />
      <RequirementsSection />
      <DocumentLinks />
    </div>
  );
}
