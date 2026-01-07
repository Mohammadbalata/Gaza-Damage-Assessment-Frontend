import { create } from "zustand";

interface ApplicationData {
  nationalId: number;
  fullName: string;
  motherName: string;
  dateOfBirth: string;
  addressBeforeWar: string;
  numberOfChildren: number;
  wifeName: string;
  wifeNationalId: string;
  phoneNumber: string;
  damageLevel: string;
  propertyType: string;
  propertySize: number;
  numberOfRooms: number;
  isInhabitable: boolean;
  additionalNotes: string;
  documents: File[];
  // Previous location (before war)
  previousLatitude: number;
  previousLongitude: number;
  previousLocationAddress: string;
  // Current location (after war)
  currentLatitude: number;
  currentLongitude: number;
  currentLocationAddress: string;
  // Legacy fields (for backward compatibility)
  latitude?: number;
  longitude?: number;
  locationAddress?: string;
  trackingNumber?: string;
  password?: string;
}

interface ApplicationStore {
  data: Partial<ApplicationData>;
  setNationalId: (id: number) => void;
  setPersonalInfo: (info: Partial<ApplicationData>) => void;
  setFamilyInfo: (info: Partial<ApplicationData>) => void;
  setDamageAssessment: (info: Partial<ApplicationData>) => void;
  setDocuments: (docs: File[]) => void;
  setPreviousLocation: (lat: number, lng: number, address: string) => void;
  setCurrentLocation: (lat: number, lng: number, address: string) => void;
  setLocation: (lat: number, lng: number, address: string) => void; // Legacy
  setTrackingNumber: (number: string) => void;
  setPassword: (password: string) => void;
  reset: () => void;
}

const defaultData: Partial<ApplicationData> = {
  numberOfChildren: 0,
  propertySize: 0,
  numberOfRooms: 0,
  isInhabitable: false,
  documents: [],
};

export const useApplicationStore = create<ApplicationStore>((set) => ({
  data: defaultData,
  setNationalId: (id) =>
    set((state) => ({ data: { ...state.data, nationalId: id } })),
  setPersonalInfo: (info) =>
    set((state) => ({ data: { ...state.data, ...info } })),
  setFamilyInfo: (info) =>
    set((state) => ({ data: { ...state.data, ...info } })),
  setDamageAssessment: (info) =>
    set((state) => ({ data: { ...state.data, ...info } })),
  setDocuments: (docs) =>
    set((state) => ({ data: { ...state.data, documents: docs } })),
  setPreviousLocation: (lat, lng, address) =>
    set((state) => ({
      data: {
        ...state.data,
        previousLatitude: lat,
        previousLongitude: lng,
        previousLocationAddress: address,
      },
    })),
  setCurrentLocation: (lat, lng, address) =>
    set((state) => ({
      data: {
        ...state.data,
        currentLatitude: lat,
        currentLongitude: lng,
        currentLocationAddress: address,
      },
    })),
  setLocation: (lat, lng, address) =>
    set((state) => ({
      data: {
        ...state.data,
        latitude: lat,
        longitude: lng,
        locationAddress: address,
      },
    })),
  setTrackingNumber: (number) =>
    set((state) => ({ data: { ...state.data, trackingNumber: number } })),
  setPassword: (password) =>
    set((state) => ({ data: { ...state.data, password } })),
  reset: () => set({ data: defaultData }),
}));
