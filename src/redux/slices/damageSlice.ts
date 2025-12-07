// import { createSlice } from "@reduxjs/toolkit";
// import { IDamageAssessmentState } from "../../interfaces/store/IDamageAssessmentState";
// import { AppDispatch } from "../store";

// const initialState: IDamageAssessmentState = {
//   buildingType: "",
//   IndependentBuilding: {
//     numberOfFloors: 0,
//     floorArea: 0,
//     roofType: "",
//     wallType: "",
//     buildingAge: 0,
//     damagePercentage: 0,
//     habitability: "",
//     damageType: "",
//     additionalNotes: "",
//   },

//   ApartmentInsideBuilding: {
//     floorNumber: 0,
//     apartmentNumber: "",
//     apartmentArea: 0,
//     roomsCount: 0,
//     wallCracks: "",
//     doorsDamage: "",
//     windowsDamage: "",
//     floorDamage: "",
//     ceilingDamage: "",
//     kitchenDamage: "",
//     bathroomDamage: "",
//     electricalDamage: "",
//     mainBuildingDamage: "",
//     damagePercentage: 0,
//     habitability: "",
//     additionalNotes: "",
//   },
//   ResidentialBuilding: {
//     floorsCount: 0,
//     apartmentsPerFloor: 0,
//     usageType: "",
//     structureType: "",
//     columnsCondition: "",
//     beamsCondition: "",
//     externalWalls: "",
//     ceilingDamage: "",
//     buildingFacade: "",
//     entrancesStairs: "",
//     elevators: "",
//     electricalNetwork: "",
//     waterTanks: "",
//     sewageNetwork: "",
//     fireSystems: "",
//     mostDamagedFloors: "",
//     damagePercentage: 0,
//     usageFeasibility: "",
//     additionalNotes: "",
//   },
//   tower: {
//     totalFloors: 0,
//     serviceFloors: 0,
//     unitsCount: 0,
//     usageType: "", // residential - commercial - mixed
//     structuralSystem: "", // columns/shear walls
//     collapsedFloors: 0,
//     partialCollapses: 0,
//     criticalColumnDamage: false,
//     criticalShearWallDamage: false,
//     projectilePenetrations: 0,
//     elevatorsDown: false,
//     floorNumber: 0,
//     fireSystemDamaged: false,
//     mainElectricRoom: false,
//     roofTanksDamaged: false,
//     unusableFloors: 0,
//     structuralDamagePercent: 0,
//     architecturalDamagePercent: 0,
//     servicesDamagePercent: 0,
//     engineerRecommendation: "",
//   },
//   compHouse: {
//     unitType: "",
//     directHitCollapse: false,
//     roofHoles: false,
//     minorCracks: false,
//     doorsWindowsDamage: false,
//     electricalDamage: false,
//     waterLeak: false,
//     habitability: "",
//     damagePercentage: 0,
//     additionalNotes: "",
//   },
//   additionalBuildings: {
//     roomType: "",
//     structureType: "",
//     roofCollapse: false,
//     wallBreak: false,
//     doorDamage: false,
//     waterNetworkDamage: false,
//     damagePercentage: 0,
//     additionalNotes: "",
//   },
//   loading: false,
//   error: null,
// };

// export const damageAssessmentSlice = createSlice({
//   name: "damageAssessment",
//   initialState,
//   reducers: {
//     resetIndependentBuilding: (state, action) => {
//       state.IndependentBuilding = action.payload;
//     },
//     resetApartmentInsideBuilding: (state, action) => {
//       state.ApartmentInsideBuilding = action.payload;
//     },
//     resetResidentialBuilding: (state, action) => {
//       state.ResidentialBuilding = action.payload;
//     },
//     saveTowerData: (state, action) => {
//       state.tower = action.payload;
//     },
//     resetCompHouse: (state, action) => {
//       state.compHouse = action.payload;
//     },
//     resetAdditionalBuildings: (state, action) => {
//       state.additionalBuildings = action.payload;
//     },

//     resetAllBuildings: (state) => {
//       state.IndependentBuilding = initialState.IndependentBuilding;
//       state.ApartmentInsideBuilding = initialState.ApartmentInsideBuilding;
//       state.ResidentialBuilding = initialState.ResidentialBuilding;
//       state.tower = initialState.tower;
//       state.compHouse = initialState.compHouse;
//       state.additionalBuildings = initialState.additionalBuildings;
//     },

//     setLoading: (state, action) => {
//       state.loading = action.payload;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//     },
//     setBuildingType: (state, action) => {
//       state.buildingType = action.payload;
//     },
//   },
// });

// export const {
//   resetIndependentBuilding,
//   resetApartmentInsideBuilding,
//   resetResidentialBuilding,
//   saveTowerData,
//   resetCompHouse,
//   resetAdditionalBuildings,
//   resetAllBuildings,
//   setLoading,
//   setError,
//   setBuildingType,
// } = damageAssessmentSlice.actions;

// export const saveIndependentBuilding =
//   (data: IDamageAssessmentState) => (dispatch: AppDispatch) => {
//     dispatch(setLoading(true));
//     try {
//       dispatch(resetIndependentBuilding(data.IndependentBuilding));
//     } catch (err) {
//       dispatch(setError("Failed to saveIndependentBuilding damage"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

// export const saveApartmentInsideBuilding =
//   (data: IDamageAssessmentState) => (dispatch: AppDispatch) => {
//     dispatch(setLoading(true));
//     try {
//       dispatch(resetApartmentInsideBuilding(data.ApartmentInsideBuilding));
//     } catch (err) {
//       dispatch(setError("Failed to saveApartmentInsideBuilding damage"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };
// export const saveResidentialBuilding =
//   (data: IDamageAssessmentState) => (dispatch: AppDispatch) => {
//     dispatch(setLoading(true));
//     try {
//       dispatch(resetResidentialBuilding(data.ResidentialBuilding));
//     } catch (err) {
//       dispatch(setError("Failed to saveResidentialBuilding damage"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

// export const saveTower =
//   (data: IDamageAssessmentState) => (dispatch: AppDispatch) => {
//     dispatch(setLoading(true));
//     try {
//       dispatch(saveTowerData(data.tower));
//       console.log("Tower Saved:", data);
//     } catch (err) {
//       dispatch(setError("Failed to save tower data"));
//     }
//   };

// export const saveCompHouse =
//   (data: IDamageAssessmentState) => (dispatch: AppDispatch) => {
//     dispatch(setLoading(true));
//     try {
//       dispatch(resetCompHouse(data.compHouse));
//     } catch (err) {
//       dispatch(setError("Failed to saveResidentialBuilding damage"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

// export const saveAdditionalBuildings =
//   (data: IDamageAssessmentState) => (dispatch: AppDispatch) => {
//     dispatch(setLoading(true));
//     try {
//       dispatch(resetAdditionalBuildings(data.additionalBuildings));
//     } catch (err) {
//       dispatch(setError("Failed to saveResidentialBuilding damage"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };
// export default damageAssessmentSlice.reducer;

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
    dispatch(actionCreator(data));
    const res = await axiosClient.post(
      "https://backend-5549.onrender.com/applications/add-extra-data",
      {
        extraData: JSON.stringify({ buildingType: buildingType, data: data }),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(JSON.parse(res.data.data.extraData));
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
