import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import AdminStats from "../../components/admin/AdminStats";
import { adminApi } from "../../services/api";
import { useAuth } from "../../contexts/AdminAuthContext";
import { Users, FileText, IdCard, MapPinned } from "lucide-react";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState({
    users: 0,
    applications: 0,
    citizens: 0,
    locations: 0,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usersRes, appsRes, citizensRes, locationsRes] =
          await Promise.all([
            adminApi.listUsers({ page: 1, pageSize: 1 }),
            adminApi.listApplications({ page: 1, pageSize: 1 }),
            adminApi.listCitizens({ page: 1, pageSize: 1 }),
            adminApi.listLocations({ page: 1, pageSize: 1 }),
          ]);

        setTotals({
          users: usersRes.length,
          applications: appsRes.length,
          citizens: citizensRes.length,
          locations: locationsRes.length,
        });
      } catch (e: any) {
        setError(e?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="loader">
            <LoadingSpinner />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{t("admin.dashboard")}</h1>
              <p className="text-sm text-gray-500">
                {user
                  ? `${t("admin.welcomeBack") || "Welcome back"}, ${user.name}`
                  : t("admin.manage")}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              {t("admin.role")}:{" "}
              <span className="font-semibold capitalize">
                {t("common.admin")}
              </span>
            </div>
          </div>

          <AdminStats />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <div
                  onClick={() => navigate("/admin/users")}
                  className=" flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
                    <Users className="hover:cursor-pointer w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="hover:underline hover:cursor-pointer text-xl font-semibold">
                      {t("admin.manageUsers")}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {t("admin.usersDescription")}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Total:{" "}
                  <span className="font-semibold">
                    {totals.users.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>

            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <div
                  onClick={() => navigate("/admin/applications")}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
                    <FileText className="hover:cursor-pointer w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="hover:underline hover:cursor-pointer text-xl font-semibold">
                      {t("admin.manageApplications")}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {t("admin.applicationsDescription")}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Total:{" "}
                  <span className="font-semibold">
                    {totals.applications.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>

            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <div
                  onClick={() => navigate("/admin/citizens")}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
                    <IdCard className="hover:cursor-pointer w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="hover:underline hover:cursor-pointer text-xl font-semibold">
                      {t("admin.manageCitizens")}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {t("admin.citizensDescription")}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Total:{" "}
                  <span className="font-semibold">
                    {totals.citizens.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>

            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <div
                  onClick={() => navigate("/admin/locations")}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-light/10 flex items-center justify-center text-primary">
                    <MapPinned className="hover:cursor-pointer w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="hover:underline hover:cursor-pointer text-xl font-semibold">
                      {t("admin.manageLocations")}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {t("admin.locationsDescription")}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Total:{" "}
                  <span className="font-semibold">
                    {totals.locations.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   Container,
//   Card,
//   Typography,
//   Skeleton,
//   CardActionArea,
//   Grid,
// } from "@mui/material";
// import { Users, FileText, IdCard, MapPin } from "lucide-react";
// import { useLanguage } from "../../contexts/LanguageContext";
// import { useAuth } from "../../contexts/AdminAuthContext";
// import { adminApi } from "../../services/api";
// import AdminStats from "../../components/admin/AdminStats";
// import ErrorAlert from "../../components/Shared/ErrorAlert";

// const ADMIN_CARDS = [
//   {
//     icon: Users,
//     title: "admin.manageUsers",
//     description: "admin.usersDescription",
//     route: "/admin/users",
//     color: "#3b82f6",
//   },
//   {
//     icon: FileText,
//     title: "admin.manageApplications",
//     description: "admin.applicationsDescription",
//     route: "/admin/applications",
//     color: "#10b981",
//   },
//   {
//     icon: IdCard,
//     title: "admin.manageCitizens",
//     description: "admin.citizensDescription",
//     route: "/admin/citizens",
//     color: "#f59e0b",
//   },
//   {
//     icon: MapPin,
//     title: "admin.manageLocations",
//     description: "admin.locationsDescription",
//     route: "/admin/locations",
//     color: "#8b5cf6",
//   },
// ];

// export function AdminDashboard() {
//   const { t } = useLanguage();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [totals, setTotals] = useState({
//     users: 0,
//     applications: 0,
//     citizens: 0,
//     locations: 0,
//   });

//   useEffect(() => {
//     const loadStats = async () => {
//       try {
//         setLoading(true);
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
//       } catch (err: any) {
//         setError(err.message || t("error.loadDashboard"));
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadStats();
//   }, [t]);

//   const handleCardClick = (route: string) => {
//     navigate(route);
//   };

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       {/* Header */}
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" component="h1" fontWeight="bold">
//           {t("admin.dashboard")}
//         </Typography>
//         <Typography color="textSecondary" sx={{ mt: 1 }}>
//           {user ? `${t("admin.welcomeBack")}, ${user.name}` : t("admin.manage")}
//         </Typography>
//       </Box>

//       {/* Error Alert */}
//       {error && <ErrorAlert message={error} severity="error" sx={{ mb: 3 }} />}

//       {/* Stats Section */}
//       {loading ? (
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           {[1, 2, 3, 4].map((i) => (
//             <Grid item xs={12} sm={6} md={3} key={i}>
//               <Skeleton variant="rectangular" height={120} />
//             </Grid>
//           ))}
//         </Grid>
//       ) : (
//         <AdminStats />
//       )}

//       {/* Quick Access Cards */}
//       <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 4 }}>
//         {t("admin.quickAccess")}
//       </Typography>

//       <Grid container spacing={2}>
//         {ADMIN_CARDS.map((card) => {
//           const Icon = card.icon;
//           const cardTotal =
//             totals[card.route.split("/")[2] as keyof typeof totals];

//           return (
//             <Grid item xs={12} sm={6} md={3} key={card.route}>
//               <CardActionArea
//                 onClick={() => handleCardClick(card.route)}
//                 component={Card}
//                 sx={{
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   transition: "all 0.3s",
//                   "&:hover": {
//                     boxShadow: 3,
//                     transform: "translateY(-2px)",
//                   },
//                 }}
//               >
//                 <Box sx={{ p: 3, flex: 1 }}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       mb: 2,
//                       gap: 2,
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         p: 1.5,
//                         borderRadius: 1.5,
//                         bgcolor: `${card.color}20`,
//                       }}
//                     >
//                       <Icon color={card.color} size={24} />
//                     </Box>
//                     <Box>
//                       <Typography variant="subtitle1" fontWeight="600">
//                         {t(card.title)}
//                       </Typography>
//                       <Typography variant="caption" color="textSecondary">
//                         {t(card.description)}
//                       </Typography>
//                     </Box>
//                   </Box>
//                   <Typography variant="h5" fontWeight="bold" color="primary">
//                     {cardTotal?.toLocaleString()}
//                   </Typography>
//                 </Box>
//               </CardActionArea>
//             </Grid>
//           );
//         })}
//       </Grid>
//     </Container>
//   );
// }

// export default AdminDashboard;
