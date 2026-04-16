import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack, Send as SendIcon } from "@mui/icons-material";
import { useLanguage } from "../../../app/providers/LanguageContext";
import AuthComp from "./AuthComp";
import FormInput from "../../../shared/ui/FormInput";
import { ROUTES } from "../../../app/router/Routes";
import { usePost } from "../../../shared/hooks/api/useApi";
import { API } from "../../../shared/constants/ApiRoutes";
import LanguageToggle from "../../../shared/ui/LanguageToggle";

interface FormData {
  email: string;
}

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();
  const [emailSent, setEmailSent] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>();

  const { loading, execute: sendResetEmail } = usePost(
    `${API.citizen.auth.forgotPassword}`,
    {
      onSuccess: () => {
        setEmailSent(true);
        setErrorMessage(null);
        enqueueSnackbar(t("auth.resetEmailSent"), { variant: "success" });
      },
      onError: (err) => {
        console.error(err);
        // Check if error indicates email not found
        if (
          err?.toLowerCase().includes("not found") ||
          err?.toLowerCase().includes("لم يتم العثور")
        ) {
          setErrorMessage(t("auth.emailNotFound"));
        } else {
          setErrorMessage(err || t("common.error"));
        }
      },
    },
  );

  const onSubmit = (data: FormData) => {
    setErrorMessage(null);
    sendResetEmail({ email: data.email });
  };
  console.log(t("auth.forgotPasswordTitle"));
  return (
    <AuthComp title={t("auth.forgotPasswordTitle")} subtitle="ssss">
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {t("auth.forgotPasswordTitle")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("auth.forgotPasswordDesc")}
        </Typography>
      </Box>

      {emailSent ? (
        <Stack spacing={3} alignItems="center">
          <Alert
            severity="success"
            sx={{
              width: "100%",
              borderRadius: 2,
              "& .MuiAlert-message": { width: "100%" },
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              {t("auth.resetCodeSent")}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              {getValues("email")}
            </Typography>
          </Alert>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate(`/${ROUTES.SIGNIN}`)}
            startIcon={
              <ArrowBack
                sx={{
                  transform: language === "ar" ? "rotate(180deg)" : "none",
                  ml: language === "ar" ? 1 : 0,
                }}
              />
            }
            sx={{ fontWeight: 600 }}
          >
            {t("auth.backToLogin")}
          </Button>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {errorMessage && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Box>
              <Typography
                variant="body2"
                color="primary.light"
                sx={{ mb: 1 }}
                fontWeight={600}
              >
                {t("auth.email")}
              </Typography>
              <FormInput
                id="email"
                type="email"
                placeholder={t("form.emailPlaceholder")}
                register={register}
                errors={errors}
                validation={{
                  required: t("common.required"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("form.invalidEmail"),
                  },
                }}
              />
            </Box>

            <Stack spacing={2}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon sx={{ ml: language === "ar" ? 1 : 0 }} />
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
                {loading ? "" : t("auth.sendResetCode")}
              </Button>

              <Button
                variant="text"
                fullWidth
                onClick={() => navigate(`/${ROUTES.SIGNIN}`)}
                startIcon={
                  <ArrowBack
                    sx={{
                      transform: language === "ar" ? "rotate(180deg)" : "none",
                      ml: language === "ar" ? 1 : 0,
                    }}
                  />
                }
                sx={{ fontWeight: 600 }}
              >
                {t("auth.backToLogin")}
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
      <LanguageToggle />
    </AuthComp>
  );
};

export default ForgotPasswordPage;
