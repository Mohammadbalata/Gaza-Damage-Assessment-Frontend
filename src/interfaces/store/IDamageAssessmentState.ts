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
  // propertyArea?: number | null; // done
  // damageType?: string; // done:
}
export interface IndependentBuilding {
  numberOfFloors: number | null;
  groundFloorArea: number | null;
  commonFloorArea: number | null;
  roofType: string;
  wallType: string;
  buildingAge: number | null;
  damageType: string; //done
  damageTypes: string[]; //done
  damagePercentage: number | null;
  additionalNotes: string;
  isHabitable?: boolean; //done
  propertyType?: string;
  propertyOwnerName?: string;
  beforeWarImage?: any;
  afterWarImage?: any;
  ownershipDocuments?: any;
}

interface ApartmentInsideBuilding {
  floorNumber?: number | null;
  apartmentNumber?: string;
  propertyArea?: number | null; // done
  roomsCount?: number | null;
  wallCracks?: string;
  doorsDamage?: string;
  windowsDamage?: string;
  floorDamage?: string;
  ceilingDamage?: string;
  kitchenDamage?: string;
  bathroomDamage?: string;
  electricalDamage?: string;
  mainBuildingDamage?: string;
  damagePercentage?: number | null;
  habitability?: string; // done
  additionalNotes?: string;
  isHabitable?: boolean; //done
  damageType?: string; //done
  damageTypes: string[]; //done
  propertyType?: string;
  propertyOwnerName?: string;
  beforeWarImage?: any;
  afterWarImage?: any;
  ownershipDocuments?: any[];
  usageType?: "";
}
interface ResidentialBuilding {
  floorsCount?: number | null;
  apartmentsPerFloor?: number | null;
  usageType?: string;
  otherUsageType?: string;
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
  damagePercentage?: number | null;
  usageFeasibility?: string;
  additionalNotes?: string;
  damageType?: string; //done
  damageTypes: string[]; //done
  habitability?: string; // done
  isHabitable?: boolean; //done
  groundFloorArea: number | null;
  commonFloorArea: number | null;
  propertyType?: string;
  propertyOwnerName?: string;
  beforeWarImage?: any;
  afterWarImage?: any;
  ownershipDocuments?: any[];
  collapsedFloors?: number | null;
  partialCollapses?: number | null;
  criticalRoofBelts?: boolean;
  criticalColumnDamage?: boolean;
  criticalShearWallDamage?: boolean;
  unusableFloors?: number | null;
}
export interface ITower {
  totalFloors?: number | null;
  serviceFloors?: number | null;
  unitsCount?: number | null;
  usageType?: "";
  otherUsageType?: string;
  structuralSystem?: "columns" | "shear-walls" | "";
  collapsedFloors?: number | null;
  partialCollapses?: number | null;
  criticalColumnDamage?: boolean;
  criticalShearWallDamage?: boolean;
  projectilePenetrations?: number | null;
  floorNumber?: number | null;
  status?: "undamaged" | "minor" | "moderate" | "severe" | "collapsed";
  damagedUnits?: number | null;
  elevatorsDown?: boolean;
  fireSystemDamaged?: boolean;
  mainElectricRoom?: boolean;
  roofTanksDamaged?: boolean;
  unusableFloors?: number | null;
  structuralDamagePercent?: number | null;
  architecturalDamagePercent?: number | null;
  servicesDamagePercent?: number | null;
  engineerRecommendation?: string; //done
  isHabitable?: boolean; //done
  groundFloorArea: number | null;
  commonFloorArea: number | null;
  damageType?: string; // done:
  damageTypes: string[]; //done
  propertyType?: string;
  propertyOwnerName?: string;
  beforeWarImage?: any;
  afterWarImage?: any;
  ownershipDocuments?: any[];
  criticalRoofBelts?: boolean;
  additionalNotes?: string;
  damagePercentage?: number | null;
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
  damagePercentage: number | null;
  additionalNotes: string;
  isHabitable?: boolean; //done
  propertyArea?: number | null; // done
  damageType?: string; // done:
  damageTypes: string[]; //done
  propertyType?: string;
  propertyOwnerName?: string;
  beforeWarImage?: any;
  afterWarImage?: any;
  ownershipDocuments?: any[];
}

export interface IAdditionalBuildings {
  roomType?: string; // "agriculture" | "services" | "walls"
  otherRoomType?: string;
  structureType?: string; // "zinc" | "block" | "sheet" | "prefab"
  roofCollapse?: boolean;
  wallBreak?: boolean;
  doorDamage?: boolean;
  waterNetworkDamage?: boolean;
  damagePercentage?: number | null;
  additionalNotes?: string;
  damageType?: string; //done
  damageTypes?: string[]; //done
  habitability?: string; // done
  isHabitable?: boolean; //done
  propertyArea?: number | null; // done
  propertyType?: string;
  propertyOwnerName?: string;
  beforeWarImage?: any;
  afterWarImage?: any;
  ownershipDocuments?: any[];
  floorsCount?: any;
  commonFloorArea?: any;
  constructionType?:any
}
