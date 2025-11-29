// import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { ApplicationData } from '../../interfaces/types'

// const initialState: Partial<ApplicationData> = {}

// export const locationSlice = createSlice({
//   name: 'location',
//   initialState,
//   reducers: {
//     setPreviousLocation: (
//       state,
//       action: PayloadAction<{ lat: number; lng: number; address: string }>
//     ) => {
//       state.previousLatitude = action.payload.lat
//       state.previousLongitude = action.payload.lng
//       state.previousLocationAddress = action.payload.address
//     },
//     setCurrentLocation: (
//       state,
//       action: PayloadAction<{ lat: number; lng: number; address: string }>
//     ) => {
//       state.currentLatitude = action.payload.lat
//       state.currentLongitude = action.payload.lng
//       state.currentLocationAddress = action.payload.address
//     },
//     // legacy
//     setLocation: (
//       state,
//       action: PayloadAction<{ lat: number; lng: number; address: string }>
//     ) => {
//       state.latitude = action.payload.lat
//       state.longitude = action.payload.lng
//       state.locationAddress = action.payload.address
//     },
//   },
// })

// export const {
//   setPreviousLocation,
//   setCurrentLocation,
//   setLocation,
// } = locationSlice.actions

// export default locationSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ILocationState } from "../../interfaces/store/ILocationState";

const initialState: ILocationState = {
  previousLatitude: 0,
  previousLongitude: 0,
  previousLocationAddress: "",
  currentLatitude: 0,
  currentLongitude: 0,
  currentLocationAddress: "",
  latitude: 0,
  longitude: 0,
  locationAddress: "",
  loading: false,
  error: null,
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ===== Previous Location =====
    builder
      .addCase(updatePreviousLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePreviousLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.previousLatitude = action.payload.lat;
        state.previousLongitude = action.payload.lng;
        state.previousLocationAddress = action.payload.address;
      })
      .addCase(updatePreviousLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ===== Current Location =====
    builder
      .addCase(updateCurrentLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCurrentLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLatitude = action.payload.lat;
        state.currentLongitude = action.payload.lng;
        state.currentLocationAddress = action.payload.address;
      })
      .addCase(updateCurrentLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // // ===== Legacy Location =====
    // builder
    //   .addCase(updateLocation.pending, (state) => {
    //     state.loading = true;
    //   })
    //   .addCase(updateLocation.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.latitude = action.payload.lat;
    //     state.longitude = action.payload.lng;
    //     state.locationAddress = action.payload.address;
    //   })
    //   .addCase(updateLocation.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   });
  },
});

export const updatePreviousLocation = createAsyncThunk<
  ILocationState,
  ILocationState
>("location/updatePreviousLocation", async (data, { rejectWithValue }) => {
  try {
    return data;
  } catch {
    return rejectWithValue("Failed to update previous location");
  }
});

export const updateCurrentLocation = createAsyncThunk<
  ILocationState,
  ILocationState
>("location/updateCurrentLocation", async (data, { rejectWithValue }) => {
  try {
    return data;
  } catch {
    return rejectWithValue("Failed to update current location");
  }
});

// // Legacy
// export const updateLocation = createAsyncThunk<
//   ILocationPayload,
//   ILocationPayload
// >("location/updateLocation", async (data, { rejectWithValue }) => {
//   try {
//     return data;
//   } catch {
//     return rejectWithValue("Failed to update location");
//   }
// });

export default locationSlice.reducer;
