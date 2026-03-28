import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import {
  AddCircleOutline as AddIcon,
  ListAlt as ListIcon,
  AccountBalance as BankIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  ArrowBack,
  Settings,
} from "@mui/icons-material";
import { useLanguage } from "../contexts/LanguageContext";
import { useAppSelector } from "../hooks/redux";
import { ROUTES } from "../routes/Routes";
import { useSnackbar } from "notistack";

/**
 * Citizen Dashboard Page
 * لوحة تحكم المواطن
 */
const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();

  // Get user info from Redux store
  const authState: any = useAppSelector((state) => state.auth);
  const citizenInfo = authState.citizenInfo;
  const citizenName = citizenInfo
    ? `${citizenInfo?.full_name}`.split(" ")[0]
    : citizenInfo.national_id;

  // Get avatar URL from citizenInfo (can be from API or local upload)
  const avatarUrl = citizenInfo?.avatar_url || null;

  // Get citizenFirst_name from citizenInfo
  // const citizenName = citizenInfo?.first_name || "";
  // console.log(authState.citizenInfo);
  /**
   * Handle logout - clears auth state and redirects to sign in
   */
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

  /**
   * Dashboard card configuration
   */
  interface DashboardCardConfig {
    key: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: "primary" | "info" | "success" | "warning";
    onClick: () => void;
  }

  const dashboardCards: DashboardCardConfig[] = [
    {
      key: "addRequest",
      title: "citizen.addDamageRequest",
      description: t("citizen.addDamageRequestDesc"),
      icon: <AddIcon sx={{ fontSize: 40 }} />,
      color: "primary",
      onClick: () => navigate(ROUTES.PREVIOUS_LOCATION),
    },
    {
      key: "myRequests",
      title: "citizen.myRequests",
      description: t("citizen.myRequestsDesc"),
      icon: <ListIcon sx={{ fontSize: 40 }} />,
      color: "info",
      onClick: () => navigate(ROUTES.MY_APPLICATIONS),
    },
    {
      key: "bankInfo",
      title: "citizen.bankInfo",
      description: t("citizen.bankInfoDesc"),
      icon: <BankIcon sx={{ fontSize: 40 }} />,
      color: "success",
      onClick: () => navigate(ROUTES.BANK_INFORMATION),
    },
    {
      key: "electronicServices",
      title: "citizen.electronicServices",
      description: t("citizen.electronicServicesDesc"),
      icon: <Settings sx={{ fontSize: 40 }} />,
      color: "warning",
      onClick: () => navigate(ROUTES.SETTINGS),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section with Gradient */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: language === "ar" ? "auto" : -50,
            left: language === "ar" ? -50 : "auto",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            right: language === "ar" ? -30 : "auto",
            left: language === "ar" ? "auto" : -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            useFlexGap={true}
          >
            <Avatar
              src={avatarUrl || undefined}
              sx={{
                width: 64,
                height: 64,
                bgcolor: "rgba(255,255,255,0.2)",
                border: "2px solid rgba(255,255,255,0.3)",
                "& img": {
                  objectFit: "cover",
                },
              }}
            >
              {/* Fallback when no avatar */}
              <PersonIcon sx={{ fontSize: 36 }} />
            </Avatar>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {t("citizen.welcome")}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {citizenName}
              </Typography>
            </Box>
          </Stack>
          <Chip
            label={t("citizen.dashboard")}
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 600,
              px: 1,
            }}
          />
        </Stack>
      </Paper>

      {/* Dashboard Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 3,
          mb: 4,
        }}
      >
        {dashboardCards.map((card) => (
          <DashboardCard key={card.key} card={card} language={language} />
        ))}
      </Box>

      {/* Logout Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
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
            startIcon={<LogoutIcon style={{ marginLeft: "10px" }} />}
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
    </Container>
  );
};

/**
 * Dashboard Card Component
 * مكون بطاقة لوحة التحكم
 */
interface DashboardCardProps {
  card: {
    key: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: "primary" | "info" | "success" | "warning";
    onClick: () => void;
  };
  language: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  card,
  language,
}) => {
  const { t } = useLanguage();

  const colorMap = {
    primary: {
      bg: "rgba(25, 118, 210, 0.08)",
      iconBg: "rgba(25, 118, 210, 0.12)",
      text: "#1976d2",
      hover: "rgba(25, 118, 210, 0.04)",
    },
    info: {
      bg: "rgba(2, 136, 209, 0.08)",
      iconBg: "rgba(2, 136, 209, 0.12)",
      text: "#0288d1",
      hover: "rgba(2, 136, 209, 0.04)",
    },
    success: {
      bg: "rgba(46, 125, 50, 0.08)",
      iconBg: "rgba(46, 125, 50, 0.12)",
      text: "#2e7d32",
      hover: "rgba(46, 125, 50, 0.04)",
    },
    warning: {
      bg: "rgba(237, 108, 2, 0.08)",
      iconBg: "rgba(237, 108, 2, 0.12)",
      text: "#ed6c02",
      hover: "rgba(237, 108, 2, 0.04)",
    },
  };

  const color = colorMap[card.color];

  return (
    <Card
      onClick={card.onClick}
      sx={{
        cursor: "pointer",
        height: "100%",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid #f0f0f0",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-6px)",
          backgroundColor: color.hover,
          "& .card-icon": {
            transform: "scale(1.1)",
          },
          "& .card-arrow": {
            transform:
              language === "en"
                ? "translateX(4px) rotate(180deg)"
                : "translateX(-4px)",
          },
        },
      }}
    >
      {/* Decorative corner accent */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: language === "ar" ? "auto" : 0,
          left: language === "ar" ? 0 : "auto",
          width: 80,
          height: 80,
          background: `linear-gradient(135deg, ${color.bg} 0%, transparent 100%)`,
          borderRadius: language === "ar" ? "0 0 100% 0" : "0 0 0 100%",
        }}
      />

      <CardContent sx={{ p: 3, position: "relative" }}>
        <Stack spacing={2.5}>
          {/* Icon */}
          <Box
            className="card-icon"
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: color.iconBg,
              color: color.text,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "fit-content",
              transition: "transform 0.3s ease",
            }}
          >
            {card.icon}
          </Box>

          {/* Title and Description */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1,
                color: "text.primary",
              }}
            >
              {t(card.title)}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              {card.description}
            </Typography>
          </Box>

          {/* Action Link */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{
              mt: 1,
              pt: 2,
              borderTop: "1px solid #f0f0f0",
              color: color.text,
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t("common.goToPage")}
            </Typography>
            <ArrowBack
              className="card-arrow"
              sx={{
                fontSize: 18,
                transition: "transform 0.2s ease",
                transform: language === "en" ? "rotate(180deg)" : "none",
              }}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CitizenDashboard;
