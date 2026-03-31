import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
