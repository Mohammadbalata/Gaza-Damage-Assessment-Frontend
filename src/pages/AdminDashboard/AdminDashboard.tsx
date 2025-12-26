// src/pages/admin/AdminDashboard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Card,
  Typography,
  Stack,
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
import { Group as GroupIcon, Lock as LockIcon } from "@mui/icons-material";
import { useGet } from "../../hooks/api/useApi";
import { useNotification } from "../../hooks/useNotifications";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import { formatNumber } from "../../utils/formatters";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AdminAuthContext";
import { API } from "../../constants/ApiRoutes";
import { permissions } from "../../constants/permissions";

/**
 * Admin Dashboard Page
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

  if (error) {
    showError(error);
  }

  const canViewUsers = hasPermission(permissions.user.view);
  const canViewApplications = hasPermission(permissions.application.view);
  const canViewCitizens = hasPermission(permissions.citizen.view);
  const canViewLocations = hasPermission(permissions.location.view);
  const canViewBankAccounts = hasPermission(permissions.bank_account.view);
  const canViewRoles = hasPermission(permissions.role.view);
  const canViewPermissions = hasPermission(permissions.permission.view);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
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
        </Stack>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ py: 8 }}>
          <LoadingSpinner message={t("admin.loadingDashboard")} />
        </Box>
      )}

      {!loading && (
        <>
          {/* Statistics Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {canViewUsers && (
              <Grid>
                <StatisticCard
                  label={t("admin.totalUsers")}
                  value={totals.users}
                  icon={<UsersIcon />}
                />
              </Grid>
            )}

            {canViewApplications && (
              <Grid>
                <StatisticCard
                  label={t("admin.totalApplications")}
                  value={totals.applications}
                  icon={<ApplicationsIcon />}
                />
              </Grid>
            )}

            {canViewCitizens && (
              <Grid>
                <StatisticCard
                  label={t("admin.totalCitizens")}
                  value={totals.citizens}
                  icon={<CitizensIcon />}
                />
              </Grid>
            )}

            {canViewLocations && (
              <Grid>
                <StatisticCard
                  label={t("admin.totalLocations")}
                  value={totals.locations}
                  icon={<LocationsIcon />}
                />
              </Grid>
            )}

            {canViewBankAccounts && (
              <Grid>
                <StatisticCard
                  label={t("admin.totalBanking")}
                  value={totals.banking}
                  icon={<Money />}
                />
              </Grid>
            )}

             {canViewPermissions && (
              <Grid>
                <StatisticCard
                  label={t("admin.totalPermissions")}
                  value={totals.permissions}
                  icon={<LockIcon />}
                />
              </Grid>
            )}

            {canViewRoles && (
              <Grid>
                <StatisticCard
                  label={t("admin.totalRoles")}
                  value={totals.roles}
                  icon={<GroupIcon />}
                />
              </Grid>
            )}

          </Grid>

          {/* Quick Access */}
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ md: "center" }}
              justifyContent="space-between"
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {t("admin.mostImportantTasks")}
              </Typography>

              <Box className="flex justify-start items-center gap-4">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ApplicationsIcon />}
                  onClick={() => navigate("/admin/applications")}
                >
                  {t("admin.reviewApplications")}
                </Button>

                {hasPermission(permissions.user.create) && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<UsersIcon />}
                    onClick={() => navigate("/admin/users")}
                  >
                    {t("admin.addUser")}
                  </Button>
                )}

                {hasPermission(permissions.citizen.create) && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CitizensIcon />}
                    onClick={() => navigate("/admin/citizens")}
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
 * Statistic Card Component
 */
interface StatisticCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  label,
  value,
  icon,
}) => {
  return (
    <Card
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box className="flex justify-start items-center gap-4">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 1.5,
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={700}>
            {formatNumber(value)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default AdminDashboard;
