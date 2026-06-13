# CSC Nordheide Website

**DE:** Offizielle Website des Cannabis Social Club Nordheide e.V. — eine statische, zweisprachige (DE/EN) Marketing-Seite ohne Backend oder CMS.

**EN:** Official website for Cannabis Social Club Nordheide e.V. — a static, bilingual (DE/EN) marketing site with no backend or CMS.

Production: [csc-nordheide.de](https://csc-nordheide.de) · Contact: info@csc-nordheide.de

---

## Features / Funktionen

| | DE | EN |
|---|---|---|
| Languages | Deutsch & Englisch (Browser-Erkennung, Fallback: DE) | German & English (browser detection, fallback: DE) |
| Theme | Hell / Dunkel (System-Präferenz) | Light / dark (system preference) |
| Age gate | 18+ Bestätigung via `localStorage` | 18+ confirmation via `localStorage` |
| Pages | 8 Seiten (Verein, Sortiment, Standorte, …) | 8 pages (club, strains, locations, …) |
| Membership | EasyVerein-Antragsformular (externer Link) | EasyVerein application form (external link) |

---

## Tech Stack

React 19 · TypeScript 5.9 · Vite 7 · React Router 7 (`HashRouter`) · i18next · Tailwind CSS v4 · shadcn/ui (Radix) · Framer Motion · next-themes

---

## Getting Started / Erste Schritte

**Voraussetzungen / Prerequisites:** Node.js 20+

```bash
npm ci
npm run dev          # http://localhost:5173/#/  (Hash erforderlich / hash required)
npm run build        # Ausgabe / output: dist/
npm run preview      # http://localhost:4173
npm run lint
npm run check:content
```

**LAN-Zugriff / LAN access:** `npm run dev -- --host`

---

## CI / Continuous Integration

GitHub Actions runs on every push to `main` and on pull requests:

- `npm run check:content` — i18n key parity, static asset paths, internal route validation
- `npm run lint` — ESLint
- `npm run build` — TypeScript + Vite production build

Workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

**Branch protection (GitHub repo settings):** After the first CI run on `main`, enable branch protection under Settings → Branches → Add rule for `main`: require status check **CI / quality** before merge.

---

## Project Structure / Projektstruktur

```
src/
├── pages/              # Routen-Komponenten (8 Seiten)
├── components/
│   ├── layout/         # Header, Footer, RootLayout
│   ├── sections/       # Wiederverwendbare Seitenabschnitte
│   └── ui/             # shadcn/ui Primitives
├── locales/
│   ├── de.json         # Deutsche UI-Texte (primäre Quelle)
│   └── en.json         # Englische UI-Texte
├── data/
│   └── news.json       # Neuigkeiten (DE + _en Felder)
├── constants/
│   └── strains.ts      # Sortiment (DE + _en Felder)
├── i18n.ts             # i18next-Konfiguration
└── App.tsx             # Routing & Provider
public/
├── images/             # Statische Bilder → /images/...
└── documents/          # PDFs → /documents/...
```

| Path | Purpose / Zweck |
|------|-----------------|
| `src/locales/` | Allgemeine UI-Übersetzungen / general UI translations |
| `src/data/news.json` | News posts with `_en` suffix fields |
| `src/constants/strains.ts` | Strain catalog with `_en` suffix fields |
| `public/images/` | Images served at `/images/...` |
| `public/documents/` | PDFs served at `/documents/...` |
| `vite.config.ts` | `base: './'` for static hosting |

---

## Routes / Routen

The app uses **hash routing** — no server rewrite rules needed.

| Route | Page (DE) | Page (EN) |
|-------|-----------|-----------|
| `/#/` | Startseite | Home |
| `/#/verein` | Verein | Club |
| `/#/sortiment` | Sortiment | Strain library |
| `/#/standorte` | Standorte | Locations |
| `/#/mitgliedsbeitraege` | Mitgliedsbeiträge | Membership |
| `/#/neuigkeiten` | Neuigkeiten | News |
| `/#/impressum-und-datenschutz` | Impressum & Datenschutz | Legal |
| `/#/gesundheitsschutz` | Gesundheitsschutz | Health protection |

---

## Content Editing / Inhalte bearbeiten

**DE:** Nach Inhaltsänderungen `npm run build` ausführen und den Ordner `dist/` deployen.

**EN:** After content changes, run `npm run build` and deploy the `dist/` folder.

### General UI text / Allgemeine UI-Texte

Edit matching keys in both `src/locales/de.json` and `src/locales/en.json`. Keep keys identical in both files.

```json
// de.json
"hero": { "title": "Willkommen beim CSC Nordheide" }

// en.json
"hero": { "title": "Welcome to CSC Nordheide" }
```

### News / Neuigkeiten

Add or edit entries in `src/data/news.json`. Use `_en` suffix fields for English content. Place images under `public/images/News_Pics/<id>/` and reference them as `/images/News_Pics/...`.

```json
{
  "id": "26CW15",
  "title": "Neuigkeiten aus dem CSC Nordheide!",
  "title_en": "News from CSC Nordheide!",
  "description": "…",
  "description_en": "…",
  "images": ["/images/News_Pics/26CW15/photo.jpg"],
  "date": "2026-04-02"
}
```

### Strains / Sortiment

Edit `src/constants/strains.ts`. Follow the existing pattern: German fields plus `_en` variants (`description_en`, `effects_en`, etc.).

### Locations / Standorte

- Day labels and section titles: `src/locales/de.json` / `en.json` (keys under `locations`)
- Addresses, opening hours, map URLs: hardcoded in `src/components/sections/LocationSection.tsx`

### Membership prices / Mitgliedsbeiträge

- Price amounts (e.g. `'0,-€'`): hardcoded in `src/components/sections/MembershipCards.tsx`
- Labels and feature lists: `src/locales/` (keys under `membership_cards`)

### PDFs

Place files in `public/documents/` and link from source:

| File | Referenced in |
|------|---------------|
| `Vereinssatzung.pdf` | `src/components/sections/DocumentLinks.tsx` |
| `Beitragsordnung.pdf` | `src/components/sections/DocumentLinks.tsx` |
| `Kurzinformation_Praevention.pdf` | `src/pages/Gesundheitsschutz.tsx` |

### Images / Bilder

Add files to `public/images/`. Reference with a leading slash: `/images/logo.webp`.

---

## Deployment

1. Run `npm run build` — output goes to `dist/`
2. Upload the entire `dist/` folder to your static host
3. No `.env`, database, or backend required
4. `base: './'` in Vite supports root or subdirectory hosting
5. `HashRouter` avoids SPA fallback configuration on the server

---

## Known Limitations / Bekannte Einschränkungen

| Issue | Details |
|-------|---------|
| Newsletter | Form shows success UI only — no backend integration yet |
| Broken link | Verein page CTA previously linked to `/mitmachen` — fixed to `/mitgliedsbeitraege` |
| Age gate | Text in `AgeVerificationModal.tsx` is German-only, not i18n-driven |

---

## Contact / Kontakt

Cannabis Social Club Nordheide e.V. · info@csc-nordheide.de · [csc-nordheide.de](https://csc-nordheide.de)

Legal notice: `/#/impressum-und-datenschutz`
