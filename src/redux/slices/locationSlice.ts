import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ILocationState } from "../../interfaces/store/ILocationState";

const initialState: ILocationState = {
  previosLocation: {},
  currentLocation: {},
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
        state.previosLocation = action.payload.previosLocation;
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
        state.currentLocation = action.payload.currentLocation;
      })
      .addCase(updateCurrentLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const updatePreviousLocation = createAsyncThunk<
  ILocationState,
  ILocationState
>("location/updatePreviousLocation", async (data, { rejectWithValue }) => {
  try {
    console.log(data)
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

export default locationSlice.reducer;
