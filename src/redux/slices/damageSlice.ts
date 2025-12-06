import { createSlice } from "@reduxjs/toolkit";
import { IDamageAssessmentState } from "../../interfaces/store/IDamageAssessmentState";
import { AppDispatch } from "../store";

const initialState: IDamageAssessmentState = {
  buildingType: "",
  independentBuilding: {
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
  tower: {
    towerInfo: {
      totalFloors: 0,
      serviceFloors: 0,
      unitsCount: 0,
      usageType: "", // residential - commercial - mixed
      structuralSystem: "", // columns/shear walls
    },

    structuralDamage: {
      collapsedFloors: 0,
      partialCollapses: 0,
      criticalColumnDamage: false,
      criticalShearWallDamage: false,
      projectilePenetrations: 0,
    },

    floorsDamage: [
      // { floorNumber, status, damagedUnits }
    ],

    servicesDamage: {
      elevatorsDown: false,
      fireSystemDamaged: false,
      mainElectricRoom: false,
      roofTanksDamaged: false,
    },

    finalAssessment: {
      unusableFloors: 0,
      structuralDamagePercent: 0,
      architecturalDamagePercent: 0,
      servicesDamagePercent: 0,
      engineerRecommendation: "",
    },
  },
  loading: false,
  error: null,
};

export const damageAssessmentSlice = createSlice({
  name: "damageAssessment",
  initialState,
  reducers: {
    resetIndependentBuilding: (state, action) => {
      state.independentBuilding = action.payload;
    },
    saveTowerData: (state, action) => {
      state.tower = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setBuildingType: (state, action) => {
      state.buildingType = action.payload;
    },
  },
});

export const {
  resetIndependentBuilding,
  saveTowerData,
  setLoading,
  setError,
  setBuildingType,
} = damageAssessmentSlice.actions;

export const saveIndependentBuilding =
  (data: IDamageAssessmentState) => (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      dispatch(resetIndependentBuilding(data.independentBuilding));
      console.log(data);
    } catch (err) {
      dispatch(setError("Failed to saveIndependentBuilding damage"));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const saveTower =
  (data: IDamageAssessmentState) => (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      dispatch(saveTowerData(data.tower));
      console.log("Tower Saved:", data);
    } catch (err) {
      dispatch(setError("Failed to save tower data"));
    } finally {
      dispatch(setLoading(false));
    }
  };
export default damageAssessmentSlice.reducer;
