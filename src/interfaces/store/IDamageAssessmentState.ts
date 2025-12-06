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

export interface IDamageAssessmentState {
  buildingType: string;
  IndependentBuilding: IndependentBuilding;
  loading: boolean;
  error: string | null;
}
