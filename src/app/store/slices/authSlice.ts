import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IAuthState } from "../../../shared/types/store/IAuthState";
import { axiosClient } from "../../../shared/api/api";
import { API } from "../../../shared/constants/ApiRoutes";
import {
  clearCitizenSession,
  getLanguage,
  setCitizenInfo as setCitizenInfoStorage,
  setToken,
} from "../../../shared/utils/storage";
import { setCitizenInfo as setCitizenInfoAction } from "./citizenSlice";

const initialState: IAuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  messageSuccess: "",
  verificationQuestion: [],
  trackingNumber: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      clearCitizenSession();
      // The citizen slice wipes its data in response to this action via
      // extraReducers matching the "auth/logout" action type.
    },
    setTrackingNumber: (state, action) => {
      state.trackingNumber = action.payload;
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
      state.isAuthenticated = action.payload.data.success;
      state.messageSuccess = action.payload.data.message;
      state.verificationQuestion = action.payload.data.questions;
      state.familyMembersNumber = action.payload.data.familyMembersNumber;
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
    payload: { national_id: string; password: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosClient.post(`${API.citizen.auth.login}`, {
        national_id: payload.national_id,
        password: payload.password,
      });

      const token = res.data?.token;
      const citizenInfo = res.data.citizen;

      if (token) {
        setToken(token);
        setCitizenInfoStorage(citizenInfo);
        dispatch(setCitizenInfoAction(citizenInfo));
      }

      if (payload.password.length < 3) {
        throw new Error("Invalid credentials");
      }

      // Non-sensitive profile data only — no password, no national_id.
      return {
        citizenData: res?.data,
        name: res.data?.data?.name || "User",
        first_name: res.data?.data?.user?.first_name || "User",
        father_name: res.data?.data?.user?.father_name || "User",
        family_name: res.data?.data?.user?.family_name || "User",
      };
    } catch (error: any) {
      console.log(error);
      const lang = getLanguage() || "ar";
      if (error.response?.data?.message === "Invalid credentials") {
        if (lang == "ar") {
          return rejectWithValue("كلمة المرور غير صحيحة");
        } else {
          return rejectWithValue(
            error.response?.data?.message || "لا يوجد اتصال بالانترنت",
          );
        }
      }
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

//---sign up dispatch ---//
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (payload: IAuthState, { rejectWithValue, dispatch }) => {
    if (payload.pathSignUp === API.citizen.auth.completeSignup) {
      try {
        const res = await axiosClient.post(
          `${payload.pathSignUp}`,
          payload.formData,
        );
        const token = res.data?.token;

        if (res.data?.citizen) {
          setCitizenInfoStorage(res.data.citizen);
          dispatch(setCitizenInfoAction(res.data.citizen));
        }

        return { payload, data: res.data, token };
      } catch (err: any) {
        console.log("err", err);
        return rejectWithValue(
          err.response?.data?.errors ||
            err.response?.data?.message ||
            "Sign up failed",
        );
      }
    } else {
      try {
        const requestBody: any = { national_id: payload.national_id };

        if (payload.password) requestBody.password = payload.password;
        if (payload.firstName) requestBody.firstName = payload.firstName;
        if (payload.fatherName) requestBody.fatherName = payload.fatherName;
        if (payload.grandfatherName)
          requestBody.grandfatherName = payload.grandfatherName;
        if (payload.familyName) requestBody.familyName = payload.familyName;
        if (payload.email) requestBody.email = payload.email;
        if (payload.familyMembersNumber)
          requestBody.familyMembersNumber = payload.familyMembersNumber;
        if (payload.phoneNumber) requestBody.phoneNumber = payload.phoneNumber;
        if (payload.whatsappNumber)
          requestBody.whatsappNumber = payload.whatsappNumber;

        const res = await axiosClient.post(
          `${payload.pathSignUp}`,
          requestBody,
        );
        const token = res.data?.token;
        return { payload, data: res.data, token };
      } catch (err: any) {
        console.log("err", err);
        return rejectWithValue(err.response?.data?.message || "Sign up failed");
      }
    }
  },
);

export const { setError, logout, setTrackingNumber } = authSlice.actions;
export default authSlice.reducer;
