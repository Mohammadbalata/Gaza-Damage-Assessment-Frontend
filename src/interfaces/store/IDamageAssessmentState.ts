export interface IDamageAssessmentState {
  damageLevel: string;
  propertyType: string;
  propertySize: number;
  numberOfRooms: number;
  isInhabitable: boolean ;
  additionalNotes: string;
  loading: boolean;
  error: string | null;
}

export interface FormData {
  damageLevel: string;
  propertyType: string;
  propertySize: number;
  numberOfRooms: number;
  isInhabitable: string;
  additionalNotes: string;
}