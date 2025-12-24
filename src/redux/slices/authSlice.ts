import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IAuthState } from "../../interfaces/store/IAuthState";
import { axiosClient } from "../../api/baseUrl";
import { API } from "../../constants/ApiRoutes";

const initialState: IAuthState = {
  nationalId: "",
  password: "",
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  messageSuccess: "",
  verificationQuestion: [],
  firstName: "",
  fatherName: "",
  grandfatherName: "",
  familyName: "",
  phoneNumber: "",
  email: "",
  whatsappNumber: "",
  citizenInfo: JSON.parse(localStorage.getItem("citizenInfo") || "{}"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setNationalId: (state, action) => {
      state.nationalId = action.payload;
    },
    setFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    setFatherName: (state, action) => {
      state.fatherName = action.payload;
    },
    setGrandfatherName: (state, action) => {
      state.grandfatherName = action.payload;
    },
    setFamilyName: (state, action) => {
      state.familyName = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setCitizenInfo: (state, action) => {
      state.citizenInfo = action.payload;
    },
  },
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
      state.familyMembersNumber = action.payload.data.data.familyMembersNumber;
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
      const res = await axiosClient.post(`${API.citizen.auth.login}`, {
        nationalId: payload.nationalId,
        password: payload.password,
      });
      console.log(res);
      // console.log("API Response:", res.data.data.user.application.extraData);
      const extraData = res.data?.data?.user?.application?.extraData;
      const locations = res.data.data.user.application?.locations;
      const token = res.data?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }
      if (payload.password.length < 3) {
        throw new Error("Invalid credentials");
      }
      return {
        citizenData: res?.data,
        nationalId: payload.nationalId,
        password: payload.password,
        name: res.data?.data?.name || "User",
        extraData,
        locations,
      };
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

//---sign up dispatch ---//

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (payload: IAuthState, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post(`${payload.pathSignUp}`, {
        nationalId: payload.nationalId,
        password: payload.password, // include if backend expects it
        firstName: payload.firstName,
        fatherName: payload.fatherName,
        grandfatherName: payload.grandfatherName,
        familyName: payload.familyName,
        email: payload.email,
        familyMembersNumber: payload.familyMembersNumber,
        phoneNumber: payload.phoneNumber,
        whatsappNumber: payload.whatsappNumber,
      });
      const token = res.data?.data?.token;
      console.log(res.data);
      return { payload, data: res.data, token };
    } catch (err: any) {
      console.log(err);
      return rejectWithValue(err.response?.data?.message || "Sign up failed");
    }
  }
);
// 410031934
export const {
  setError,
  setNationalId,
  setFirstName,
  setFatherName,
  setGrandfatherName,
  setFamilyName,
  setEmail,
  setPhoneNumber,
  setCitizenInfo,
} = authSlice.actions;
export default authSlice.reducer;
