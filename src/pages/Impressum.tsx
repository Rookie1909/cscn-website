import { ImpressumContent } from '@/components/sections/ImpressumContent';

export function Impressum() {
  return (
    <div className="bg-background min-h-screen">
      <div className="pt-24 pb-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-6xl font-headline font-black text-foreground tracking-tight">
            Impressum & Datenschutz
          </h1>
        </div>
      </div>
      <ImpressumContent />
    </div>
  );
}
