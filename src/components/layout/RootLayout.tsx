import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SocialBar, SOCIAL_BAR_HEIGHT } from './SocialBar';
import { activeSocialLinks } from '@/data/social-links';

export function RootLayout() {
  // Die feste Social-Leiste liegt über dem Seitenende; unten Platz lassen,
  // damit der Footer (Impressum, Copyright) nicht von ihr verdeckt wird.
  const barSpace = activeSocialLinks.length > 0 ? `calc(${SOCIAL_BAR_HEIGHT} + env(safe-area-inset-bottom))` : undefined;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ paddingBottom: barSpace }}>
      <Header />
      <main className="flex-1 pt-28">
        <Outlet />
      </main>
      <Footer />
      <SocialBar />
    </div>
  );
}
