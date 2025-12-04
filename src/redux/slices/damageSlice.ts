import { createSlice } from "@reduxjs/toolkit";
import { IDamageAssessmentState } from "../../interfaces/store/IDamageAssessmentState";
import { AppDispatch } from "../store";

const initialState: IDamageAssessmentState = {
  buildingType:"",
  damageLevel: "",
  propertyType: "",
  propertySize: 0,
  numberOfRooms: 0,
  isInhabitable: "false",
  additionalNotes: "",
  loading: false,
  error: null,
};

export const damageAssessmentSlice = createSlice({
  name: "damageAssessment",
  initialState,
  reducers: {
    resetDamageAssessment: (state, action) => {
      state.damageLevel = action.payload.damageLevel;
      state.propertyType = action.payload.propertyType;
      state.propertySize = action.payload.propertySize;
      state.numberOfRooms = action.payload.numberOfRooms;
      state.isInhabitable = action.payload.isInhabitable;
      state.additionalNotes = action.payload.additionalNotes;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setBuildingType : (state , action) => {
      state.buildingType = action.payload
    }
  },
});

export const { resetDamageAssessment, setLoading, setError , setBuildingType } =
  damageAssessmentSlice.actions;

export const saveDamageAssessment =
  (body: IDamageAssessmentState) => (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      dispatch(resetDamageAssessment(body));
    } catch (error) {
      dispatch(setError("Failed to save damage assessment"));
    } finally {
      dispatch(setLoading(false));
    }
  };

export default damageAssessmentSlice.reducer;
