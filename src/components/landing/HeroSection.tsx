import React from "react";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { useLanguage } from "../../contexts/LanguageContext";
import Logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/Routes";
import backgroundPattern from "../../assets/background-pattern.png";

const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        backgroundImage: `url(${backgroundPattern})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        pt: { xs: 8, md: 12 },
        pb: { xs: 12, md: 16 },
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, mt: -10, opacity: 1 }}
      >
        <Stack spacing={4} alignItems="center">
          {/* Logo Section */}
          <Box
            component="img"
            src={Logo} // Using imported logo
            alt="Sawaban'amraha Logo"
            sx={{
              width: "auto",
              height: 500,
              mb: 2,
            }}
          />

          {/* Slogans */}
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#2d5f3f", // Primary Green
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontFamily:
                language === "ar" ? "Cairo, Tajawal, sans-serif" : "inherit",
            }}
          >
            {t("landing.title")}
          </Typography>

          <Typography
            variant="h4"
            sx={{
              color: "#555",
              fontWeight: 500,
              fontSize: { xs: "1.5rem", md: "2rem" },
              mt: -1,
            }}
          >
            {t("landing.subtitle")}
          </Typography>

          {/* Login Button */}
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(ROUTES.HOME)}
            sx={{
              bgcolor: "#2d5f3f",
              color: "white",
              px: 6,
              py: 1.5,
              fontSize: "1.2rem",
              borderRadius: "8px",
              mt: 4,
              "&:hover": {
                bgcolor: "#1e402a",
              },
            }}
          >
            {t("auth.login")}
          </Button>

          {/* Palestinian Flag Element - Simplified CSS representation */}
          <Box sx={{ mt: 4, display: "flex", gap: 1 }}>
            {/* We can add a flag SVG or simple CSS blocks here later if needed */}
          </Box>
        </Stack>
      </Container>
      {/* Decorative Bottom Curve */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          bgcolor: "white",
          borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
          transform: "scaleX(1.5)",
        }}
      />
    </Box>
  );
};

export default HeroSection;
