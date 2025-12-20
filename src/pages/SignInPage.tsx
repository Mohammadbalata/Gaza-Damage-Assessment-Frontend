import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setError, signIn } from "../redux/slices/authSlice";
import { useForm } from "react-hook-form";
import { ROUTES } from "../routes/Routes";
import FormInput from "../components/FormInput";
import {
  Box,
  Button,
  Stack,
  Typography,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Login as LoginIcon, ArrowBack } from "@mui/icons-material";
import AuthComp from "./AuthComp";
import { IAuthState } from "../interfaces/store/IAuthState";

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
  const { error, loading } = useAppSelector((state) => state.auth);

  const onSubmit = (data: FormDataCustom) => {
    dispatch(signIn({ nationalId: data.nationalId, password: data.password }))
      .unwrap()
      .then((res) => {
        console.log("success", res);
        const isPrevLocation = res.locations.filter(
          (location: any) => location.type === "before_war"
        );
        const isCurrentLocation = res.locations.filter(
          (location: any) => location.type === "current"
        );
        if (isPrevLocation.length === 0) {
          navigate(ROUTES.PREVIOUS_LOCATION);
        } else if (isCurrentLocation.length === 0) {
          navigate(ROUTES.CURRENT_LOCATION);
        } else {
          navigate(ROUTES.CITIZEN_DASHBOARD);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <AuthComp title="Sign in">
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
          {/* National ID Field */}
          <FormInput
            id="nationalId"
            label={t("auth.nationalId")}
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

          {/* Password Field */}
          <FormInput
            id="password"
            type="password"
            label={t("auth.password")}
            placeholder={t("auth.passwordPlaceholder")}
            register={register}
            validation={{
              required: t("common.required"),
            }}
            errors={errors}
            setPassword={null}
          />

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} useFlexGap={true}>
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
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress sx={{ ml: 1 }} size={20} color="inherit" />
                ) : (
                  <LoginIcon sx={{ ml: language === "ar" ? 1 : 0 }} />
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
              {loading ? t("common.loading") : t("common.signIn")}
            </Button>
          </Stack>

          {/* Divider */}
          <Divider sx={{ my: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t("common.or")}
            </Typography>
          </Divider>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              component="span"
              sx={{
                mr: language === "en" ? 1 : 0,
                ml: language === "ar" ? 1 : 0,
              }}
            >
              {t("common.signUp-qesution")}
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                dispatch(setError(""));
                navigate(`/${ROUTES.SIGNUP}`);
              }}
              sx={{
                fontWeight: 600,
                textDecoration: "underline",
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                },
              }}
            >
              {t("common.signUp")}
            </Button>
          </Box>
        </Stack>
      </form>
    </AuthComp>
  );
};

export default LoginPage;
