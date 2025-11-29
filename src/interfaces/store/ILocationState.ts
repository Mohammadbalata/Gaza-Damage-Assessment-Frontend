export interface ILocationState {
  lat?: number;
  lng?: number;
  address?: string;
  loading?: boolean;
  error?: any;

  previousLatitude?: number;
  previousLongitude?: number;
  previousLocationAddress?: string;

  currentLatitude?: number;
  currentLongitude?: number;
  currentLocationAddress?: string;

  // legacy
  latitude?: number;
  longitude?: number;
  locationAddress?: string;
}
