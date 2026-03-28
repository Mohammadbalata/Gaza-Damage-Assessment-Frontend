import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import {
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  ArrowForward,
  ArrowBack,
} from "@mui/icons-material";
import {
  Storage as DatabaseIcon,
  Groups as PeopleIcon,
  Warning as EmergencyIcon,
  Handshake as HandshakeIcon,
} from "@mui/icons-material";
import { ROUTES } from "../routes/Routes";
import { LogOutIcon } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import { Assignment as ClipboardIcon } from "@mui/icons-material";
import { DashboardCard } from "./CitizenDashboard";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const dashboardCards = [
    {
      key: "damage-assessment",
      title: "landing.damageAssessment",
      description: t("citizen.addDamageRequestDesc"),
      icon: <ClipboardIcon sx={{ fontSize: 40 }} />,
      color: "success",
      route: ROUTES.CITIZEN_DASHBOARD,
    },
    {
      key: "central-database",
      title: "landing.cards.database",
      description: t("citizen.centralDatabaseDesc"),
      icon: <DatabaseIcon sx={{ fontSize: 40 }} />,
      color: "primary",
      route: "/central-database",
    },
    {
      key: "public-services",
      title: "landing.cards.services",
      description: t("citizen.publicServicesDesc"),
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: "info",
      route: "/public-services",
    },
    {
      key: "emergency",
      title: "landing.cards.emergency",
      description: t("citizen.emergencyManagementDesc"),
      icon: <EmergencyIcon sx={{ fontSize: 40 }} />,
      color: "warning",
      route: "/emergency-management",
    },
    {
      key: "support",
      title: "landing.cards.support",
      description: t("citizen.supportNetworkDesc"),
      icon: <HandshakeIcon sx={{ fontSize: 40 }} />,
      color: "success",
      route: "/support-network",
    },
  ];

  const handleCardClick = (route: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate(ROUTES.SIGNIN);
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("citizenInfo");
    localStorage.removeItem("citizen_user");

    // Navigate to sign in page
    navigate(`/`);

    // Show success notification
    enqueueSnackbar(t("common.logout") + " ✓", { variant: "success" });
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        {/* Decorative circles */}

        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: language === "ar" ? "auto" : -60,
            left: language === "ar" ? -60 : "auto",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -40,
            right: language === "ar" ? -40 : "auto",
            left: language === "ar" ? "auto" : -40,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}
        />

        <Stack
          spacing={2}
          alignItems="center"
          sx={{ position: "relative", zIndex: 1 }}
        >
          {/* Logo */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: "rgba(255,255,255,0.15)",
              display: "inline-flex",
              mb: 1,
            }}
          >
            <img
              src="https://res.cloudinary.com/dopcli6un/image/upload/v1774209427/logo_dyktvp.png"
              alt="Logo"
              style={{ width: 90, height: 90 }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            {t("app.title")}
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            {language === "ar"
              ? "منصة إلكترونية موحدة لتسجيل وتتبع طلبات حصر الأضرار"
              : "A unified electronic platform for registering and tracking damage assessment requests"}
          </Typography>
        </Stack>
      </Paper>

      {/* Action Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
          mb: 4,
        }}
      >
        {dashboardCards.map((card) => (
          <DashboardCard
            key={card.key}
            card={{
              ...card,
              onClick: () => handleCardClick(card.route),
            }}
            language={language}
          />
        ))}
      </Box>
      {/* Track Application Status */}
      <Card
        onClick={() => navigate("/track-status")}
        sx={{
          mb: 4,
          cursor: "pointer",
          transition: "all 0.3s ease",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "success.50",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(51, 185, 58, 0.15)",
            transform: "translateY(-2px)",
            bgcolor: "success.100",
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "success.100",
                  color: "success.700",
                  display: "flex",
                }}
              >
                <SearchIcon sx={{ fontSize: 28, color: "#388E3C" }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#127a17ff" }}
                >
                  {t("auth.trackStatus")}
                </Typography>
                <Typography variant="body2" color="#559658ff">
                  {language === "ar"
                    ? "تتبع حالة طلبك المقدم باستخدام رقم التتبع الخاص بك"
                    : "Track your submitted application status using your tracking number"}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              color="success"
              endIcon={
                <ArrowForward
                  sx={{
                    transform: language === "ar" ? "rotate(180deg)" : "none",
                    mr: 1,
                  }}
                />
              }
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                px: 3,
                "&:hover": {
                  bgcolor: "success.200",
                },
              }}
            >
              {t("auth.trackStatus")}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Admin Access Card */}
      <Card
        onClick={() => navigate("/admin/login")}
        sx={{
          cursor: "pointer",
          transition: "all 0.3s ease",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
            transform: "translateY(-2px)",
            bgcolor: "grey.100",
          },
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "grey.200",
                  color: "grey.700",
                  display: "flex",
                }}
              >
                <AdminIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "grey.800", mr: 1 }}
                >
                  {t("auth.adminLogin")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 1 }}
                >
                  {language === "ar"
                    ? "الوصول إلى لوحة المعلومات الإدارية للمسؤولين"
                    : "Access the admin dashboard for government officials"}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              color="inherit"
              endIcon={
                <ArrowForward
                  sx={{
                    transform: language === "ar" ? "rotate(180deg)" : "none",
                    mr: 1,
                  }}
                />
              }
              sx={{
                borderRadius: 2,
                borderColor: "grey.400",
                color: "grey.700",
                fontWeight: 600,
                px: 3,
                "&:hover": {
                  borderColor: "grey.600",
                  bgcolor: "grey.200",
                },
              }}
            >
              {t("auth.adminLogin")}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "error.light",
          bgcolor: "error.50",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "error.main",
            bgcolor: "rgba(244, 67, 54, 0.08)",
          },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography
              variant="h6"
              color="error.dark"
              sx={{ fontWeight: 600 }}
            >
              {t("common.logout")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {language === "ar"
                ? "تسجيل الخروج من حسابك بشكل آمن"
                : "Securely sign out of your account"}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="error"
            size="large"
            startIcon={<LogOutIcon style={{ marginLeft: "10px" }} />}
            onClick={handleLogout}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(244, 67, 54, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            {t("common.logout")}
          </Button>
        </Stack>
      </Paper>

      {/* Footer */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          textAlign: "center",
          mt: 4,
          opacity: 0.7,
        }}
      >
        {language === "ar"
          ? `© ${new Date().getFullYear()} بلدية خان يونس - جميع الحقوق محفوظة`
          : `© ${new Date().getFullYear()} Khan Younis Municipality - All Rights Reserved`}
      </Typography>
    </Container>
  );
};

export default HomePage;
