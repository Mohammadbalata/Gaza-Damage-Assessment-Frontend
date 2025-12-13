import {
  ActionCreatorWithPayload,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { IDamageAssessmentState } from "../../interfaces/store/IDamageAssessmentState";
import { AppDispatch } from "../store";
import { axiosClient } from "../../api/baseUrl";

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
    isHabitable: false,
    propertyArea: 0,
    additionalNotes: "",
    propertyType: "",
  },
  ApartmentInsideBuilding: {
    floorNumber: 0,
    apartmentNumber: "",
    propertyArea: 0,
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
    damageType: "",
    isHabitable: false,
    propertyType: "",
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
    habitability: "",
    isHabitable: false,
    damageType: "",
    propertyType: "",
  },
  tower: {
    totalFloors: 0,
    serviceFloors: 0,
    unitsCount: 0,
    usageType: "",
    structuralSystem: "",
    collapsedFloors: 0,
    partialCollapses: 0,
    criticalColumnDamage: false,
    criticalShearWallDamage: false,
    projectilePenetrations: 0,
    elevatorsDown: false,
    floorNumber: 0,
    fireSystemDamaged: false,
    mainElectricRoom: false,
    roofTanksDamaged: false,
    unusableFloors: 0,
    structuralDamagePercent: 0,
    architecturalDamagePercent: 0,
    servicesDamagePercent: 0,
    engineerRecommendation: "",
    propertyArea: 0,
    isHabitable: false,
    damageType: "",
    propertyType: "",
  },
  compHouse: {
    unitType: "",
    directHitCollapse: false,
    roofHoles: false,
    minorCracks: false,
    doorsWindowsDamage: false,
    electricalDamage: false,
    waterLeak: false,
    habitability: "",
    damagePercentage: 0,
    additionalNotes: "",
    propertyArea: 0,
    isHabitable: false,
    damageType: "",
    propertyType: "",
  },
  additionalBuildings: {
    roomType: "",
    structureType: "",
    roofCollapse: false,
    wallBreak: false,
    doorDamage: false,
    waterNetworkDamage: false,
    damagePercentage: 0,
    additionalNotes: "",
    damageType: "",
    habitability: "",
    isHabitable: false,
    propertyArea: 0,
    propertyType: "",
  },
  loading: false,
  error: null,
};

const handleSave = async (
  dispatch: AppDispatch,
  actionCreator: ActionCreatorWithPayload<any, string>,
  buildingType: string,
  data: any,
  errorMessage: string
) => {
  const token = localStorage.getItem("token") || "";
  dispatch(setLoading(true));
  try {
    dispatch(setBuildingType(buildingType));
    dispatch(actionCreator(data));
    console.log("buildingType in handleSave", buildingType);
    await axiosClient.post(
      "https://backend-5549.onrender.com/applications/add-extra-data",
      {
        extraData: JSON.stringify({
          buildingType: buildingType,
          [buildingType]: data,
        }),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(JSON.parse(res.data.data.extraData));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : errorMessage;
    console.log(msg);
    dispatch(setError(msg));
  } finally {
    dispatch(setLoading(false));
  }
};

export const damageAssessmentSlice = createSlice({
  name: "damageAssessment",
  initialState,
  reducers: {
    resetIndependentBuilding: (state, action: PayloadAction<any>) => {
      state.IndependentBuilding = action.payload;
    },
    resetApartmentInsideBuilding: (state, action: PayloadAction<any>) => {
      state.ApartmentInsideBuilding = action.payload;
    },
    resetResidentialBuilding: (state, action: PayloadAction<any>) => {
      state.ResidentialBuilding = action.payload;
    },
    saveTowerData: (state, action: PayloadAction<any>) => {
      state.tower = action.payload;
    },
    resetCompHouse: (state, action: PayloadAction<any>) => {
      state.compHouse = action.payload;
    },
    resetAdditionalBuildings: (state, action: PayloadAction<any>) => {
      state.additionalBuildings = action.payload;
    },
    resetAllBuildings: (state) => {
      state.IndependentBuilding = initialState.IndependentBuilding;
      state.ApartmentInsideBuilding = initialState.ApartmentInsideBuilding;
      state.ResidentialBuilding = initialState.ResidentialBuilding;
      state.tower = initialState.tower;
      state.compHouse = initialState.compHouse;
      state.additionalBuildings = initialState.additionalBuildings;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setBuildingType: (state, action: PayloadAction<string>) => {
      state.buildingType = action.payload;
    },
  },
});

export const {
  resetIndependentBuilding,
  resetApartmentInsideBuilding,
  resetResidentialBuilding,
  saveTowerData,
  resetCompHouse,
  resetAdditionalBuildings,
  resetAllBuildings,
  setLoading,
  setError,
  setBuildingType,
} = damageAssessmentSlice.actions;

// Export save actions using handleSave
export const saveIndependentBuilding =
  (data: IDamageAssessmentState) => async (dispatch: AppDispatch) =>
    await handleSave(
      dispatch,
      resetIndependentBuilding,
      data.buildingType,
      data.IndependentBuilding,
      "Failed to save IndependentBuilding damage"
    );

export const saveApartmentInsideBuilding =
  (data: IDamageAssessmentState) => async (dispatch: AppDispatch) =>
    await handleSave(
      dispatch,
      resetApartmentInsideBuilding,
      data.buildingType,
      data.ApartmentInsideBuilding,
      "Failed to save ApartmentInsideBuilding damage"
    );

export const saveResidentialBuilding =
  (data: IDamageAssessmentState) => async (dispatch: AppDispatch) =>
    await handleSave(
      dispatch,
      resetResidentialBuilding,
      data.buildingType,
      data.ResidentialBuilding,
      "Failed to save ResidentialBuilding damage"
    );

export const saveTower =
  (data: IDamageAssessmentState) => async (dispatch: AppDispatch) =>
    await handleSave(
      dispatch,
      saveTowerData,
      data.buildingType,
      data.tower,
      "Failed to save Tower data"
    );

export const saveCompHouse =
  (data: IDamageAssessmentState) => async (dispatch: AppDispatch) => {
    await handleSave(
      dispatch,
      resetCompHouse,
      data.buildingType,
      data.compHouse,
      "Failed to save CompHouse data"
    );
  };

export const saveAdditionalBuildings =
  (data: IDamageAssessmentState) => async (dispatch: AppDispatch) =>
    await handleSave(
      dispatch,
      resetAdditionalBuildings,
      data.buildingType,
      data.additionalBuildings,
      "Failed to save AdditionalBuildings data"
    );

export default damageAssessmentSlice.reducer;
