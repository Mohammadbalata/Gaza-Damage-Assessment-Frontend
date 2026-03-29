import { useLocation, useNavigate } from "react-router-dom";
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
  CircularProgress,
} from "@mui/material";
import { Login as LoginIcon, ArrowBack } from "@mui/icons-material";
import LanguageToggle from "../components/LanguageToggle";
import AuthComp from "./AuthComp";
import { IAuthState } from "../interfaces/store/IAuthState";
import { motion } from "motion/react";

export interface FormDataCustom extends IAuthState {}

const SignInPasswordPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const national_id = query.get("id") || "";
  
  const { t, language } = useLanguage();
  const dispatch = useAppDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormDataCustom>();
  const { error, loading } = useAppSelector((state) => state.auth);

  if (!national_id) {
    navigate(ROUTES.SIGNIN);
    return null;
  }

  const onSubmit = (data: FormDataCustom) => {
    dispatch(signIn({ national_id: national_id, password: data.password }))
      .unwrap()
      .then((data) => {
        localStorage.setItem("citizenInfo", JSON.stringify(data.citizenInfo));
        navigate(ROUTES.HOME);
      })
      .catch((error) => {
        dispatch(setError(error));
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
          {/* National ID Display (Read-only) */}
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
              fontWeight={600}
            >
              {t("auth.nationalId")}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              {national_id}
            </Typography>
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box>
              <Typography
                variant="body2"
                color="primary.light"
                sx={{ mb: 1 }}
                fontWeight={600}
              >
                {t("auth.password")}
              </Typography>
              <FormInput
                id="password"
                type="password"
                placeholder={t("auth.passwordPlaceholder")}
                register={register}
                validation={{
                  required: t("common.required"),
                }}
                errors={errors}
                setPassword={null}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Typography
                variant="body2"
                color="primary.light"
                onClick={() => {
                  navigate(ROUTES.CITIZEN_FORGOT_PASSWORD);
                }}
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {t("auth.forgotPassword")}
              </Typography>
            </Box>
          </motion.div>

          {/* Action Buttons */}
          <Stack direction="column" spacing={2} useFlexGap={true}>
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
              {loading ? "" : t("common.signIn")}
            </Button>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => {
                dispatch(setError(""));
                navigate(ROUTES.SIGNIN);
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
              {t("common.back")}
            </Button>
          </Stack>
        </Stack>
      </form>
      <LanguageToggle />
    </AuthComp>
  );
};

export default SignInPasswordPage;
