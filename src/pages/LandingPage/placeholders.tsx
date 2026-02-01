import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { ArrowBack } from "@mui/icons-material";

const PlaceholderPage: React.FC<{ titleKey: string }> = ({ titleKey }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 700, color: "#2d5f3f" }}
      >
        {t(titleKey)}
      </Typography>

      <Box sx={{ my: 4, p: 4, bgcolor: "#f5f5f5", borderRadius: 4 }}>
        <Typography variant="h5" color="text.secondary">
          {t("common.comingSoonMessage")}
        </Typography>
      </Box>

      <Button
        variant="outlined"
        startIcon={
          <ArrowBack
            sx={{
              transform: language === "ar" ? "rotate(180deg)" : "none",
              ml: language === "ar" ? 1 : 0,
            }}
          />
        }
        onClick={() => navigate("/")}
        size="large"
      >
        {t("common.back")}
      </Button>
    </Container>
  );
};

export const CentralDatabasePage = () => (
  <PlaceholderPage titleKey="landing.cards.database" />
);
export const PublicServicesPage = () => (
  <PlaceholderPage titleKey="landing.cards.services" />
);
export const EmergencyManagementPage = () => (
  <PlaceholderPage titleKey="landing.cards.emergency" />
);
export const SupportNetworkPage = () => (
  <PlaceholderPage titleKey="landing.cards.support" />
);
