interface IndependentBuilding {
  numberOfFloors: number;
  floorArea: number;
  roofType: string;
  wallType: string;
  buildingAge: number;
  damageType: string;
  damagePercentage: number;
  habitability: string;
  additionalNotes: string;
}
interface ApartmentInsideBuilding {
  floorNumber?: number;
  apartmentNumber?: string;
  apartmentArea?: number;
  roomsCount?: number;
  wallCracks?: string;
  doorsDamage?: string;
  windowsDamage?: string;
  floorDamage?: string;
  ceilingDamage?: string;
  kitchenDamage?: string;
  bathroomDamage?: string;
  electricalDamage?: string;
  mainBuildingDamage?: string;
  damagePercentage?: number;
  habitability?: string;
  additionalNotes?: string;
}

export interface IDamageAssessmentState {
  buildingType: string;
  IndependentBuilding: IndependentBuilding;
  ApartmentInsideBuilding: ApartmentInsideBuilding;
  loading: boolean;
  error: string | null;
}
