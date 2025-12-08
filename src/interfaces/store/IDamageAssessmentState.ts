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
  // isHabitable?: boolean; //done
  // propertyArea?: number; // done
  // damageType?: string; // done:
}
export interface IndependentBuilding {
  numberOfFloors: number;
  floorArea: number;
  roofType: string;
  wallType: string;
  buildingAge: number;
  damageType: string; //done
  damagePercentage: number;
  habitability: string; // done
  additionalNotes: string;
  isHabitable?: boolean; //done
  propertyArea?: number; // done
}

interface ApartmentInsideBuilding {
  floorNumber?: number;
  apartmentNumber?: string;
  propertyArea?: number; // done
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
  habitability?: string; // done
  additionalNotes?: string;
  isHabitable?: boolean; //done
  damageType?: string; //done
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
  damageType?: string; //done
  habitability?: string; // done
  isHabitable?: boolean; //done
  propertyArea?: number; // done
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
  engineerRecommendation?: string; //done
  isHabitable?: boolean; //done
  propertyArea?: number; // done
  damageType?: string; // done:
}

export interface ICompHouse {
  unitType: string; // "simpleBlock" | "metalCaravan" | "tent"
  directHitCollapse: boolean;
  roofHoles: boolean;
  minorCracks: boolean;
  doorsWindowsDamage: boolean;
  electricalDamage: boolean;
  waterLeak: boolean;
  habitability: string; //done
  damagePercentage: number;
  additionalNotes: string;
  isHabitable?: boolean; //done
  propertyArea?: number; // done
  damageType?: string; // done:
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
  damageType?: string; //done
  habitability?: string; // done
  isHabitable?: boolean; //done
  propertyArea?: number; // done
}
