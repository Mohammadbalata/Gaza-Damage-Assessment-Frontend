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
export interface IDamageAssessmentState {
  buildingType: string;
  independentBuilding: IndependentBuilding;
  tower : ITower
  loading: boolean;
  error: string | null;
}
