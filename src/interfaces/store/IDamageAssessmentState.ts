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
interface ResidentialBuilding {
  floorsCount?: number;
  apartmentsPerFloor?: number;
  usageType?: string;
  structureType?: string;
  columnsCondition?: string;
  beamsCondition?: string;
  externalWalls?: string;
  ceilingDamage?: string;
  buildingFacade?: string;
  entrancesStairs?: string;
  elevators?: string;
  electricalNetwork?: string;
  waterTanks?: string;
  sewageNetwork?: string;
  fireSystems?: string;
  mostDamagedFloors?: string;
  damagePercentage?: number;
  usageFeasibility?: string;
  additionalNotes?: string;
}
export interface IDamageAssessmentState {
  buildingType: string;
  IndependentBuilding: IndependentBuilding;
  ApartmentInsideBuilding: ApartmentInsideBuilding;
  ResidentialBuilding: ResidentialBuilding;
  loading: boolean;
  error: string | null;
}
