export interface Strain {
  id: string;
  name: string;
  thc: string;
  cbd: string;
  indica: number;
  sativa: number;
  description: string;
  effects: string[];
  medicalEffects?: string[];
  terpenes: string[];
  genetics: string;
  breeder: string;
}
