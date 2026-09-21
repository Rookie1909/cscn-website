export type GrowStage = 'vegetative' | 'flowering' | 'cutting';
export type FillLevel = 'few' | 'moderate' | 'many';

export interface RoomStrain {
  name: string;
  stage: GrowStage;
  fillLevel: FillLevel;
}

export interface GrowRoom {
  id: string;
  name: string;
  description: string;
  image?: string;
  strains: RoomStrain[];
}
