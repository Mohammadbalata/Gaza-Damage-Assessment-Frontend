import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Card,
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
  Money,
} from "@mui/icons-material";
import { useGet } from "../../hooks/api/useApi";
import { useNotification } from "../../hooks/useNotifications";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import { formatNumber } from "../../utils/formatters";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AdminAuthContext";
import { GroupIcon, LockIcon } from "lucide-react";
import { API } from "../../constants/ApiRoutes";
import { permissions } from "../../constants/permissions";

/**
 * Admin Dashboard Page
 * الصفحة الرئيسية لوحة التحكم
 */
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, hasPermission } = useAuth();
  const { showError } = useNotification();
  const [totals, setTotals] = useState({
    users: 0,
    applications: 0,
    citizens: 0,
    locations: 0,
    banking: 0,
    roles: 0,
    permissions: 0,
  });

  const { loading, error } = useGet(API.stats.adminDashboard, {
    immediate: true,
    onSuccess: (data) => {
      setTotals({
        users: data.users?.length || 0,
        applications: data.applications?.length || 0,
        citizens: data.citizens?.length || 0,
        locations: data.locations?.length || 0,
        banking: data.banking?.length || 0,
        roles: data.roles?.length || 0,
        permissions: data.permissions?.length || 0,
      });
    },
  });

  const canViewUsers = hasPermission(permissions.user.view);
  const canViewApplicatios = hasPermission(permissions.application.view);
  const canViewCitizens = hasPermission(permissions.citizen.view);
  const canViewlocatios = hasPermission(permissions.location.view);
  const canViewbankAccounts = hasPermission(permissions.bank_account.view);
  const canViewPermissions = hasPermission(permissions.permission.view);
  const canViewRoles = hasPermission(permissions.role.view);

  if (error) {
    showError(error);
  }
  /**
   * Dashboard card configuration
   */

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
          {/* <Grid container spacing={3} sx={{ mb: 5 }}>
            {dashboardCards.map((card) => (
              <>
                {card.hasPermission && (
                  <Grid key={card.key}>
                    <DashboardCard card={card} onNavigate={navigate} />
                  </Grid>
                )}
              </>
            ))}
          </Grid> */}

          {/* Statistics Summary */}
          <Grid container spacing={2}>
            {canViewUsers && (
              <Grid>
                <StatisticCard
                  label={t("admin.totalUsers")}
                  value={totals.users}
                  icon={<UsersIcon />}
                  color="primary"
                />
              </Grid>
            )}

            {canViewApplicatios && (
              <Grid>
                <StatisticCard
                  label={t("admin.totalApplications")}
                  value={totals.applications}
                  icon={<ApplicationsIcon />}
                  color="info"
                />
              </Grid>
            )}

            {canViewCitizens && (
              <Grid>
                <StatisticCard
                  label={t("admin.totalCitizens")}
                  value={totals.citizens}
                  icon={<CitizensIcon />}
                  color="success"
                />
              </Grid>
            )}

            {canViewlocatios && (
              <Grid>
                <StatisticCard
                  label={t("admin.totalLocations")}
                  value={totals.locations}
                  icon={<LocationsIcon />}
                  color="warning"
                />
              </Grid>
            )}

            {canViewbankAccounts && (
              <Grid>
                <StatisticCard
                  label={t("admin.totalBanking")}
                  value={totals.banking}
                  icon={<Money />}
                  color="info"
                />
              </Grid>
            )}
            {canViewRoles && (
              <Grid>
                <StatisticCard
                  label={t("admin.totalRoles")}
                  value={totals.roles}
                  icon={<GroupIcon />}
                  color="info"
                />
              </Grid>
            )}

            {canViewPermissions && (
              <Grid>
                <StatisticCard
                  label={t("admin.totalPermissions")}
                  value={totals.permissions}
                  icon={<LockIcon />}
                  color="info"
                />
              </Grid>
            )}
          </Grid>

          {/* Quick Access Section */}
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              mt: 3,
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
                {hasPermission(permissions.user.create) && (
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
                {hasPermission(permissions.citizen.create) && (
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
        </>
      )}
    </Container>
  );
};

/**
 * Dashboard Card Component
 * مكون بطاقة لوحة التحكم
 */

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
