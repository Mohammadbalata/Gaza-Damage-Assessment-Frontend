import React from "react";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { Assignment as ClipboardIcon, ArrowForward } from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/Routes";

const DamageAssessmentSection: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate(); // Hook for navigation

  return (
    <Box sx={{ pb: 8 }}>
      <Container maxWidth="md">
        <Box
          sx={{
            bgcolor: "#2d5f3f", // Primary Green
            borderRadius: "50px 0 50px 0", // Unique shape
            p: 4,
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(45, 95, 63, 0.3)",
          }}
        >
          {/* Decorative Pattern Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              opacity: 0.3,
            }}
          />

          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={4}
            sx={{ position: "relative", zIndex: 1 , mr: 5 }}
          >
            {/* Text Section */}
            <Box
              textAlign={{
                xs: "center",
                md: language === "ar" ? "right" : "left",
              }}
            >
              <Typography
                variant="h4"
                sx={{ color: "white", fontWeight: 700, mb: 1 }}
              >
                {t("landing.damageAssessment")}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(ROUTES.HOME)} // Use navigate internally
                endIcon={
                  <ArrowForward
                    sx={{
                      transform: language === "ar" ? "rotate(180deg)" : "none",
                      mx: language === "ar" ? 1 : 0,
                    }}
                  />
                }
                sx={{
                  bgcolor: "white",
                  color: "#2d5f3f",
                  fontWeight: 700,
                  mt: 2,
                  px: 6,
                  pl:4,
                  "&:hover": {
                    bgcolor: "#f0f0f0",
                  },
                  textAlign:'center'
                }}
              >
                {t("auth.login")}
              </Button>
            </Box>

            {/* Icon/Illustration Section */}
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: "20px",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                width: 120,
                height: 120,
              }}
            >
              <ClipboardIcon sx={{ fontSize: 60, color: "#2d5f3f" }} />
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default DamageAssessmentSection;
