export interface ILocationState {
  loading?: boolean;
  error?: any;
  previousLatitude?: number;
  previousLongitude?: number;
  previousLocationAddress?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  currentLocationAddress?: string;
}
