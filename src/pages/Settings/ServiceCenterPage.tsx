import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import {
  AccountBalance as BankIcon,
  ArrowBack,
  Settings,
  Groups as PeopleIcon,
} from "@mui/icons-material";
import { useLanguage } from "../../contexts/LanguageContext";
import { ROUTES } from "../../routes/Routes";
import BackButton from "../../components/Shared/BackButton";

/**
 * Citizen Dashboard Page
 * لوحة تحكم المواطن
 */
const CitizenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

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
            <PeopleIcon sx={{ fontSize: 50, color: "white" }} />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                مركز الخدمات
              </Typography>
            </Box>
          </Stack>
          <BackButton
            language={language}
            to={ROUTES.HOME}
            sx={{
              background: "white",
              borderRadius: 2,
              color: "#1976d2",
              "&:hover": { bgcolor: "white" },
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
