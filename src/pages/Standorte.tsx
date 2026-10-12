import { LocationSection } from '@/components/sections/LocationSection';

// Der Abstand zur festen Kopfzeile und das <main> kommen schon vom RootLayout;
// hier nicht noch einmal (sonst entsteht oben ein großer Leerraum).
export function Standorte() {
  return (
    <div className="bg-background min-h-screen">
      <LocationSection />
    </div>
  );
}
