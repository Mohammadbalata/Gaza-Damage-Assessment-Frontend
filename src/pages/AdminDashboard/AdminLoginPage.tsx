import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AdminAuthContext";
import { ROUTES } from "../../routes/Routes";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  TextField,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  AdminPanelSettings as AdminIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";
import BackButton from "../../components/Shared/BackButton";

interface FormData {
  email: string;
  password: string;
}

/**
 * Admin Login Page
 * صفحة تسجيل دخول المسؤول
 */
const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, login } = useAuth();
  const { t, language } = useLanguage();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const success = await login(data);
    if (success) {
      navigate(ROUTES.ADMIN_DASHBOARD);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Main Card */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        {/* Header - Dark theme for admin distinction */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #37474f 0%, #546e7a 100%)",
            color: "white",
            p: 4,
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative elements */}
          <Box
            sx={{
              position: "absolute",
              top: -30,
              right: language === "ar" ? "auto" : -30,
              left: language === "ar" ? -30 : "auto",
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -20,
              right: language === "ar" ? -20 : "auto",
              left: language === "ar" ? "auto" : -20,
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.03)",
            }}
          />

          <Stack
            spacing={2}
            alignItems="center"
            sx={{ position: "relative", zIndex: 1 }}
          >
            {/* Admin Icon */}
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.1)",
                border: "2px solid rgba(255,255,255,0.2)",
                display: "inline-flex",
              }}
            >
              <AdminIcon sx={{ fontSize: 40 }} />
            </Box>

            {/* Title */}
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {t("auth.adminLogin")}
            </Typography>

            {/* Subtitle */}
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {language === "ar"
                ? "تسجيل الدخول إلى لوحة التحكم الإدارية"
                : "Sign in to the admin dashboard"}
            </Typography>
          </Stack>
        </Box>

        {/* Form Content */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>
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
              {/* Email Field */}
              <TextField
                fullWidth
                label={t("auth.email")}
                type="email"
                placeholder="admin@gaza.gov.ps"
                {...register("email", {
                  required: t("common.required"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message:
                      language === "ar"
                        ? "صيغة البريد الإلكتروني غير صحيحة"
                        : "Invalid email format",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              {/* Password Field */}
              <TextField
                fullWidth
                label={t("auth.password")}
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: t("common.required"),
                  minLength: {
                    value: 8,
                    message:
                      language === "ar"
                        ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
                        : "Password must be at least 8 characters",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
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

              {/* Submit Button */}
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
                    <LoginIcon />
                  )
                }
                sx={{
                  gap: 1,
                  py: 1.5,
                  mt: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  bgcolor: "grey.800",
                  boxShadow: "0 4px 12px rgba(55, 71, 79, 0.3)",
                  "&:hover": {
                    bgcolor: "grey.900",
                    boxShadow: "0 6px 16px rgba(55, 71, 79, 0.4)",
                  },
                }}
              >
                {loading ? t("common.loading") : t("auth.login")}
              </Button>
            </Stack>
          </form>

          {/* Security Notice */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: "grey.50",
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              textAlign="center"
            >
              {language === "ar"
                ? "🔒 هذه المنطقة مخصصة للمسؤولين المعتمدين فقط"
                : "🔒 This area is restricted to authorized personnel only"}
            </Typography>
          </Box>
        </Box>
      </Paper>
      <BackButton language={language} to="/" />

      {/* Footer Text */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          textAlign: "center",
          mt: 3,
          opacity: 0.7,
        }}
      >
        {language === "ar"
          ? "نظام حصر الأضرار الذاتي - بلدية خان يونس"
          : "Self-Damage Assessment System - Khan Younis Municipality"}
      </Typography>
    </Container>
  );
};

export default AdminLoginPage;
