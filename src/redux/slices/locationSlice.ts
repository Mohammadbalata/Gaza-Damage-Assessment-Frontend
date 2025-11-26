import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApplicationData } from '../../interfaces/types'

const initialState: Partial<ApplicationData> = {}

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setPreviousLocation: (
      state,
      action: PayloadAction<{ lat: number; lng: number; address: string }>
    ) => {
      state.previousLatitude = action.payload.lat
      state.previousLongitude = action.payload.lng
      state.previousLocationAddress = action.payload.address
    },
    setCurrentLocation: (
      state,
      action: PayloadAction<{ lat: number; lng: number; address: string }>
    ) => {
      state.currentLatitude = action.payload.lat
      state.currentLongitude = action.payload.lng
      state.currentLocationAddress = action.payload.address
    },
    // legacy
    setLocation: (
      state,
      action: PayloadAction<{ lat: number; lng: number; address: string }>
    ) => {
      state.latitude = action.payload.lat
      state.longitude = action.payload.lng
      state.locationAddress = action.payload.address
    },
  },
})

export const {
  setPreviousLocation,
  setCurrentLocation,
  setLocation,
} = locationSlice.actions

export default locationSlice.reducer
