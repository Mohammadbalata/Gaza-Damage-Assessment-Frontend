export interface ILocationState {
  loading?: boolean;
  error?: any;
  previousLatitude?: number[];
  previousLongitude?: number[];
  previousLocationAddress?: string[];
  longitude?: any;
  latitude?: any;
  governorate?:any;
  currentLatitude?: number;
  currentLongitude?: number;
  currentLocationAddress?: string;
  extraData?:any
  propertyDamaged?:any
}
