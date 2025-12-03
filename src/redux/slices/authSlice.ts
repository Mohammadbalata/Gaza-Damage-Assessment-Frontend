import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IAuthState } from "../../interfaces/store/IAuthState";
import { axiosClient } from "../../api/baseUrl";

const initialState: IAuthState = {
  nationalId: "",
  password: "",
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  messageSuccess: "",
  verificationQuestion: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //---- sign in ----//
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.nationalId = action.payload.nationalId;
      state.password = action.payload.password;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });
    //---- sign up ----//
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      state.nationalId = action.payload.payload.nationalId;
      state.password = action.payload.payload.password;
      state.isAuthenticated = action.payload.data.success;
      state.messageSuccess = action.payload.data.message;
      state.verificationQuestion = action.payload.data.data.questions;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });
  },
});

//--- sign in dispatch ---//
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    payload: { nationalId: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // TODO: replace with API call
      // Simulate checking credentials
      if (payload.password.length < 3) {
        throw new Error("Invalid credentials");
      }
      return {
        nationalId: payload.nationalId,
        password: payload.password,
        name: "User Name Example",
      };
    } catch (err: any) {
      return rejectWithValue(err.message || "Login failed");
    }
  }
);

//---sign up dispatch ---//

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    payload: { nationalId: string | null; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosClient.post("/auth/verify-id", {
        nationalId: payload.nationalId,
      });

      console.log(res.data);
      return { payload, data: res.data }; // mock success
    } catch (err: any) {
      console.log(err);
      return rejectWithValue(err.response.data.message || "Sign up failed");
    }
  }
);

export const {} = authSlice.actions;
export default authSlice.reducer;

//  logout: (state) => {
//       state.nationalId = null
//       state.password = null
//       state.user = null
//       state.isAuthenticated = false
//       state.loading = false
//       state.error = null
//     },
