import { AlertTriangle } from "lucide-react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../app/router/Routes";
import { Home } from "@mui/icons-material";
import { useLanguage } from "../../../app/providers/LanguageContext";
import LanguageToggle from "../../../shared/ui/LanguageToggle";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          py: 4,
        }}
      >
        <Box
          sx={{
            p: 3,
            borderRadius: "50%",
            bgcolor: "error.50",
            mb: 3,
            color: "error.main",
            animation: "bounce 2s infinite",
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-10px)" },
            },
          }}
        >
          <AlertTriangle size={64} />
        </Box>

        <Typography
          variant="h1"
          sx={{ fontWeight: 800, color: "error.main", mb: 1 }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
        >
          {t("notFound.title")}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 400 }}
        >
          {t("notFound.description")}
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<Home sx={{ ml: 1.5 }} />}
          onClick={() => navigate(ROUTES.LAYOUT)}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          {t("notFound.backToHome")}
        </Button>
      </Box>
      <LanguageToggle />
    </Container>
  );
};

export default NotFoundPage;
