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
export interface ITower {
  towerInfo: {
    totalFloors: number;
    serviceFloors: number;
    unitsCount: number;
    usageType: "residential" | "commercial" | "mixed" | "";
    structuralSystem: "columns" | "shear-walls" | "";
  };

  structuralDamage: {
    collapsedFloors: number;
    partialCollapses: number;
    criticalColumnDamage: boolean;
    criticalShearWallDamage: boolean;
    projectilePenetrations: number;
  };

  floorsDamage: Array<{
    floorNumber: number;
    status: "undamaged" | "minor" | "moderate" | "severe" | "collapsed";
    damagedUnits: number;
  }>;

  servicesDamage: {
    elevatorsDown: boolean;
    fireSystemDamaged: boolean;
    mainElectricRoom: boolean;
    roofTanksDamaged: boolean;
  };

  finalAssessment: {
    unusableFloors: number;
    structuralDamagePercent: number;
    architecturalDamagePercent: number;
    servicesDamagePercent: number;
    engineerRecommendation: string;
  };
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
  tower : ITower
  loading: boolean;
  error: string | null;
}
