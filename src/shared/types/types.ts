export interface ApplicationData {
  national_id: string
  fullName: string
  motherName: string
  dateOfBirth: string
  addressBeforeWar: string
  numberOfChildren: number
  wifeName: string
  wifeNationalId: string
  phoneNumber: string
  damageLevel: string
  propertyType: string
  propertySize: number
  numberOfRooms: number
  isInhabitable: boolean
  additionalNotes: string
  documents: File[]
  previousLatitude: number
  previousLongitude: number
  previousLocationAddress: string
  currentLatitude: number
  currentLongitude: number
  currentLocationAddress: string
  latitude?: number
  longitude?: number
  locationAddress?: string
  trackingNumber?: string
  password?: string
  id?: number;
  report_code?: string;
  status?: string;
  damage_details?: {
    note?: string;
  };
  created_at?: string;
  updated_at?: string;
}