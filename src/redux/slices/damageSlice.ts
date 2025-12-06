import { createSlice } from "@reduxjs/toolkit";
import { IDamageAssessmentState } from "../../interfaces/store/IDamageAssessmentState";
import { AppDispatch } from "../store";

const initialState: IDamageAssessmentState = {
  IndependentBuilding: {
    numberOfFloors: 0,
    floorArea: 0,
    roofType: "",
    wallType: "",
    buildingAge: 0,
    damagePercentage: 0,
    habitability: "",
    damageType: "",
    additionalNotes: "",
  },
  loading: false,
  error: null,
};

export const damageAssessmentSlice = createSlice({
  name: "damageAssessment",
  initialState,
  reducers: {
    resetIndependentBuilding: (state, action) => {
      state.IndependentBuilding.floorArea = action.payload.floorArea;
      state.IndependentBuilding.numberOfFloors = action.payload.numberOfFloors;
      state.IndependentBuilding.roofType = action.payload.roofType;
      state.IndependentBuilding.wallType = action.payload.wallType;
      state.IndependentBuilding.buildingAge = action.payload.buildingAge;
      state.IndependentBuilding.damageType = action.payload.damageType;
      state.IndependentBuilding.damagePercentage =
        action.payload.damagePercentage;
      state.IndependentBuilding.habitability = action.payload.habitability;
      state.IndependentBuilding.additionalNotes =
        action.payload.additionalNotes;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { resetIndependentBuilding, setLoading, setError } =
  damageAssessmentSlice.actions;

export const saveIndependentBuilding =
  (data: IDamageAssessmentState) => (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      dispatch(resetIndependentBuilding(data));
    } catch (err) {
      dispatch(setError("Failed to saveIndependentBuilding damage"));
    } finally {
      dispatch(setLoading(false));
    }
    console.log(data, dispatch);
  };

export default damageAssessmentSlice.reducer;
