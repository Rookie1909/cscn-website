import { HashRouter, Routes, Route } from 'react-router-dom';
import { AgeVerificationProvider } from '@/contexts/AgeVerificationContext';
import { AgeVerificationModal } from '@/components/AgeVerificationModal';
import { RootLayout } from '@/components/layout/RootLayout';
import { Home } from '@/pages/Home';
import { Verein } from '@/pages/Verein';
import { Mitgliedsbeitraege } from '@/pages/Mitgliedsbeitraege';
import { StrainLibrary } from '@/pages/StrainLibrary';
import { Standorte } from '@/pages/Standorte';
import { Impressum } from '@/pages/Impressum';
import { Gesundheitsschutz } from '@/pages/Gesundheitsschutz';
import { ThemeProvider } from '@/components/ThemeProvider';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AgeVerificationProvider>
        <HashRouter>
        <AgeVerificationModal />
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="verein" element={<Verein />} />
            <Route path="sortiment" element={<StrainLibrary />} />
            <Route path="standorte" element={<Standorte />} />
            <Route path="mitgliedsbeitraege" element={<Mitgliedsbeitraege />} />
            <Route path="impressum-und-datenschutz" element={<Impressum />} />
            <Route path="gesundheitsschutz" element={<Gesundheitsschutz />} />
          </Route>
        </Routes>
      </HashRouter>
      </AgeVerificationProvider>
    </ThemeProvider>
  );
}

export default App;
