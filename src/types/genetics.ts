export type GeneticsType = 'indica' | 'sativa' | 'hybrid';
export type GeneticsStatus = 'available' | 'next_harvest' | 'none';

export interface Genetics {
  id: string;
  name: string;
  type: GeneticsType;
  indica: number;
  sativa: number;
  thc: string;
  cbd: string;
  genetics: string;
  breeder: string;
  description: string;
  description_en?: string;
  description_fi?: string;
  description_it?: string;
  effects: string[];
  effects_en?: string[];
  effects_fi?: string[];
  effects_it?: string[];
  terpenes: string[];
  terpenes_en?: string[];
  terpenes_fi?: string[];
  terpenes_it?: string[];
  image?: string;
  status: GeneticsStatus;
}
