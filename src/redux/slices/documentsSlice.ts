import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApplicationData } from "../../interfaces/types";

const initialState: Partial<ApplicationData> = {
  documents: [],
};

export const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setDocuments: (state, action: PayloadAction<File[]>) => {
      state.documents = action.payload;
    },
  },
});

export const { setDocuments } = documentsSlice.actions;
export default documentsSlice.reducer;
