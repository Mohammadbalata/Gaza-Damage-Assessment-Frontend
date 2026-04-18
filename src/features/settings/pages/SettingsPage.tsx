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
  Avatar,
} from "@mui/material";
import {
  LockReset as LockIcon,
  ArrowBack,
  Person,
  Settings,
  Fingerprint as FingerprintIcon,
  //   Settings,
} from "@mui/icons-material";
import { useLanguage } from "../../../app/providers/LanguageContext";
import { ROUTES } from "../../../app/router/Routes";
import BackButton from "../../../shared/components/BackButton";
import LanguageToggle from "../../../shared/ui/LanguageToggle";

const SettingsPage: React.FC = () => {
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

  const settingsCards: DashboardCardConfig[] = [
    {
      key: "editProfile",
      title: t("citizen.editProfile"),
      description: t("citizen.editProfileDesc"),
      icon: <Person sx={{ fontSize: 40 }} />,
      color: "info",
      onClick: () => navigate(ROUTES.EDIT_PROFILE),
    },
    {
      key: "resetPassword",
      title: t("citizen.resetPassword"),
      description: t("citizen.resetPasswordDesc"),
      icon: <LockIcon sx={{ fontSize: 40 }} />,
      color: "warning",
      onClick: () => navigate(ROUTES.CHANGE_PASSWORD),
    },
    {
      key: "biometricData",
      title: t("citizen.biometricData"),
      description: t("citizen.biometricDataDesc"),
      icon: <FingerprintIcon sx={{ fontSize: 40 }} />,
      color: "success",
      onClick: () => navigate(ROUTES.BIOMETRIC_DATA),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section with Gradient */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 6,
          borderRadius: 3,
          background: "linear-gradient(135deg, #3fb892 0%, #9fdb6a 100%)",
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
          <Stack direction="row" spacing={4} alignItems="center" gap={0.5}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "rgba(255,255,255,0.2)",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              <Settings sx={{ fontSize: 36 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {t("citizen.electronicServices")}
              </Typography>
            </Box>
          </Stack>
          <BackButton
            sx={{
              background: "white",
              borderRadius: "10px",
            }}
            language={language}
            to={ROUTES.Service_Center}
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
        {settingsCards.map((card) => (
          <SettingsCard key={card.key} card={card} language={language} />
        ))}
      </Box>
      <LanguageToggle />
    </Container>
  );
};

interface SettingsCardProps {
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

const SettingsCard: React.FC<SettingsCardProps> = ({ card, language }) => {
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
              {card.title}
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

export default SettingsPage;
