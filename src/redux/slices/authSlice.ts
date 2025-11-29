import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IAuthState } from "../../interfaces/store/IAuthState";

const initialState: IAuthState = {
  nationalId: 123456789,
  password: '11223344',
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
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
      state.nationalId = action.payload.nationalId;
      state.password = action.payload.password
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

//--- sign in dispatch ---//
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    payload: { nationalId: number; password: string },
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
  'auth/signUp',
  async (
    payload: { nationalId: number; password:string },
    { rejectWithValue }
  ) => {
    try {
      // TODO: replace with API call
      return payload // mock success
    } catch (err: any) {
      return rejectWithValue(err.message || 'Sign up failed')
    }
  }
)

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



