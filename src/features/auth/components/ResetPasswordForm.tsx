import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  LinearProgress,
  Fade,
  TextField,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useLanguage } from "../../../app/providers/LanguageContext";
import { usePost } from "../../../shared/hooks/api/useApi";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export interface ResetPasswordFormProps {
  /** API endpoint for reset password */
  apiEndpoint: string;
  /** Path to redirect after successful reset */
  loginRedirectPath: string;
  /** Query param name for token (default: "token") */
  tokenQueryParam?: string;
  /** Optional callback on success */
  onSuccess?: () => void;
  /** Optional callback on error */
  onError?: (error: string) => void;
}

/**
 * Reusable Reset Password Form Component
 * مكون نموذج إعادة تعيين كلمة المرور القابل لإعادة الاستخدام
 *
 * Used by both Citizen and Admin reset password pages
 * Sends token and newPassword as query parameters
 */
const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  apiEndpoint,
  loginRedirectPath,
  tokenQueryParam = "token",
  onSuccess,
  onError,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get(tokenQueryParam);
  const { t, language } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: "",
    color: "error.main",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const newPassword = watch("newPassword", "");

  // Calculate password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength({ score: 0, label: "", color: "error.main" });
      return;
    }

    let score = 0;
    const checks = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    };

    Object.values(checks).forEach((passed) => {
      if (passed) score += 20;
    });

    let label = "";
    let color = "error.main";

    if (score <= 20) {
      label = language === "ar" ? "ضعيفة جداً" : "Very Weak";
      color = "error.main";
    } else if (score <= 40) {
      label = language === "ar" ? "ضعيفة" : "Weak";
      color = "error.light";
    } else if (score <= 60) {
      label = language === "ar" ? "متوسطة" : "Medium";
      color = "warning.main";
    } else if (score <= 80) {
      label = language === "ar" ? "قوية" : "Strong";
      color = "success.light";
    } else {
      label = language === "ar" ? "قوية جداً" : "Very Strong";
      color = "success.main";
    }

    setPasswordStrength({ score, label, color });
  }, [newPassword, language]);

  // Build API endpoint with query params for token and password
  const { loading, execute: resetPassword } = usePost(apiEndpoint, {
    onSuccess: () => {
      setSuccess(true);
      setErrorMessage(null);
      enqueueSnackbar(t("auth.passwordResetSuccess"), { variant: "success" });
      onSuccess?.();
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(loginRedirectPath);
      }, 3000);
    },
    onError: (err) => {
      console.error(err);
      if (
        err?.toLowerCase().includes("invalid") ||
        err?.toLowerCase().includes("expired") ||
        err?.toLowerCase().includes("غير صالح")
      ) {
        setErrorMessage(t("auth.invalidResetToken"));
      } else {
        setErrorMessage(err || t("common.error"));
      }
      onError?.(err || t("common.error"));
    },
  });

  const onSubmit = (data: FormData) => {
    setErrorMessage(null);
    if (!token) {
      setErrorMessage(t("auth.invalidResetToken"));
      return;
    }
    // Send token and newPassword as params (query string will be appended)
    resetPassword(null, {
      params: {
        token,
        newPassword: data.newPassword,
      },
    });
  };

  // Validate token presence - show error state
  if (!token) {
    return (
      <>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {t("auth.invalidResetToken")}
        </Alert>
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate(loginRedirectPath)}
          sx={{ mt: 3, borderRadius: 2, fontWeight: 600 }}
        >
          {t("auth.backToLogin")}
        </Button>
      </>
    );
  }

  return (
    <>
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: success ? "success.light" : "primary.light",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
            transition: "all 0.3s ease",
          }}
        >
          {success ? (
            <CheckCircleIcon sx={{ fontSize: 32, color: "white" }} />
          ) : (
            <LockIcon sx={{ fontSize: 32, color: "white" }} />
          )}
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {success
            ? t("auth.passwordResetSuccess")
            : t("auth.resetPasswordTitle")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {success ? t("auth.redirectingToLogin") : t("auth.enterNewPassword")}
        </Typography>
      </Box>

      {success ? (
        <Fade in={success}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={24} />
            <Typography variant="caption" color="text.secondary">
              {t("auth.redirectingToLogin")}
            </Typography>
          </Stack>
        </Fade>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {errorMessage && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {errorMessage}
              </Alert>
            )}

            {/* New Password */}
            <Box>
              <Typography
                variant="body2"
                color="primary.light"
                sx={{ mb: 1 }}
                fontWeight={600}
              >
                {t("auth.newPassword")}
              </Typography>
              <TextField
                fullWidth
                type={showNewPassword ? "text" : "password"}
                placeholder={t("auth.newPassword")}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                {...register("newPassword", {
                  required: t("common.required"),
                  minLength: {
                    value: 8,
                    message:
                      language === "ar"
                        ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
                        : "Password must be at least 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
                    message: t("auth.passwordRequirements"),
                  },
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                        size="small"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              {/* Password Strength Indicator */}
              {newPassword && (
                <Box sx={{ mt: 1.5 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {t("auth.passwordStrength")}
                    </Typography>
                    <Typography
                      variant="caption"
                      fontWeight="medium"
                      sx={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.score}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: "action.hover",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: passwordStrength.color,
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                      },
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Confirm Password */}
            <Box>
              <Typography
                variant="body2"
                color="primary.light"
                sx={{ mb: 1 }}
                fontWeight={600}
              >
                {t("auth.confirmNewPassword")}
              </Typography>
              <TextField
                fullWidth
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("auth.confirmNewPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: t("common.required"),
                  validate: (value: string) =>
                    value === newPassword ||
                    (language === "ar"
                      ? "كلمات المرور غير متطابقة"
                      : "Passwords do not match"),
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            {/* Password Requirements Hint */}
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="caption" sx={{ mr: 0.5 }}>
                {t("auth.passwordRequirements")}
              </Typography>
            </Alert>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || passwordStrength.score < 80}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <LockIcon sx={{ ml: language === "ar" ? 1 : 0 }} />
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
              {loading ? "" : t("auth.resetPasswordTitle")}
            </Button>
          </Stack>
        </form>
      )}
    </>
  );
};

export default ResetPasswordForm;
