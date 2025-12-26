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
  numberOfFloors?: number | null;
  groundFloorArea?: number | null;
  commonFloorArea?: number | null;
  propertyType?: string;
  propertyOwnerName?: string;
  roofType?: string;
  wallType?: string;
  buildingAge?: number | null;
  damageType?: string;
  damageTypes?: string[];
  damagePercentage?: string; // "25%" | "50%" | ...
  nearestLandmark?: string;
  buildingNumber?: string;
  nameOfStreet?: string;
  isHabitable?: string; // "نعم" | "لا"
  additionalNotes?: string;
  beforeWarImage?: any;
  afterWarImage?: any;
  ownershipDocuments?: any[];
}

export interface ApartmentInsideBuilding {
  floorNumber?: number | null;
  apartmentNumber?: string;
  propertyArea?: number | null;

  propertyType?: string;
  propertyOwnerName?: string;
  usageType?: string;

  mainBuildingDamage?: string;
  nearestLandmark?: string;
  buildingNumber?: string;
  nameOfStreet?: string;
  damageType?: string;
  damageTypes: string[];
  damagePercentage?: string;

  isHabitable?: string;
  additionalNotes?: string;

  beforeWarImage?: any;
  afterWarImage?: any;
  ownershipDocuments?: any[];
}

export interface ResidentialBuilding {
  floorsCount?: number | null;
  groundFloorArea?: number | null;
  commonFloorArea?: number | null;
  apartmentsPerFloor?: number | null;

  propertyType?: string;
  propertyOwnerName?: string;
  nearestLandmark?: string;
  buildingNumber?: string;
  nameOfStreet?: string;
  usageType?: string;
  otherUsageType?: string;

  collapsedFloors?: number | null;
  partialCollapses?: number | null;

  criticalColumnDamage?: boolean;
  criticalShearWallDamage?: boolean;
  criticalRoofBelts?: boolean;

  damageType?: string;
  damageTypes: string[];
  unusableFloors?: number | null;
  damagePercentage?: string;

  isHabitable?: string;
  additionalNotes?: string;

  beforeWarImage?: any;
  afterWarImage?: any;
  ownershipDocuments?: any[];
}

export interface ITower {
  totalFloors?: number | null;
  groundFloorArea?: number | null;
  commonFloorArea?: number | null;
  unitsCount?: number | null;

  propertyType?: string;
  propertyOwnerName?: string;
  nearestLandmark?: string;
  buildingNumber?: string;
  nameOfStreet?: string;
  usageType?: string;
  otherUsageType?: string;

  collapsedFloors?: number | null;
  partialCollapses?: number | null;

  criticalColumnDamage?: boolean;
  criticalShearWallDamage?: boolean;
  criticalRoofBelts?: boolean;

  unusableFloors?: number | null;

  damageType?: string;
  damageTypes: string[];
  damagePercentage?: string;

  isHabitable?: string;
  additionalNotes?: string;

  beforeWarImage?: any;
  afterWarImage?: any;
  ownershipDocuments?: any[];
}

export interface ICompHouse {
  propertyArea?: number | null;

  propertyType?: string;
  propertyOwnerName?: string;

  damageType?: string;
  damageTypes: string[];
  damagePercentage?: string;
  nearestLandmark?: string;
  buildingNumber?: string;
  nameOfStreet?: string;
  isHabitable?: string;
  additionalNotes?: string;

  beforeWarImage?: any;
  afterWarImage?: any;
  ownershipDocuments?: any[];
}

export interface IAdditionalBuildings {
  roomType?: string;
  otherRoomType?: string;

  propertyArea?: number | null;
  floorsCount?: number | null;
  commonFloorArea?: number | null;
  nearestLandmark?: string;
  buildingNumber?: string;
  nameOfStreet?: string;
  constructionType?: string;

  propertyType?: string;
  propertyOwnerName?: string;

  damageType?: string;
  damageTypes: string[];
  damagePercentage?: string;

  isHabitable?: string;
  additionalNotes?: string;

  beforeWarImage?: any;
  afterWarImage?: any;
  ownershipDocuments?: any[];
}
