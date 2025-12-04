export interface IDamageAssessmentState extends IFormData {
  loading?: boolean;
  error?: string | null;
}

export interface IFormData {
  buildingType:string;
  damageLevel: string;
  propertyType: string;
  propertySize: number;
  numberOfRooms: number;
  isInhabitable: string;
  additionalNotes: string;
}