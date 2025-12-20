import {
  ActionCreatorWithPayload,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { IDamageAssessmentState } from "../../interfaces/store/IDamageAssessmentState";
import { AppDispatch } from "../store";

const initialState: IDamageAssessmentState = {
  buildingType: "",
  IndependentBuilding: {
    numberOfFloors: null,
    groundFloorArea: null,
    commonFloorArea: null,
    roofType: "",
    wallType: "",
    buildingAge: null,
    damagePercentage: null,
    damageType: "",
    damageTypes: [],
    isHabitable: false,
    additionalNotes: "",
    propertyType: "",
    propertyOwnerName: "",
    beforeWarImage: null,
    afterWarImage: null,
    ownershipDocuments: [],
  },
  ApartmentInsideBuilding: {
    floorNumber: null,
    apartmentNumber: "",
    propertyArea: null,
    roomsCount: null,
    wallCracks: "",
    doorsDamage: "",
    windowsDamage: "",
    floorDamage: "",
    ceilingDamage: "",
    kitchenDamage: "",
    bathroomDamage: "",
    electricalDamage: "",
    mainBuildingDamage: "",
    damagePercentage: null,
    habitability: "",
    additionalNotes: "",
    damageType: "",
    damageTypes: [],
    isHabitable: false,
    propertyType: "",
    propertyOwnerName: "",
    beforeWarImage: null,
    afterWarImage: null,
    ownershipDocuments: [],
    usageType: "",
  },
  ResidentialBuilding: {
    floorsCount: null,
    apartmentsPerFloor: null,
    usageType: "",
    otherUsageType: "",
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
    damagePercentage: null,
    usageFeasibility: "",
    additionalNotes: "",
    habitability: "",
    isHabitable: false,
    damageType: "",
    damageTypes: [],
    propertyType: "",
    propertyOwnerName: "",
    groundFloorArea: null,
    commonFloorArea: null,
    beforeWarImage: null,
    afterWarImage: null,
    ownershipDocuments: [],
  },
  tower: {
    totalFloors: null,
    serviceFloors: null,
    unitsCount: null,
    usageType: "",
    otherUsageType: "",
    structuralSystem: "",
    collapsedFloors: null,
    partialCollapses: null,
    criticalColumnDamage: false,
    criticalShearWallDamage: false,
    projectilePenetrations: null,
    elevatorsDown: false,
    floorNumber: null,
    fireSystemDamaged: false,
    mainElectricRoom: false,
    roofTanksDamaged: false,
    unusableFloors: null,
    structuralDamagePercent: null,
    architecturalDamagePercent: null,
    servicesDamagePercent: null,
    engineerRecommendation: "",
    groundFloorArea: null,
    commonFloorArea: null,
    isHabitable: false,
    damageType: "",
    damageTypes: [],
    propertyType: "",
    propertyOwnerName: "",
    beforeWarImage: null,
    afterWarImage: null,
    ownershipDocuments: [],
    criticalRoofBelts: false,
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
    damagePercentage: null,
    additionalNotes: "",
    propertyArea: null,
    isHabitable: false,
    damageType: "",
    damageTypes: [],
    propertyType: "",
    propertyOwnerName: "",
    beforeWarImage: null,
    afterWarImage: null,
    ownershipDocuments: [],
  },
  additionalBuildings: {
    roomType: "",
    structureType: "",
    roofCollapse: false,
    wallBreak: false,
    doorDamage: false,
    waterNetworkDamage: false,
    damagePercentage: null,
    additionalNotes: "",
    damageType: "",
    damageTypes: [],
    isHabitable: false,
    propertyArea: null,
    propertyType: "",
    propertyOwnerName: "",
    beforeWarImage: null,
    afterWarImage: null,
    ownershipDocuments: [],
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
  dispatch(setLoading(true));
  try {
    dispatch(setBuildingType(buildingType));
    dispatch(actionCreator(data));
    console.log("buildingType in handleSave", buildingType);
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
