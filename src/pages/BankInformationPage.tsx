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
  AccountBalance as BankIcon,
  ArrowBack,
  Construction as ConstructionIcon,
} from "@mui/icons-material";
import { useLanguage } from "../contexts/LanguageContext";
import { ROUTES } from "../routes/Routes";
import LanguageToggle from "../components/LanguageToggle";

const BankInformationPage = () => {
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
            bgcolor: "primary",
            color: "primary.light",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
            opacity: 0.8,
          }}
        >
          <BankIcon sx={{ fontSize: 40 }} />
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
              {t("citizen.bankInfoTitle")}
            </Typography>
          </Stack>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", fontWeight: "normal" }}
          >
            {t("citizen.bankInfoComingSoon")}
          </Typography>
        </Stack>

        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate(ROUTES.Service_Center)}
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
          {t("common.backToDashboard")}
        </Button>
      </Paper>
      <LanguageToggle />
    </Container>
  );
};

export default BankInformationPage;
