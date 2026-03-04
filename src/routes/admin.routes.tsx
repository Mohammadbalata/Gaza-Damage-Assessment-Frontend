import {
  People,
} from "@mui/icons-material";
// import { GroupIcon, LockIcon } from "lucide-react";
// import { permissions } from "../constants/permissions";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
// import AdminUsersPage from "../pages/AdminDashboard/AdminUsersPage";
// import AdminApplicationsPage from "../pages/AdminDashboard/AdminApplicationsPage";
// import AdminCitizensPage from "../pages/AdminDashboard/AdminCitizensPage";
// import AdminLocationsPage from "../pages/AdminDashboard/AdminLocationsPage";
// import AdminBankingPage from "../pages/AdminDashboard/AdminBankingPage";
// import AdminRolesPage from "../pages/AdminDashboard/AdminRolesPage";
// import AdminPermissionsPage from "../pages/AdminDashboard/AdminPermissionsPage";


export const adminRoutes = [
  {
    path: "",
    label: "admin.dashboard",
    element: <AdminDashboard />,
    icon: <People />,
    permission: null,
  },
  // {
  //   path: "users",
  //   label: "admin.manageUsers",
  //   element: <AdminUsersPage />,
  //   icon: <People />,
  //   permission: permissions.user.view,
  // },
  // {
  //   path: "applications",
  //   label: "admin.manageApplications",
  //   element: <AdminApplicationsPage />,
  //   icon: <Description />,
  //   permission: permissions.application.view,
  // },
  // {
  //   path: "citizens",
  //   label: "admin.manageCitizens",
  //   element: <AdminCitizensPage />,
  //   icon: <PersonOutline />,
  //   permission: permissions.citizen.view,
  // },
  // {
  //   path: "locations",
  //   label: "admin.manageLocations",
  //   element: <AdminLocationsPage />,
  //   icon: <LocationOn />,
  //   permission: permissions.location.view,
  // },
  // {
  //   path: "banking",
  //   label: "admin.manageBanking",
  //   element: <AdminBankingPage />,
  //   icon: <Money />,
  //   permission: permissions.bank_account.view,
  // },
  // {
  //   path: "roles",
  //   label: "admin.manageRoles",
  //   element: <AdminRolesPage />,
  //   icon: <GroupIcon size={20} />,
  //   permission: permissions.role.view,
  // },
  // {
  //   path: "permissions",
  //   label: "admin.managePermissions",
  //   element: <AdminPermissionsPage />,
  //   icon: <LockIcon size={20} />,
  //   permission: permissions.permission.view,
  // },
];
