import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApplicationData } from "../../../shared/types/types";

const initialState: Partial<ApplicationData> = {
  addressBeforeWar: "",
  numberOfChildren: 0,
  wifeName: "",
  wifeNationalId: "",
  phoneNumber: "",
};

export const familySlice = createSlice({
  name: "family",
  initialState,
  reducers: {
    setFamilyInfo: (state, action: PayloadAction<Partial<ApplicationData>>) => {
      state.addressBeforeWar = action.payload.addressBeforeWar;
      state.numberOfChildren = action.payload.numberOfChildren;
      state.wifeName = action.payload.wifeName;
      state.wifeNationalId = action.payload.wifeNationalId;
      state.phoneNumber = action.payload.phoneNumber;
    },
  },
});

export const { setFamilyInfo } = familySlice.actions;
export default familySlice.reducer;
