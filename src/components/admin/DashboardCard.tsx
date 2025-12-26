// import React, { useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Stack,
// } from "@mui/material";
// import {
//   People as UsersIcon,
//   Description as ApplicationsIcon,
//   PersonOutline as CitizensIcon,
//   LocationOn as LocationsIcon,
//   ArrowBack,
//   Money,
// } from "@mui/icons-material";
// import { formatNumber } from "../../utils/formatters";
// import { useLanguage } from "../../contexts/LanguageContext";
// import { GroupIcon, LockIcon } from "lucide-react";
// import { permissions } from "../../constants/permissions";
// interface DashboardCardProps {
//   card: {
//     key: string;
//     title: string;
//     description: string;
//     icon: React.ReactNode;
//     color: "primary" | "info" | "success" | "warning";
//     value: number;
//     route: string;
//   };
//   onNavigate: (route: string) => void;
// }

// const DashboardCard: React.FC<DashboardCardProps> = ({ card, onNavigate }) => {
//   const { t ,language} = useLanguage();
//   const [totals, setTotals] = useState({
//     users: 0,
//     applications: 0,
//     citizens: 0,
//     locations: 0,
//     banking: 0,
//     roles: 0,
//     permissions: 0,
//   });
//   interface DashboardCardConfig {
//     key: string;
//     title: string;
//     description: string;
//     icon: React.ReactNode;
//     color: "primary" | "info" | "success" | "warning";
//     value: number;
//     hasPermission: string;
//     route: string;
//   }

//   const dashboardCards: DashboardCardConfig[] = [
//     {
//       key: "users",
//       title: t("admin.manageUsers"),
//       description: t("admin.usersDescription"),
//       icon: <UsersIcon sx={{ fontSize: 40 }} />,
//       color: "primary",
//       value: totals.users,
//       hasPermission: permissions.user.view,
//       route: "/admin/users",
//     },
//     {
//       key: "applications",
//       title: t("admin.manageApplications"),
//       description: t("admin.applicationsDescription"),
//       icon: <ApplicationsIcon sx={{ fontSize: 40 }} />,
//       color: "info",
//       value: totals.applications,
//       hasPermission: permissions.application.view,
//       route: "/admin/applications",
//     },
//     {
//       key: "citizens",
//       title: t("admin.manageCitizens"),
//       description: t("admin.citizensDescription"),
//       icon: <CitizensIcon sx={{ fontSize: 40 }} />,
//       color: "success",
//       value: totals.citizens,
//       hasPermission: permissions.citizen.view,
//       route: "/admin/citizens",
//     },
//     {
//       key: "locations",
//       title: t("admin.manageLocations"),
//       description: t("admin.locationsDescription"),
//       icon: <LocationsIcon sx={{ fontSize: 40 }} />,
//       color: "warning",
//       value: totals.locations,
//       hasPermission: permissions.location.view,
//       route: "/admin/locations",
//     },
//     {
//       key: "banking",
//       title: t("admin.manageBanking"),
//       description: t("admin.bankingDescription"),
//       icon: <Money sx={{ fontSize: 40 }} />,
//       color: "info",
//       value: totals.banking,
//       hasPermission: permissions.bank_account.view,
//       route: "/admin/banking",
//     },
//     {
//       key: "roles",
//       title: t("admin.manageRoles"),
//       description: t("admin.rolesDescription"),
//       icon: <GroupIcon />,
//       color: "info",
//       value: totals.roles,
//       hasPermission: permissions.permission.view,
//       route: "/admin/roles",
//     },
//     {
//       key: "permissions",
//       title: t("admin.managePermissions"),
//       description: t("admin.permissionsDescription"),
//       icon: <LockIcon />,
//       color: "info",
//       value: totals.permissions,
//       hasPermission: permissions.role.view,
//       route: "/admin/permissions",
//     },
//   ];

//   const colorMap = {
//     primary: { bg: "primary.light", text: "primary.main", hover: "#e3f2fd" },
//     info: { bg: "info.light", text: "info.main", hover: "#e0f2f1" },
//     success: { bg: "success.light", text: "success.main", hover: "#e8f5e9" },
//     warning: { bg: "warning.light", text: "warning.main", hover: "#fff3e0" },
//     secondary: {
//       bg: "secondary.light",
//       text: "secondary.main",
//       hover: "#fff3e0",
//     },
//   };

//   const color = colorMap[card.color];

//   return (
//     <Card
//       onClick={() => onNavigate(card.route)}
//       sx={{
//         cursor: "pointer",
//         height: "100%",
//         transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//         border: "1px solid #f0f0f0",
//         "&:hover": {
//           boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
//           transform: "translateY(-4px)",
//           backgroundColor: color.hover,
//         },
//       }}
//     >
//       <CardContent sx={{ p: 3 }}>
//         <Stack spacing={2}>
//           {/* Icon and Value */}
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="flex-start"
//           >
//             <Box
//               sx={{
//                 p: 1.5,
//                 borderRadius: 2,
//                 backgroundColor: color.bg,
//                 color: color.text,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               {card.icon}
//             </Box>
//             <Typography
//               variant="h5"
//               sx={{
//                 fontWeight: 700,
//                 color: color.text,
//               }}
//             >
//               {formatNumber(card.value)}
//             </Typography>
//           </Stack>

//           {/* Title and Description */}
//           <Box>
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 600,
//                 mb: 0.5,
//                 color: "text.primary",
//               }}
//             >
//               {card.title}
//             </Typography>
//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{ lineHeight: 1.4 }}
//             >
//               {card.description}
//             </Typography>
//           </Box>

//           {/* Action Link */}
//           <Stack
//             direction="row"
//             alignItems="center"
//             spacing={0.5}
//             sx={{
//               mt: 1,
//               pt: 1,
//               borderTop: "1px solid #f0f0f0",
//               color: color.text,
//               fontWeight: 600,
//               fontSize: "0.875rem",
//               "&:hover": {
//                 gap: "8px",
//               },
//             }}
//           >
//             <Typography variant="body2" sx={{ fontWeight: 600 }}>
//               {t("common.goToPage")}
//             </Typography>
//             <ArrowBack
//               className={`${language == "en" ? "rotate-180" : ""} `}
//               sx={{ fontSize: 20, transition: "margin 0.2s" }}
//             />
//           </Stack>
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// };

// export default DashboardCard;
