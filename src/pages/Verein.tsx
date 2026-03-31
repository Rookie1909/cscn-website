import { PageHero } from '@/components/sections/PageHero';
import { FeaturesGrid } from '@/components/sections/FeaturesGrid';

export function Verein() {
  return (
    <div className="bg-background min-h-screen">
      <PageHero
        banner={{
          text: 'Wir haben noch Plätze Frei – hier zum Mitgliedsantrag',
          link: '/mitgliedsbeitraege',
        }}
        title="Unser Anspruch an einen Cannabis Anbauverein"
        description="Nachhaltiger Bio-Cannabisanbau"
        backgroundImage="/images/cannabis-sunset.jpg"
        cta={{
          text: 'Mitgliedsantrag',
          link: '/mitmachen',
        }}
      />
      <div className="py-12 text-center bg-muted/30">
        <p className="text-muted-foreground font-sans text-lg max-w-2xl mx-auto px-4 leading-relaxed italic">
          Wir bieten höchste Qualität und eine ansprechende Sortenvielfalt exklusiv für unsere Mitglieder
        </p>
      </div>
      <FeaturesGrid />
    </div>
  );
}
