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
export interface IMixedUsage {
  floors: IFloorsState;
  units: IUnitsState;
}
export interface IFloorsState {
  ground: any;
  mezzanine: any;
  roof: any;
}

export interface IUnitsState {
  ground: any;
  mezzanine: any;
  roof: any;
}
export interface IUnit {
  id:any;
  usage: string;
  activity: string;
}
export interface DamageState {
  ResidentialBuilding: {
    MixedUsage: IMixedUsage;
  };
  tower: {
    MixedUsage: IMixedUsage;
  };
}
export interface IndependentBuilding {
  independentBuildingType?: string;
  numberOfFloors?: number | null;
  groundFloorArea?: number | null;
  commonFloorArea?: number | null;
  propertyType?: string;
  propertyOwnerName?: string;
  hasPartners?: string;
  partnersCount?: number | null;
  roofType?: string;
  wallType?: string;
  buildingAge?: string | null;
  damageType?: string;
  damageTypes?: string[];
  damagePercentage?: string; // "25%" | "50%" | ...
  nearestLandmark?: string;
  buildingNumber?: string;
  nameOfStreet?: string;
  isHabitable?: string; // "نعم" | "لا"
  additionalNotes?: string;
  before_damage_image?: any;
  after_damage_image?: any;
  ownership_documents?: any[];
  BuildingContent?: any[];
}

export interface ApartmentInsideBuilding {
  floorNumber?: number | null;
  apartmentNumber?: string;
  propertyArea?: number | null;

  propertyType?: string;
  propertyOwnerName?: string;
  hasPartners?: string;
  partnersCount?: number | null;
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

  before_damage_image?: any;
  after_damage_image?: any;
  ownership_documents?: any[];
  BuildingContent?: any[];
  mainBuildingAge?: string | null;
}

export interface ResidentialBuilding {
  floorsCount?: number | null;
  groundFloorArea?: number | null;
  commonFloorArea?: number | null;
  apartmentsPerFloor?: number | null;

  propertyType?: string;
  propertyOwnerName?: string;
  hasPartners?: string;
  partnersCount?: number | null;
  nearestLandmark?: string;
  buildingNumber?: string;
  nameOfStreet?: string;
  usageType?: string;
  buildingAge?: string | null;
  otherUsageType?: string;
  floors?: any;
  units?: any[];

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

  before_damage_image?: any;
  after_damage_image?: any;
  ownership_documents?: any[];
  BuildingContent?: any[];
  MixedUsage_floors_ground?: boolean;
  MixedUsage_floors_mezzanine?: boolean;
  MixedUsage_floors_roof?: boolean;
  MixedUsage_units_ground?: any[];
  MixedUsage_units_mezzanine?: any[];
  MixedUsage_units_roof?: any[];
}

export interface ITower {
  totalFloors?: number | null;
  groundFloorArea?: number | null;
  commonFloorArea?: number | null;
  unitsCount?: number | null;
  towerName?: string;

  propertyType?: string;
  propertyOwnerName?: string;
  hasPartners?: string;
  partnersCount?: number | null;
  nearestLandmark?: string;
  buildingNumber?: string;
  nameOfStreet?: string;
  usageType?: string;
  buildingAge?: string | null;
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

  before_damage_image?: any;
  after_damage_image?: any;
  ownership_documents?: any[];
  BuildingContent?: any[];
  MixedUsage_floors_ground?: boolean;
  MixedUsage_floors_mezzanine?: boolean;
  MixedUsage_floors_roof?: boolean;
  MixedUsage_units_ground?: any[];
  MixedUsage_units_mezzanine?: any[];
  MixedUsage_units_roof?: any[];
}

export interface ICompHouse {
  propertyArea?: number | null;

  propertyType?: string;
  propertyOwnerName?: string;
  hasPartners?: string;
  partnersCount?: number | null;
  buildingAge?: string | null;

  damageType?: string;
  damageTypes: string[];
  damagePercentage?: string;
  nearestLandmark?: string;
  buildingNumber?: string;
  nameOfStreet?: string;
  isHabitable?: string;
  additionalNotes?: string;

  before_damage_image?: any;
  after_damage_image?: any;
  ownership_documents?: any[];
  BuildingContent?: any[];
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
  hasPartners?: string;
  partnersCount?: number | null;
  buildingAge?: string | null;

  damageType?: string;
  damageTypes: string[];
  damagePercentage?: string;

  isHabitable?: string;
  additionalNotes?: string;

  before_damage_image?: any;
  after_damage_image?: any;
  ownership_documents?: any[];
  BuildingContent?: any[];
}
