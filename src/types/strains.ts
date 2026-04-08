export interface Strain {
  id: string;
  name: string;
  thc: string;
  cbd: string;
  indica: number;
  sativa: number;
  description: string;
  description_en?: string;
  effects: string[];
  effects_en?: string[];
  medicalEffects?: string[];
  medicalEffects_en?: string[];
  terpenes: string[];
  terpenes_en?: string[];
  genetics: string;
  breeder: string;
  isSoldOut?: boolean;
}
