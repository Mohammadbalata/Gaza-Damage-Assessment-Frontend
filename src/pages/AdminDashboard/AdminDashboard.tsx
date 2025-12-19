import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Paper,
} from "@mui/material";
import {
  People as UsersIcon,
  Description as ApplicationsIcon,
  PersonOutline as CitizensIcon,
  LocationOn as LocationsIcon,
  ArrowBack,
  Money,
} from "@mui/icons-material";
import { useGet } from "../../hooks/api/useApi";
import { useNotification } from "../../hooks/useNotifications";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import { formatNumber } from "../../utils/formatters";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AdminAuthContext";
import { UserRole } from "../../types/entities";

/**
 * Admin Dashboard Page
 * الصفحة الرئيسية لوحة التحكم
 */
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showError } = useNotification();
  const [totals, setTotals] = useState({
    users: 0,
    applications: 0,
    citizens: 0,
    locations: 0,
    banking:0
  });

  const { loading, error } = useGet("admin-dashboard", {
    immediate: true,
    onSuccess: (data) => {
      setTotals({
        users: data.users?.length || 0,
        applications: data.applications?.length || 0,
        citizens: data.citizens?.length || 0,
        locations: data.locations?.length || 0,
         banking:data.banking?.length || 0
      });
    },
  });

  if (error) {
    showError(error);
  }
  /**
   * Dashboard card configuration
   */
  interface DashboardCardConfig {
    key: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: "primary" | "info" | "success" | "warning";
    value: number;
    route: string;
  }

  const dashboardCards: DashboardCardConfig[] = [
    {
      key: "users",
      title: t("admin.manageUsers"),
      description: t("admin.usersDescription"),
      icon: <UsersIcon sx={{ fontSize: 40 }} />,
      color: "primary",
      value: totals.users,
      route: "/admin/users",
    },
    {
      key: "applications",
      title: t("admin.manageApplications"),
      description: t("admin.applicationsDescription"),
      icon: <ApplicationsIcon sx={{ fontSize: 40 }} />,
      color: "info",
      value: totals.applications,
      route: "/admin/applications",
    },
    {
      key: "citizens",
      title: t("admin.manageCitizens"),
      description: t("admin.citizensDescription"),
      icon: <CitizensIcon sx={{ fontSize: 40 }} />,
      color: "success",
      value: totals.citizens,
      route: "/admin/citizens",
    },
    {
      key: "locations",
      title: t("admin.manageLocations"),
      description: t("admin.locationsDescription"),
      icon: <LocationsIcon sx={{ fontSize: 40 }} />,
      color: "warning",
      value: totals.locations,
      route: "/admin/locations",
    },
    {
      key: "banking",
      title: t("admin.manageBanking"),
      description: t("admin.bankingDescription"),
      icon: <Money sx={{ fontSize: 40 }} />,
      color: "info",
      value: totals.banking,
      route: "/admin/banking",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 5 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {t("admin.dashboard")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t("admin.welcomeBack")}, {user?.name}
            </Typography>
          </Box>
          <Chip
            label={t("common.admin")}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Stack>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ py: 8 }}>
          <LoadingSpinner message="جاري تحميل بيانات لوحة التحكم..." />
        </Box>
      )}

      {/* Dashboard Content */}
      {!loading && (
        <>
          {/* Dashboard Cards Grid */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {dashboardCards.map((card) => (
              <Grid key={card.key}>
                <DashboardCard card={card} onNavigate={navigate} />
              </Grid>
            ))}
          </Grid>

          {/* Quick Access Section */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              mb: 3,
            }}
          >
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {t("admin.mostImportantTasks")}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t("admin.mostImportantTasksDescription")}
                </Typography>
              </Box>
              <Box className="flex justify-start items-center gap-4">
                <Button
                  variant="contained"
                  color="inherit"
                  size="small"
                  startIcon={<ApplicationsIcon />}
                  onClick={() => navigate("/admin/applications")}
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                  }}
                >
                  {t("admin.reviewApplications")}
                </Button>
                {user?.role === UserRole.ADMIN && (
                  <Button
                    variant="contained"
                    color="inherit"
                    size="small"
                    startIcon={<UsersIcon />}
                    onClick={() => navigate("/admin/users")}
                    sx={{
                      color: "primary.main",
                      fontWeight: 600,
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                    }}
                  >
                    {t("admin.addUser")}
                  </Button>
                )}
                {user?.role === UserRole.ADMIN && (
                  <Button
                    variant="contained"
                    color="inherit"
                    size="small"
                    startIcon={<CitizensIcon />}
                    onClick={() => navigate("/admin/citizens")}
                    sx={{
                      color: "primary.main",
                      fontWeight: 600,
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                    }}
                  >
                    {t("admin.addCitizen")}
                  </Button>
                )}
              </Box>
            </Stack>
          </Paper>

          {/* Statistics Summary */}
          <Grid container spacing={2}>
            <Grid>
              <StatisticCard
                label={t("admin.totalUsers")}
                value={totals.users}
                icon={<UsersIcon />}
                color="primary"
              />
            </Grid>
            <Grid>
              <StatisticCard
                label={t("admin.totalApplications")}
                value={totals.applications}
                icon={<ApplicationsIcon />}
                color="info"
              />
            </Grid>
            <Grid>
              <StatisticCard
                label={t("admin.totalCitizens")}
                value={totals.citizens}
                icon={<CitizensIcon />}
                color="success"
              />
            </Grid>
            <Grid>
              <StatisticCard
                label={t("admin.totalLocations")}
                value={totals.locations}
                icon={<LocationsIcon />}
                color="warning"
              />
            </Grid>

            <Grid>
              <StatisticCard
                label={t("admin.totalBanking")}
                value={totals.banking}
                icon={<Money />}
                color="info"
              />
            </Grid>
          </Grid>
        </>
      )}
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
    value: number;
    route: string;
  };
  onNavigate: (route: string) => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ card, onNavigate }) => {
  const { t, language } = useLanguage();

  const colorMap = {
    primary: { bg: "primary.light", text: "primary.main", hover: "#e3f2fd" },
    info: { bg: "info.light", text: "info.main", hover: "#e0f2f1" },
    success: { bg: "success.light", text: "success.main", hover: "#e8f5e9" },
    warning: { bg: "warning.light", text: "warning.main", hover: "#fff3e0" },
    secondary: { bg: "secondary.light", text: "secondary.main", hover: "#fff3e0" },
  };

  const color = colorMap[card.color];

  return (
    <Card
      onClick={() => onNavigate(card.route)}
      sx={{
        cursor: "pointer",
        height: "100%",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid #f0f0f0",
        "&:hover": {
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
          transform: "translateY(-4px)",
          backgroundColor: color.hover,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          {/* Icon and Value */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: color.bg,
                color: color.text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {card.icon}
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: color.text,
              }}
            >
              {formatNumber(card.value)}
            </Typography>
          </Stack>

          {/* Title and Description */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                color: "text.primary",
              }}
            >
              {card.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.4 }}
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
              pt: 1,
              borderTop: "1px solid #f0f0f0",
              color: color.text,
              fontWeight: 600,
              fontSize: "0.875rem",
              "&:hover": {
                gap: "8px",
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t("common.goToPage")}
            </Typography>
            <ArrowBack
              className={`${language == "en" ? "rotate-180" : ""} `}
              sx={{ fontSize: 20, transition: "margin 0.2s" }}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

/**
 * Statistic Card Component
 * مكون بطاقة الإحصائيات
 */
interface StatisticCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "primary" | "info" | "success" | "warning";
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  label,
  value,
  icon,
  color,
}) => {
  return (
    <Card
      sx={{
        textAlign: "center",
        p: 2,
        border: "1px solid #f0f0f0",
        transition: "all 0.3s",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <Stack spacing={1.5} alignItems="center">
        <Box
          sx={{
            color: `${color}.main`,
            p: 1,
            borderRadius: 1,
            backgroundColor: `${color}.light`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {formatNumber(value)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Stack>
    </Card>
  );
};

export default AdminDashboard;
