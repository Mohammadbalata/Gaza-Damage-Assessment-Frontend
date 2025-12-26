import { createSlice, nanoid } from "@reduxjs/toolkit";

// interface Unit {
//   usage: "" | "سكني" | "تجاري" | "خدماتي";
//   activity: string;
// }

// interface MixedUsageState {
//   floors: {
//     ground: boolean;
//     mezzanine: boolean;
//     roof: boolean;
//   };
//   units: {
//     ground: Unit[];
//     mezzanine: Unit[];
//     roof: Unit[];
//   };
// }

const initialState: any = {
  floors: {
    ground: false,
    mezzanine: false,
    roof: false,
  },
  units: {
    ground: [],
    mezzanine: [],
    roof: [],
  },
};

const mixedUsageSlice = createSlice({
  name: "mixedUsage",
  initialState,
  reducers: {
    setFloor(state, action) {
      const { floor, value } = action.payload;
      state.floors[floor] = value;
    },
    addUnit(state, action) {
      state.units[action.payload].push({
        id: nanoid(),
        usage: "",
        activity: "",
      });
    },
    updateUnit(state, action) {
      const { floor, id, field, value } = action.payload;
      state.units[floor][id][field] = value;
    },
    removeUnit(state, action) {
      const { floor, index } = action.payload;
      state.units[floor].splice(index, 1);
    },
    resetMixedUsage() {
      return initialState;
    },
  },
});

export const { setFloor, addUnit, updateUnit, removeUnit, resetMixedUsage } =
  mixedUsageSlice.actions;

export default mixedUsageSlice.reducer;
