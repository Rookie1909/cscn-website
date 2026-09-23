import { HashRouter, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from '@/components/ScrollToTop';
import { PageTitle } from '@/components/PageTitle';
import { AgeVerificationProvider } from '@/contexts/AgeVerificationContext';
import { AgeVerificationModal } from '@/components/AgeVerificationModal';
import { RootLayout } from '@/components/layout/RootLayout';
import { Home } from '@/pages/Home';
import { Verein } from '@/pages/Verein';
import { Mitgliedsbeitraege } from '@/pages/Mitgliedsbeitraege';
import { Neuigkeiten } from '@/pages/Neuigkeiten';
import { StrainLibrary } from '@/pages/StrainLibrary';
import { Standorte } from '@/pages/Standorte';
import { Impressum } from '@/pages/Impressum';
import { Gesundheitsschutz } from '@/pages/Gesundheitsschutz';
import { Anbau } from '@/pages/Anbau';
import { Sortiment } from '@/pages/Sortiment';
import { SortimentProfil } from '@/pages/SortimentProfil';
import { NotFound } from '@/pages/NotFound';
import { ThemeProvider } from '@/components/ThemeProvider';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      <AgeVerificationProvider>
        <HashRouter>
        <ScrollToTop />
        <PageTitle />
        <AgeVerificationModal />
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="verein" element={<Verein />} />
            <Route path="anbau" element={<Anbau />} />
            <Route path="ausgabe" element={<StrainLibrary />} />
            <Route path="sortiment" element={<Sortiment />} />
            <Route path="sortiment/:id" element={<SortimentProfil />} />
            <Route path="standorte" element={<Standorte />} />
            <Route path="mitgliedsbeitraege" element={<Mitgliedsbeitraege />} />
            <Route path="neuigkeiten" element={<Neuigkeiten />} />
            <Route path="impressum-und-datenschutz" element={<Impressum />} />
            <Route path="gesundheitsschutz" element={<Gesundheitsschutz />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
      </AgeVerificationProvider>
    </ThemeProvider>
  );
}

export default App;
