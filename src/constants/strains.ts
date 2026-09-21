import type { Strain } from "../types/strains";
import strainsData from "../data/strains-sync.json";

// This file is generated automatically from Cannanas (see .github/scripts/sync-strains.cjs)
// and kept up to date via .github/workflows/sync-strains.yml.
// Manual tag/translation refinements live in src/data/strain-overrides.json.
export const STRAINS: Strain[] = strainsData as Strain[];
