import {
  ActionCreatorWithPayload,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { IDamageAssessmentState, IFloorsState, IUnitsState } from "../../interfaces/store/IDamageAssessmentState";
import { AppDispatch } from "../store";

const initialState: IDamageAssessmentState = {
  buildingType: "",
  IndependentBuilding: {
    numberOfFloors: null,
    groundFloorArea: null,
    commonFloorArea: null,
    roofType: "",
    wallType: "",
    buildingAge: "",
    damagePercentage: "",
    damageType: "",
    damageTypes: [],
    isHabitable: "",
    additionalNotes: "",
    propertyType: "",
    propertyOwnerName: "",
    before_damage_image: null,
    after_damage_image: null,
    ownership_documents: [],
  },
  ApartmentInsideBuilding: {
    floorNumber: null,
    apartmentNumber: "",
    propertyArea: null,

    propertyType: "",
    propertyOwnerName: "",
    usageType: "",

    mainBuildingDamage: "",
    mainBuildingAge: "",

    damageType: "",
    damageTypes: [],
    damagePercentage: "",

    isHabitable: "",
    additionalNotes: "",

    before_damage_image: null,
    after_damage_image: null,
    ownership_documents: [],
  },

  ResidentialBuilding: {
    floorsCount: null,
    groundFloorArea: null,
    commonFloorArea: null,
    apartmentsPerFloor: null,

    propertyType: "",
    propertyOwnerName: "",
    buildingAge: "",

    usageType: "",
    otherUsageType: "",

    collapsedFloors: null,
    partialCollapses: null,

    criticalColumnDamage: false,
    criticalShearWallDamage: false,
    criticalRoofBelts: false,

    damageType: "",
    damageTypes: [],
    unusableFloors: null,
    damagePercentage: "",

    isHabitable: "",
    additionalNotes: "",

    before_damage_image: null,
    after_damage_image: null,
    ownership_documents: [],
    MixedUsage_floors_ground: false,
    MixedUsage_floors_mezzanine: false,
    MixedUsage_floors_roof: false,
    MixedUsage_units_ground: [],
    MixedUsage_units_mezzanine: [],
    MixedUsage_units_roof: [],
  },

  tower: {
    totalFloors: null,
    groundFloorArea: null,
    commonFloorArea: null,
    unitsCount: null,

    propertyType: "",
    propertyOwnerName: "",
    buildingAge: "",

    usageType: "",
    otherUsageType: "",

    collapsedFloors: null,
    partialCollapses: null,

    criticalColumnDamage: false,
    criticalShearWallDamage: false,
    criticalRoofBelts: false,

    unusableFloors: null,

    damageType: "",
    damageTypes: [],
    damagePercentage: "",

    isHabitable: "",
    additionalNotes: "",

    before_damage_image: null,
    after_damage_image: null,
    ownership_documents: [],
    MixedUsage_floors_ground: false,
    MixedUsage_floors_mezzanine: false,
    MixedUsage_floors_roof: false,
    MixedUsage_units_ground: [],
    MixedUsage_units_mezzanine: [],
    MixedUsage_units_roof: [],
  },

  compHouse: {
    propertyArea: null,

    propertyType: "",
    propertyOwnerName: "",
    buildingAge: "",

    damageType: "",
    damageTypes: [],
    damagePercentage: "",

    isHabitable: "",
    additionalNotes: "",

    before_damage_image: null,
    after_damage_image: null,
    ownership_documents: [],
  },

  additionalBuildings: {
    roomType: "",
    otherRoomType: "",

    propertyArea: null,
    floorsCount: null,
    commonFloorArea: null,

    constructionType: "",

    propertyType: "",
    propertyOwnerName: "",
    buildingAge: "",

    damageType: "",
    damageTypes: [],
    damagePercentage: "",

    isHabitable: "",
    additionalNotes: "",

    before_damage_image: null,
    after_damage_image: null,
    ownership_documents: [],
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
    // console.log(JSON.parse(res.data.data.damage_details));
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
      state.ResidentialBuilding = {
        ...initialState.ResidentialBuilding,
        ...action.payload,
      };
    },
    saveTowerData: (state, action: PayloadAction<any>) => {
      state.tower = {
        ...initialState.tower,
        ...action.payload,
      };
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
    setMixedUsageUnits: (
      state,
      action: PayloadAction<{
        entity: "ResidentialBuilding" | "tower";
        units: IUnitsState;
      }>
    ) => {
      const { entity, units } = action.payload;
      state[entity].MixedUsage_units_ground = units.ground;
      state[entity].MixedUsage_units_mezzanine = units.mezzanine;
      state[entity].MixedUsage_units_roof = units.roof;
    },

    setMixedUsageFloors: (
      state,
      action: PayloadAction<{
        entity: "ResidentialBuilding" | "tower";
        floors: IFloorsState;
      }>
    ) => {
      const { entity, floors } = action.payload;
      state[entity].MixedUsage_floors_ground = floors.ground;
      state[entity].MixedUsage_floors_mezzanine = floors.mezzanine;
      state[entity].MixedUsage_floors_roof = floors.roof;
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
  setMixedUsageFloors,
  setMixedUsageUnits,
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
