import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IRegistryData } from "../../interfaces/store/IRegistryData";

const initialState: IRegistryData = {
  fullName: "",
  motherName: "",
  dateOfBirth: "",
  wifeName: "",
  phoneNumber: "",
  addressBeforeWar: "",
  numberOfChildren: 0,
  numberOfSons: 0,
  numberOfDaughters: 0,
  loading: false,
  error: null,
};

export const personalSlice = createSlice({
  name: "personal",
  initialState,
  reducers: {
    setPersonalInfo: (state, action: { payload: IRegistryData }) => {
      state.fullName = action.payload.fullName;
      state.motherName = action.payload.motherName;
      state.dateOfBirth = action.payload.dateOfBirth;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncRegistryPersonalInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncRegistryPersonalInfo.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(syncRegistryPersonalInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const syncRegistryPersonalInfo = createAsyncThunk<
  IRegistryData, // Return type
  IRegistryData, // Argument type
  { rejectValue: string }
>(
  "personal/syncRegistryPersonalInfo",
  async (registryData, { rejectWithValue }) => {
    try {
      return {
        fullName: registryData.fullName,
        motherName: registryData.motherName,
        dateOfBirth: registryData.dateOfBirth,
        wifeName: registryData.wifeName,
        phoneNumber: registryData.phoneNumber,
        addressBeforeWar: registryData.addressBeforeWar,

        numberOfChildren:
          (registryData.numberOfSons ?? 0) +
          (registryData.numberOfDaughters ?? 0),

        numberOfSons: registryData.numberOfSons,
        numberOfDaughters: registryData.numberOfDaughters,
      };
    } catch (error: any) {
      return rejectWithValue("Failed to sync registry data");
    }
  }
);

export const { setPersonalInfo } = personalSlice.actions;
export default personalSlice.reducer;
