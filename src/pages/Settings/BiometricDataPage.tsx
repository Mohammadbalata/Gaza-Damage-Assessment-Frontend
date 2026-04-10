import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import {
  Fingerprint as FingerprintIcon,
  ArrowBack,
  Construction as ConstructionIcon,
} from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";
import { ROUTES } from "../../routes/Routes";
import LanguageToggle from "../../components/LanguageToggle";

const BiometricDataPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "success.main", // Distinct color for Biometric
            color: "success.light", // Light version for Icon color
            display: "flex", // Centered content
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
            opacity: 0.1, // Softer background
            position: "relative",
          }}
        >
          <FingerprintIcon
            sx={{ fontSize: 40, color: "success.main", opacity: 1 }}
          />
        </Box>
        {/* Re-centering icon manually since opacity hack above affects child if nested directly purely for background */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mt: -13, // pulls icon back up over the background circle
            mb: 3,
            width: 80,
            height: 80,
            pointerEvents: "none",
          }}
        >
          <FingerprintIcon sx={{ fontSize: 40, color: "success.main" }} />
        </Box>

        <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ConstructionIcon color="warning" />
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="text.primary"
            >
              {t("citizen.biometricDataTitle")}
            </Typography>
          </Stack>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", fontWeight: "normal" }}
          >
            {t("citizen.biometricDataComingSoon")}
          </Typography>
        </Stack>

        <Button
          variant="outlined"
          size="large"
          color="success"
          onClick={() => navigate(ROUTES.SETTINGS)}
          startIcon={
            <ArrowBack
              sx={{
                transform: language === "ar" ? "rotate(180deg)" : "none",
                ml: language === "ar" ? 1 : 0,
              }}
            />
          }
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            borderWidth: 2,
            fontWeight: 600,
            "&:hover": {
              borderWidth: 2,
            },
          }}
        >
          {t("common.backToSettings")}
        </Button>
      </Paper>
      <LanguageToggle />
    </Container>
  );
};

export default BiometricDataPage;
