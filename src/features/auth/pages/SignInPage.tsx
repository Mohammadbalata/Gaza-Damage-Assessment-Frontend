import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "../../../app/providers/LanguageContext";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/redux";
import { setError, signUp } from "../../../app/store/slices/authSlice";
import { useForm } from "react-hook-form";
import { ROUTES } from "../../../app/router/Routes";
import FormInput from "../../../shared/ui/FormInput";
import {
  Box,
  Button,
  Stack,
  Typography,
  Alert,
  // Divider,
  CircularProgress,
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import LanguageToggle from "../../../shared/ui/LanguageToggle";
import { API } from "../../../shared/constants/ApiRoutes";
import { useState } from "react";
import AuthComp from "./AuthComp";
import { IAuthState } from "../../../shared/types/store/IAuthState";

export interface FormDataCustom extends IAuthState {}

const LoginPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const dispatch = useAppDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormDataCustom>();
  const { error } = useAppSelector((state) => state.auth);

  const [checkingId, setCheckingId] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate(ROUTES.HOME);
    }
  }, [token, navigate]);

  const onSubmit = async (data: FormDataCustom) => {
    setCheckingId(true);
    dispatch(setError(""));

    try {
      // Use signUp thunk to verify ID - this will automatically save questions to state if returned
      const action = await dispatch(
        signUp({
          national_id: data.national_id,
          password: "",
          pathSignUp: `${API.citizen.auth.verifyId}`,
        }),
      );

      if (signUp.rejected.match(action)) {
        throw { response: { data: { message: action.payload }, status: 400 } };
      }

      const resData = (action.payload as any).data;
      console.log("VerifyId Full Response Data:", resData);
      const status = resData?.verification_status;
      const questions = resData?.questions || [];
      const isActuallyRegistered =
        status === "VERIFIED" || status === "REGISTERED";

      console.log("VerifyId Processed Data:", {
        status,
        questionsCount: questions.length,
        isActuallyRegistered,
      });

      // Branching logic
      if (isActuallyRegistered) {
        // User has a password/fully registered
        navigate(`${ROUTES.SIGNIN_PASSWORD}?id=${data.national_id}`);
      } else if (questions && questions.length > 0) {
        // New user needs to answer questions - questions are already in store!
        navigate(`${ROUTES.VERIFICATION_QUESTIONS}?id=${data.national_id}`);
      } else if (status === "QUESTIONS_VERIFIED") {
        // Questions answered, but no password yet
        navigate(`${ROUTES.PASSWORD_DISPLAY}?id=${data.national_id}`);
      } else if (status === "NATIONAL_ID_VERIFIED" || !status) {
        // ID verified but questions not yet fetched or answered
        navigate(`${ROUTES.VERIFICATION_QUESTIONS}?id=${data.national_id}`);
      } else {
        // Fallback
        navigate(`${ROUTES.SIGNIN_PASSWORD}?id=${data.national_id}`);
      }
    } catch (err: any) {
      console.log(
        "Verify error details:",
        err.response?.status,
        err.response?.data,
      );

      const resData = err.response?.data?.data || err.response?.data;
      const errorMessage = resData?.message || "";
      const errorStatus = err.response?.status;

      // If the error explicitly says they exist/are registered
      const isAlreadyRegistered =
        errorStatus === 400 ||
        errorStatus === 409 ||
        errorStatus === 422 ||
        errorMessage.includes("registered") ||
        errorMessage.includes("exists") ||
        errorMessage.includes("مسجل") ||
        errorMessage.includes("موجود");

      if (isAlreadyRegistered) {
        navigate(`${ROUTES.SIGNIN_PASSWORD}?id=${data.national_id}`);
        dispatch(setError(""));
      } else {
        dispatch(setError(errorMessage || t("common.error")));
      }
    } finally {
      setCheckingId(false);
    }
  };

  return (
    <AuthComp title={t("common.signIn")}>
      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            "& .MuiAlert-icon": {
              alignItems: "center",
            },
          }}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {/* Instructions */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "primary.light",
              border: "1px solid",
              borderColor: "primary.main",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="white">
              {language === "ar"
                ? "أدخل رقمك الوطني لتسجيل الدخول أو إنشاء حساب جديد"
                : "Enter your National ID to login or create a new account"}
            </Typography>
          </Box>

          {/* National ID Field */}
          <Box>
            <Typography
              variant="body2"
              color="primary.light"
              sx={{ mb: 1 }}
              fontWeight={600}
            >
              {t("auth.nationalId")}
            </Typography>

            <FormInput
              id="national_id"
              type="text"
              placeholder={t("auth.nationalIdPlaceholder")}
              register={register}
              errors={errors}
              maxLength={9}
              validation={{
                required: t("common.required"),
                pattern: {
                  value: /^\d{9}$/,
                  message: t("auth.nationalIdError"),
                },
              }}
              isNationalId={true}
            />
          </Box>

          {/* Action Buttons */}
          <Stack direction="column" spacing={2} useFlexGap={true}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={checkingId}
              endIcon={
                checkingId ? (
                  <CircularProgress sx={{ ml: 1 }} size={20} color="inherit" />
                ) : (
                  <ArrowForward
                    sx={{
                      transform: language === "ar" ? "rotate(180deg)" : "none",
                      mr: language === "ar" ? 1 : 0,
                    }}
                  />
                )
              }
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                },
              }}
            >
              {checkingId ? "" : t("common.next")}
            </Button>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => {
                dispatch(setError(""));
                navigate("/");
              }}
              startIcon={
                <ArrowBack
                  sx={{
                    transform: language === "ar" ? "rotate(180deg)" : "none",
                    ml: language === "ar" ? 1 : 0,
                  }}
                />
              }
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              {t("notFound.backToHome")}
            </Button>
          </Stack>
        </Stack>
      </form>
      <LanguageToggle />
    </AuthComp>
  );
};

export default LoginPage;
