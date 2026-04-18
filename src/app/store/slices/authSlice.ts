import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IAuthState } from "../../../shared/types/store/IAuthState";
import { axiosClient } from "../../../shared/api/baseUrl";
import { API } from "../../../shared/constants/ApiRoutes";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("citizen_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    return null;
  }
};

const storedUser = getStoredUser();

const initialState: IAuthState = {
  national_id: storedUser?.national_id || "",
  password: storedUser?.password || "",
  user: storedUser || null,
  isAuthenticated: !!storedUser,
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
  trackingNumber: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setNationalId: (state, action) => {
      state.national_id = action.payload;
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
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.national_id = "";
      state.password = "";
      state.citizenInfo = {};
      localStorage.removeItem("citizen_user");
      localStorage.removeItem("token");
      localStorage.removeItem("citizenInfo");
    },
    setCitizenInfo: (state, action) => {
      state.citizenInfo = action.payload;
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
      state.national_id = action.payload.national_id;
      state.password = action.payload.password;
      state.citizenInfo = action.payload.citizenInfo;
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
      state.national_id = action.payload.payload.national_id;
      state.password = action.payload.payload.password;
      state.isAuthenticated = action.payload.data.success;
      state.messageSuccess = action.payload.data.message;
      state.verificationQuestion = action.payload.data.questions;
      state.familyMembersNumber = action.payload.data.familyMembersNumber;
      // If signup returns user info, update it
      if (action.payload.citizenInfo) {
        state.citizenInfo = action.payload.citizenInfo;
      }
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });
  },
});

//--- sign in dispatch ---//
// test
export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    payload: { national_id: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await axiosClient.post(`${API.citizen.auth.login}`, {
        national_id: payload.national_id,
        password: payload.password,
      });
      console.log("citizen", res.data.citizen);
      // console.log("API Response:", res.data.data.user.application.damage_details);
      // const damage_details = res.data?.user?.application?.damage_details;
      // const locations = res.data.user.application?.locations;
      const token = res.data?.token;

      // Extract and save citizenInfo
      const citizenInfo = res.data.citizen;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("citizenInfo", JSON.stringify(citizenInfo));
      }

      if (payload.password.length < 3) {
        throw new Error("Invalid credentials");
      }

      const userProfile = {
        citizenData: res?.data,
        national_id: payload.national_id,
        password: payload.password,
        name: res.data?.data?.name || "User",
        first_name: res.data?.data?.user?.first_name || "User",
        father_name: res.data?.data?.user?.father_name || "User",
        family_name: res.data?.data?.user?.family_name || "User",
        citizenInfo: citizenInfo, // Include in payload for reducer
      };

      // localStorage.setItem("citizen_user", JSON.stringify(userProfile));

      return userProfile;
    } catch (error: any) {
      console.log(error);
      const lang = localStorage.getItem("language") || "ar";
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
  async (payload: IAuthState, { rejectWithValue }) => {
    if (payload.pathSignUp === API.citizen.auth.completeSignup) {
      try {
        const res = await axiosClient.post(
          `${payload.pathSignUp}`,
          payload.formData,
        );
        const token = res.data?.token;

        // Try to extract citizenInfo from response if available
        let citizenInfo = null;
        if (res.data?.citizen) {
          citizenInfo = res.data.citizen;
          localStorage.setItem("citizenInfo", JSON?.stringify(citizenInfo));
        }

        // console.log(res.data);
        return { payload, data: res.data, token, citizenInfo };
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

        // Only include other fields if they are actually present (for real registration)
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
        console.log(res.data);
        return { payload, data: res.data, token };
      } catch (err: any) {
        console.log("err", err);
        return rejectWithValue(err.response?.data?.message || "Sign up failed");
      }
    }
  },
);
// 41003193
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
  setTrackingNumber,
} = authSlice.actions;
export default authSlice.reducer;
