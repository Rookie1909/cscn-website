import { PageHero } from '@/components/sections/PageHero';
import { NewsSection } from '@/components/sections/NewsSection';

export function Neuigkeiten() {
  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title="Neuigkeiten"
        description="Club Tagebuch — Transparenz und Fortschritt. Begleite uns auf unserem Weg zum gemeinschaftlichen Anbau."
        backgroundImage="/images/cannabis-plants.jpg"
      />
      <NewsSection />
    </div>
  );
}
