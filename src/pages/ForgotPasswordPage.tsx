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
} from "@mui/material";
import { ArrowBack, Send as SendIcon } from "@mui/icons-material";
import { useLanguage } from "../contexts/LanguageContext";
import AuthComp from "./AuthComp";
import FormInput from "../components/FormInput";
import { ROUTES } from "../routes/Routes";

interface FormData {
  email: string;
}

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      enqueueSnackbar(t("auth.resetCodeSent"), { variant: "success" });
      console.log("Reset code sent to:", data.email);
    }, 1500);
  };

  return (
    <AuthComp title={t("auth.forgotPasswordTitle")}>
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {t("auth.forgotPasswordTitle")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t("auth.forgotPasswordDesc")}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
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
    </AuthComp>
  );
};

export default ForgotPasswordPage;
