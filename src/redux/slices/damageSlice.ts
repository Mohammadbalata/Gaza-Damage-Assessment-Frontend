import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IDamageAssessmentState } from "../../interfaces/store/IDamageAssessmentState";

const initialState: IDamageAssessmentState = {
  damageLevel: "",
  propertyType: "",
  propertySize: 0,
  numberOfRooms: 0,
  isInhabitable: false,
  additionalNotes: "",
  loading: false,
  error: null,
};

export const damageAssessmentSlice = createSlice({
  name: "damageAssessment",
  initialState,
  reducers: {
    resetDamageAssessment: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(saveDamageAssessment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(saveDamageAssessment.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.damageLevel = action.payload.damageLevel;
      state.propertyType = action.payload.propertyType;
      state.propertySize = action.payload.propertySize;
      state.numberOfRooms = action.payload.numberOfRooms;
      state.isInhabitable = action.payload.isInhabitable;
      state.additionalNotes = action.payload.additionalNotes;
    });
    builder.addCase(saveDamageAssessment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetDamageAssessment } = damageAssessmentSlice.actions;

export const saveDamageAssessment = createAsyncThunk(
  "damage/save",
  async (
    payload: {
      damageLevel: string;
      propertyType: string;
      propertySize: number;
      numberOfRooms: number;
      isInhabitable: boolean;
      additionalNotes: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Replace with API call later
      // simulate success
      return payload;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to save damage assessment");
    }
  }
);

export default damageAssessmentSlice.reducer;
