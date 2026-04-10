import { useForm } from "react-hook-form";
import { useLanguage } from "../../contexts/LanguageContext";
import { validatePassword } from "../../utils/validatePassword";
import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Fade,
  FormControl,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockReset as LockResetIcon,
  ArrowBack,
  Save as SaveIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/Routes";
import { useSnackbar } from "notistack";
import { usePost } from "../../hooks/api/useApi";
import LanguageToggle from "../../components/LanguageToggle";

interface ResetPasswordForm {
  current_password: string;
  password: string;
  password_confirmation: string;
}

const ChangePasswordPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const password = watch("password");

  const { loading, execute } = usePost("/password/change", {
    onSuccess: () => {
      enqueueSnackbar(t("citizen.passwordChangedSuccess"), {
        variant: "success",
      });
      navigate(ROUTES.SETTINGS);
    },
    onError: (err) => {
      enqueueSnackbar(err, { variant: "error" });
    },
  });

  const onSubmit = (data: ResetPasswordForm) => {
    execute({
      current_password: data.current_password,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    enqueueSnackbar(t("common.copied"), { variant: "success" });
  };

  return (
    <Fade in={true} timeout={500}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #8184e3 0%, #410ddf 100%)",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px -10px rgba(237, 108, 2, 0.4)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: language === "ar" ? "auto" : -50,
              left: language === "ar" ? -50 : "auto",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <Stack
            useFlexGap={true}
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            spacing={2}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LockResetIcon sx={{ fontSize: 40 }} />
            </Box>
            <Box
              sx={{
                textAlign: {
                  xs: "center",
                  md: language === "ar" ? "right" : "left",
                },
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {t("citizen.resetPassword")}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {t("citizen.resetPasswordDesc")}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Form Section */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={4}>
              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.current_password}
              >
                <OutlinedInput
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder={t("citizen.currentPassword")}
                  {...register("current_password", {
                    required: t("validation.required"),
                  })}
                  endAdornment={
                    <InputAdornment position="end">
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          onClick={() =>
                            handleCopy(getValues("current_password"))
                          }
                          edge="end"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          edge="end"
                        >
                          {showCurrentPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </Stack>
                    </InputAdornment>
                  }
                />

                {errors.current_password && (
                  <FormHelperText>
                    {errors.current_password.message}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.password}
              >
                <OutlinedInput
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder={t("citizen.newPassword")}
                  {...register("password", {
                    validate: validatePassword(t),
                  })}
                  endAdornment={
                    <InputAdornment position="end">
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          onClick={() => handleCopy(getValues("password"))}
                          edge="end"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </Stack>
                    </InputAdornment>
                  }
                />
                {errors.password && (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                )}
              </FormControl>

              <FormControl
                fullWidth
                variant="outlined"
                error={!!errors.password_confirmation}
              >
                <OutlinedInput
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("citizen.confirmPassword")}
                  {...register("password_confirmation", {
                    required: t("validation.required"),
                    validate: (value) =>
                      value === password || t("validation.passwordMismatch"),
                  })}
                  endAdornment={
                    <InputAdornment position="end">
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          onClick={() =>
                            handleCopy(getValues("password_confirmation"))
                          }
                          edge="end"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </Stack>
                    </InputAdornment>
                  }
                />
                {errors.password_confirmation && (
                  <FormHelperText>
                    {errors.password_confirmation.message}
                  </FormHelperText>
                )}
              </FormControl>

              <Stack
                direction={{ xs: "column-reverse", sm: "row" }}
                spacing={2}
                pt={2}
                useFlexGap={true}
              >
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={
                    language === "ar" ? (
                      <ArrowBack sx={{ mx: 1, transform: "rotate(180deg)" }} />
                    ) : (
                      <ArrowBack sx={{ mx: 1 }} />
                    )
                  }
                  onClick={() => navigate(ROUTES.SETTINGS)}
                  sx={{ py: 1.5 }}
                >
                  {t("common.back")}
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress
                        sx={{ mx: 1 }}
                        size={20}
                        color="inherit"
                      />
                    ) : (
                      <SaveIcon sx={{ mx: 1 }} />
                    )
                  }
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(237, 108, 2, 0.3)",
                    bgcolor: "#410ddf",
                  }}
                >
                  {loading ? t("common.loading") : t("common.save")}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
        <LanguageToggle />
      </Container>
    </Fade>
  );
};

export default ChangePasswordPage;
