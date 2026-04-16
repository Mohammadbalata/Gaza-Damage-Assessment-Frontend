import { useLocation, useNavigate } from "react-router-dom";
import DamageAssessmentForm from "../../components/Form Applications/DamageAssessmentForm";
import { Container, Paper, Box, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";

const DamageAssessmentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isRTL = language === "ar";

  // State will contain location and initialData
  const locationData = state?.location;
  const initialData = state?.initialData;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: { xs: 2, sm: 4 } }}>
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Header with Back Button */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton onClick={handleBack} size="small">
              <ArrowBack sx={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
            </IconButton>
            <Typography variant="h6" fontWeight="bold">
              {t("common.damageRequest")}
            </Typography>
          </Box>

          <DamageAssessmentForm
            location={locationData}
            initialData={initialData}
            isPage={true}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default DamageAssessmentPage;
