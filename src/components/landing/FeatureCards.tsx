import React from "react";
import { Box, Typography, Container, Paper, IconButton } from "@mui/material";
import {
  Storage as DatabaseIcon,
  Groups as PeopleIcon,
  Warning as EmergencyIcon,
  Handshake as HandshakeIcon,
  ArrowForward,
} from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const FeatureCards: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const cards = [
    {
      id: "central-database",
      titleKey: "landing.cards.database",
      icon: <DatabaseIcon sx={{ fontSize: 50, color: "white" }} />,
      bgColor: "#2d5f3f", // Green
      route: "/central-database",
    },
    {
      id: "public-services",
      titleKey: "landing.cards.services",
      icon: <PeopleIcon sx={{ fontSize: 50, color: "white" }} />,
      bgColor: "#d32f2f", // Red
      route: "/public-services",
    },
    {
      id: "emergency",
      titleKey: "landing.cards.emergency",
      icon: <EmergencyIcon sx={{ fontSize: 50, color: "white" }} />,
      bgColor: "#424242", // Dark Gray
      route: "/emergency-management",
    },
    {
      id: "support",
      titleKey: "landing.cards.support",
      icon: <HandshakeIcon sx={{ fontSize: 50, color: "#333" }} />,
      bgColor: "#e0e0e0", // Light Gray
      textColor: "#333",
      iconColor: "#333",
      route: "/support-network",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, mb: 8 , }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {cards.map((card) => (
          <Box key={card.id}>
            <Paper
              elevation={4}
              onClick={() => navigate(card.route)}
              sx={{
                bgcolor: card.bgColor,
                color: card.textColor || "white",
                p: 3,
                height: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "center",
                borderRadius: 4,
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.1)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {card.icon}
              </Box>

              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mt: 2, lineHeight: 1.2 }}
              >
                {t(card.titleKey)}
              </Typography>

              <IconButton
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: card.iconColor || "white",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                }}
              >
                <ArrowForward
                  sx={{
                    transform: language === "ar" ? "rotate(180deg)" : "none",
                  }}
                />
              </IconButton>
            </Paper>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default FeatureCards;
