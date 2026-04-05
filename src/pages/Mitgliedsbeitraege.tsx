import { PageHero } from '@/components/sections/PageHero';
import { DocumentLinks } from '@/components/sections/DocumentLinks';
import { RequirementsSection } from '@/components/sections/RequirementsSection';
import { MembershipCards } from '@/components/sections/MembershipCards';
import { AmortisationSection } from '@/components/sections/AmortisationSection';

export function Mitgliedsbeitraege() {
  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title="Mitgliedsbeiträge"
        description="Wir sind für einen fairen Preis ohne gestaffelten Mengenrabatt und Mindestabnahmemengen. Um uns zu finanzieren und mit euch gemeinschaftlich Cannabis anbauen zu können, müssen wir Mitgliedsbeiträge erheben."
        backgroundImage="/images/cannabis-jars.jpg"
      />
      <MembershipCards />
      <AmortisationSection />
      <RequirementsSection />
      <DocumentLinks />
    </div>
  );
}
