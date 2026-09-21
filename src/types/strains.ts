export interface Strain {
  id: string;
  name: string;
  thc: string;
  cbd: string;
  indica: number;
  sativa: number;
  description: string;
  description_en?: string;
  description_fi?: string;
  description_it?: string;
  effects: string[];
  effects_en?: string[];
  effects_fi?: string[];
  effects_it?: string[];
  medicalEffects?: string[];
  medicalEffects_en?: string[];
  medicalEffects_fi?: string[];
  medicalEffects_it?: string[];
  terpenes: string[];
  terpenes_en?: string[];
  terpenes_fi?: string[];
  terpenes_it?: string[];
  genetics: string;
  breeder: string;
  isSoldOut?: boolean;
  image?: string;
}
