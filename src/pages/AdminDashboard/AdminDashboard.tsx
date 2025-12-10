import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Alert,
  Chip,
  Button,
  Paper,
} from "@mui/material";
import {
  People as UsersIcon,
  Description as ApplicationsIcon,
  PersonOutline as CitizensIcon,
  LocationOn as LocationsIcon,
  TrendingUp as TrendingIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import { adminService } from "../../services/adminService";
import { useApi } from "../../hooks/api/useApi";
import { useNotification } from "../../hooks/useNotifications";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import { formatNumber } from "../../utils/formatters";

/**
 * Admin Dashboard Page
 * الصفحة الرئيسية لوحة التحكم
 */
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const [totals, setTotals] = useState({
    users: 0,
    applications: 0,
    citizens: 0,
    locations: 0,
  });

  /**
   * Fetch all dashboard data
   */
  const {
    loading,
    error,
    execute: fetchDashboardData,
  } = useApi(async () => {
    const [usersRes, applicationsRes, citizensRes, locationsRes] =
      await Promise.all([
        adminService.listUsers({ pageSize: 1000 }),
        adminService.listApplications({ pageSize: 1000 }),
        adminService.listCitizens({ pageSize: 1000 }),
        adminService.listLocations({ pageSize: 1000 }),
      ]);

    return {
      users: usersRes?.length || 0,
      applications: applicationsRes?.length || 0,
      citizens: citizensRes?.length || 0,
      locations: locationsRes?.length || 0,
    };
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDashboardData();
      if (data) {
        setTotals(data);
      } else {
        showError("فشل في تحميل بيانات لوحة التحكم");
      }
    };

    loadData();
  }, []);

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
      title: "إدارة المستخدمين",
      description: "إدارة حسابات المسؤولين والمشرفين",
      icon: <UsersIcon sx={{ fontSize: 40 }} />,
      color: "primary",
      value: totals.users,
      route: "/admin/users",
    },
    {
      key: "applications",
      title: "إدارة الطلبات",
      description: "مراجعة والموافقة على طلبات المواطنين",
      icon: <ApplicationsIcon sx={{ fontSize: 40 }} />,
      color: "info",
      value: totals.applications,
      route: "/admin/applications",
    },
    {
      key: "citizens",
      title: "إدارة المواطنين",
      description: "إدارة بيانات المواطنين والتحقق منها",
      icon: <CitizensIcon sx={{ fontSize: 40 }} />,
      color: "success",
      value: totals.citizens,
      route: "/admin/citizens",
    },
    {
      key: "locations",
      title: "إدارة المواقع",
      description: "إدارة المواقع الجغرافية والمناطق",
      icon: <LocationsIcon sx={{ fontSize: 40 }} />,
      color: "warning",
      value: totals.locations,
      route: "/admin/locations",
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
              لوحة التحكم
            </Typography>
            <Typography variant="body1" color="text.secondary">
              مرحباً بك في نظام إدارة الأضرار والمستفيدين
            </Typography>
          </Box>
          <Chip
            icon={<TrendingIcon />}
            label="مسؤول النظام"
            color="primary"
            variant="outlined"
            size="small"
          />
        </Stack>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={() => {}} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

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
              <Grid item xs={12} sm={6} lg={3} key={card.key}>
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
                  🎯 أهم المهام
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  الوصول السريع للمهام الأساسية في النظام
                </Typography>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
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
                  مراجعة الطلبات
                </Button>
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
                  إضافة مستخدم
                </Button>
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
                  إضافة مواطن
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* Statistics Summary */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <StatisticCard
                label="إجمالي المستخدمين"
                value={totals.users}
                icon={<UsersIcon />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatisticCard
                label="إجمالي الطلبات"
                value={totals.applications}
                icon={<ApplicationsIcon />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatisticCard
                label="إجمالي المواطنين"
                value={totals.citizens}
                icon={<CitizensIcon />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatisticCard
                label="إجمالي المواقع"
                value={totals.locations}
                icon={<LocationsIcon />}
                color="warning"
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
  const colorMap = {
    primary: { bg: "primary.light", text: "primary.main", hover: "#e3f2fd" },
    info: { bg: "info.light", text: "info.main", hover: "#e0f2f1" },
    success: { bg: "success.light", text: "success.main", hover: "#e8f5e9" },
    warning: { bg: "warning.light", text: "warning.main", hover: "#fff3e0" },
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
              الذهاب إلى الصفحة
            </Typography>
            <ArrowIcon sx={{ fontSize: 16, transition: "margin 0.2s" }} />
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

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useLanguage } from "../../contexts/LanguageContext";
// import AdminStats from "../../components/admin/AdminStats";
// import { adminApi } from "../../services/api";
// import { useAuth } from "../../contexts/AdminAuthContext";
// import { Users, FileText, IdCard, MapPinned } from "lucide-react";
// import LoadingSpinner from "../../components/Shared/LoadingSpinner";

// const AdminDashboard = () => {
//   const { t } = useLanguage();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [totals, setTotals] = useState({
//     users: 0,
//     applications: 0,
//     citizens: 0,
//     locations: 0,
//   });

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const [usersRes, appsRes, citizensRes, locationsRes] =
//           await Promise.all([
//             adminApi.listUsers({ page: 1, pageSize: 1 }),
//             adminApi.listApplications({ page: 1, pageSize: 1 }),
//             adminApi.listCitizens({ page: 1, pageSize: 1 }),
//             adminApi.listLocations({ page: 1, pageSize: 1 }),
//           ]);

//         setTotals({
//           users: usersRes.length,
//           applications: appsRes.length,
//           citizens: citizensRes.length,
//           locations: locationsRes.length,
//         });
//       } catch (e: any) {
//         setError(e?.message || "Failed to load dashboard data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   return (
//     <>
//       {loading ? (
//         <div className="flex items-center justify-center h-full">
//           <div className="loader">
//             <LoadingSpinner />
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <h1 className="text-3xl font-bold">{t("admin.dashboard")}</h1>
//               <p className="text-sm text-gray-500">
//                 {user
//                   ? `${t("admin.welcomeBack") || "Welcome back"}, ${user.name}`
//                   : t("admin.manage")}
//               </p>
//             </div>
//             <div className="text-sm text-gray-600">
//               {t("admin.role")}:{" "}
//               <span className="font-semibold capitalize">
//                 {t("common.admin")}
//               </span>
//             </div>
//           </div>

//           <AdminStats />

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
//               {error}
//             </div>
//           )}

//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//             <div className="card space-y-4">
//               <div className="flex items-center justify-between">
//                 <div
//                   onClick={() => navigate("/admin/users")}
//                   className=" flex items-center gap-3"
//                 >
//                   <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
//                     <Users className="hover:cursor-pointer w-5 h-5" />
//                   </div>
//                   <div>
//                     <h2 className="hover:underline hover:cursor-pointer text-xl font-semibold">
//                       {t("admin.manageUsers")}
//                     </h2>
//                     <p className="text-sm text-gray-500">
//                       {t("admin.usersDescription")}
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-500">
//                   Total:{" "}
//                   <span className="font-semibold">
//                     {totals.users.toLocaleString()}
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <div className="card space-y-4">
//               <div className="flex items-center justify-between">
//                 <div
//                   onClick={() => navigate("/admin/applications")}
//                   className="flex items-center gap-3"
//                 >
//                   <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
//                     <FileText className="hover:cursor-pointer w-5 h-5" />
//                   </div>
//                   <div>
//                     <h2 className="hover:underline hover:cursor-pointer text-xl font-semibold">
//                       {t("admin.manageApplications")}
//                     </h2>
//                     <p className="text-sm text-gray-500">
//                       {t("admin.applicationsDescription")}
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-500">
//                   Total:{" "}
//                   <span className="font-semibold">
//                     {totals.applications.toLocaleString()}
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <div className="card space-y-4">
//               <div className="flex items-center justify-between">
//                 <div
//                   onClick={() => navigate("/admin/citizens")}
//                   className="flex items-center gap-3"
//                 >
//                   <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
//                     <IdCard className="hover:cursor-pointer w-5 h-5" />
//                   </div>
//                   <div>
//                     <h2 className="hover:underline hover:cursor-pointer text-xl font-semibold">
//                       {t("admin.manageCitizens")}
//                     </h2>
//                     <p className="text-sm text-gray-500">
//                       {t("admin.citizensDescription")}
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-500">
//                   Total:{" "}
//                   <span className="font-semibold">
//                     {totals.citizens.toLocaleString()}
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <div className="card space-y-4">
//               <div className="flex items-center justify-between">
//                 <div
//                   onClick={() => navigate("/admin/locations")}
//                   className="flex items-center gap-3"
//                 >
//                   <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
//                     <MapPinned className="hover:cursor-pointer w-5 h-5" />
//                   </div>
//                   <div>
//                     <h2 className="hover:underline hover:cursor-pointer text-xl font-semibold">
//                       {t("admin.manageLocations")}
//                     </h2>
//                     <p className="text-sm text-gray-500">
//                       {t("admin.locationsDescription")}
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-500">
//                   Total:{" "}
//                   <span className="font-semibold">
//                     {totals.locations.toLocaleString()}
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AdminDashboard;
