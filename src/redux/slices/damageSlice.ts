import { createSlice } from "@reduxjs/toolkit";
import { IDamageAssessmentState } from "../../interfaces/store/IDamageAssessmentState";
import { AppDispatch } from "../store";

const initialState: IDamageAssessmentState = {
  buildingType: "",
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
  ApartmentInsideBuilding: {
    floorNumber: 0,
    apartmentNumber: "",
    apartmentArea: 0,
    roomsCount: 0,
    wallCracks: "",
    doorsDamage: "",
    windowsDamage: "",
    floorDamage: "",
    ceilingDamage: "",
    kitchenDamage: "",
    bathroomDamage: "",
    electricalDamage: "",
    mainBuildingDamage: "",
    damagePercentage: 0,
    habitability: "",
    additionalNotes: "",
  },
  ResidentialBuilding: {
    floorsCount: 0,
    apartmentsPerFloor: 0,
    usageType: "",
    structureType: "",
    columnsCondition: "",
    beamsCondition: "",
    externalWalls: "",
    ceilingDamage: "",
    buildingFacade: "",
    entrancesStairs: "",
    elevators: "",
    electricalNetwork: "",
    waterTanks: "",
    sewageNetwork: "",
    fireSystems: "",
    mostDamagedFloors: "",
    damagePercentage: 0,
    usageFeasibility: "",
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
      state.IndependentBuilding = action.payload;
    },
    resetApartmentInsideBuilding: (state, action) => {
      state.ApartmentInsideBuilding = action.payload;
    },
    resetResidentialBuilding: (state, action) => {
      state.ResidentialBuilding = action.payload;
    },
    resetAllBuildings: (state) => {
      state.IndependentBuilding = initialState.IndependentBuilding;
      state.ApartmentInsideBuilding = initialState.ApartmentInsideBuilding;
      state.ResidentialBuilding = initialState.ResidentialBuilding;
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
  resetApartmentInsideBuilding,
  resetResidentialBuilding,
  resetAllBuildings,
  setLoading,
  setError,
  setBuildingType,
} = damageAssessmentSlice.actions;

export const saveIndependentBuilding =
  (data: IDamageAssessmentState) => (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      dispatch(resetIndependentBuilding(data.IndependentBuilding));
    } catch (err) {
      dispatch(setError("Failed to saveIndependentBuilding damage"));
    } finally {
      dispatch(setLoading(false));
    }
  };
export const saveApartmentInsideBuilding =
  (data: IDamageAssessmentState) => (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      dispatch(resetApartmentInsideBuilding(data.ApartmentInsideBuilding));
    } catch (err) {
      dispatch(setError("Failed to saveApartmentInsideBuilding damage"));
    } finally {
      dispatch(setLoading(false));
    }
  };
export const saveResidentialBuilding =
  (data: IDamageAssessmentState) => (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      dispatch(resetResidentialBuilding(data.ResidentialBuilding));
    } catch (err) {
      dispatch(setError("Failed to saveResidentialBuilding damage"));
    } finally {
      dispatch(setLoading(false));
    }
  };
export default damageAssessmentSlice.reducer;
