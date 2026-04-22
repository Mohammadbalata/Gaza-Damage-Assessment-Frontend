import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosClient } from "../../../shared/api/api";
import { API } from "../../../shared/constants/ApiRoutes";
import {
  clearCitizenInfo as clearCitizenInfoStorage,
  getCitizenInfo,
  setCitizenInfo as setCitizenInfoStorage,
} from "../../../shared/utils/storage";

export interface CitizenState {
  data: any | null;
  loading: boolean;
  error: string | null;
  loaded: boolean;
}

const initialState: CitizenState = {
  data: getCitizenInfo<any>() || null,
  loading: false,
  error: null,
  loaded: false,
};

export const fetchCitizenInfo = createAsyncThunk(
  "citizen/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(API.citizen.profile);
      return res.data.citizen;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

export const saveCitizenInfo = createAsyncThunk(
  "citizen/save",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(API.citizen.profile, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.citizen;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.errors ||
          err?.response?.data?.message ||
          "Failed to update profile",
      );
    }
  },
);

export const citizenSlice = createSlice({
  name: "citizen",
  initialState,
  reducers: {
    setCitizenInfo: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
      state.loaded = true;
      state.error = null;
      if (action.payload) setCitizenInfoStorage(action.payload);
    },
    clearCitizenInfo: (state) => {
      state.data = null;
      state.loaded = false;
      state.error = null;
      clearCitizenInfoStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCitizenInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCitizenInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.loaded = true;
        if (action.payload) setCitizenInfoStorage(action.payload);
      })
      .addCase(fetchCitizenInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch profile";
      })
      .addCase(saveCitizenInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCitizenInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.loaded = true;
        if (action.payload) setCitizenInfoStorage(action.payload);
      })
      .addCase(saveCitizenInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update profile";
      })
      // Wipe citizen data when the auth slice fires its logout action.
      .addMatcher(
        (action): action is { type: string } => action.type === "auth/logout",
        (state) => {
          state.data = null;
          state.loaded = false;
          state.error = null;
          state.loading = false;
        },
      );
  },
});

export const { setCitizenInfo, clearCitizenInfo } = citizenSlice.actions;
export default citizenSlice.reducer;
