export interface RoomStrain {
  name: string;
  image?: string;
}

export interface GrowRoom {
  id: string;
  name: string;
  description: string;
  image?: string;
  strains: RoomStrain[];
}
