export interface IDamageAssessmentState {
  buildingType: string;
  IndependentBuilding: IndependentBuilding;
  ApartmentInsideBuilding: ApartmentInsideBuilding;
  ResidentialBuilding: ResidentialBuilding;
  tower: ITower;
  compHouse: ICompHouse;
  additionalBuildings: IAdditionalBuildings;
  loading: boolean;
  error: string | null;
}
export interface IndependentBuilding {
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
export interface ITower {
  totalFloors?: number;
  serviceFloors?: number;
  unitsCount?: number;
  usageType?: "residential" | "commercial" | "mixed" | "";
  structuralSystem?: "columns" | "shear-walls" | "";
  collapsedFloors?: number;
  partialCollapses?: number;
  criticalColumnDamage?: boolean;
  criticalShearWallDamage?: boolean;
  projectilePenetrations?: number;
  floorNumber?: number;
  status?: "undamaged" | "minor" | "moderate" | "severe" | "collapsed";
  damagedUnits?: number;
  elevatorsDown?: boolean;
  fireSystemDamaged?: boolean;
  mainElectricRoom?: boolean;
  roofTanksDamaged?: boolean;
  unusableFloors?: number;
  structuralDamagePercent?: number;
  architecturalDamagePercent?: number;
  servicesDamagePercent?: number;
  engineerRecommendation?: string;
}

export interface ICompHouse {
  unitType: string; // "simpleBlock" | "metalCaravan" | "tent"
  directHitCollapse: boolean;
  roofHoles: boolean;
  minorCracks: boolean;
  doorsWindowsDamage: boolean;
  electricalDamage: boolean;
  waterLeak: boolean;
  habitability: string; // "habitable" | "needs-reinforcement" | "uninhabitable"
  damagePercentage: number;
  additionalNotes: string;
}

export interface IAdditionalBuildings {
  roomType: string; // "agriculture" | "services" | "walls"
  structureType: string; // "zinc" | "block" | "sheet" | "prefab"
  roofCollapse: boolean;
  wallBreak: boolean;
  doorDamage: boolean;
  waterNetworkDamage: boolean;
  damagePercentage: number;
  additionalNotes: string;
}
