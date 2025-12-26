import React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  SxProps,
  Theme,
} from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext";
import Logo from "../../src/assets/logo.jpg";

interface AuthCompProps {
  title?: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * Enhanced Authentication Component Wrapper
 * مكون غلاف المصادقة المحسن
 *
 * Provides consistent layout for Sign In and Sign Up pages
 */
const AuthComp: React.FC<AuthCompProps> = ({ title, children }) => {
  const { t, language } = useLanguage();

  const displayTitle = title ? t("common.signIn") : t("auth.nationalId");

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: { xs: 2, md: 4 },
        mt: 10,
      }}
    >
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
        {/* Gradient Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            color: "white",
            p: 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <Box
            sx={{
              position: "absolute",
              top: -30,
              right: language === "ar" ? "auto" : -30,
              left: language === "ar" ? -30 : "auto",
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
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
              background: "rgba(255,255,255,0.08)",
            }}
          />

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ position: "relative", zIndex: 1 }}
          >
            <img src={Logo} alt="Logo" style={{ width: 50, height: 50 }} />

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, mr: 1 }}>
                {displayTitle}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mr: 1 }}>
                {t("app.subtitle")}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Form Content */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>{children}</Box>
      </Paper>

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

export default AuthComp;
