import { IRoutes } from "../interfaces/IRoutes";
import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import VerificationQuestionsPage from "../pages/VerificationQuestionsPage";
import PreviousLocationMapPage from "../pages/PreviousLocationMapPage";
import PasswordDisplayPage from "../pages/PasswordDisplayPage";
import CurrentLocationMapPage from "../pages/CurrentLocationMapPage";
import TrackStatusPage from "../pages/TrackStatusPage";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import CitizenDashboard from "../pages/CitizenDashboard";
import { useAuth } from "../contexts/AdminAuthContext";
import { Navigate } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminLoginPage from "../pages/AdminDashboard/AdminLoginPage";
import ChangePasswordPage from "../pages/Settings/ChangePasswordPage";
import MyApplications from "../pages/MyApplications";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import BankInformationPage from "../pages/BankInformationPage";
import AdminLayout from "../pages/AdminDashboard/AdminLayout";
import { adminRoutes } from "./admin.routes";
import { PermissionGuard } from "./PermissionGuard";
import EditProfilePage from "../pages/Settings/EditProfilePage";
import SettingsPage from "../pages/SettingsPage";
import AdminLocationMapPage from "../pages/AdminDashboard/AdminLocationMapPage";
import BiometricDataPage from "../pages/Settings/BiometricDataPage";
import AdminResetPasswordPage from "../pages/AdminDashboard/ResetPasswordPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={ROUTES.ADMIN_LOGIN} />
  );
}

export const ROUTES: IRoutes = {
  LAYOUT: "/",
  SIGNIN: "auth/signIn",
  SIGNUP: "auth/signUp",
  VERIFICATION_QUESTIONS: "/verification-questions",
  PASSWORD_DISPLAY: "/password-display",
  CHANGE_PASSWORD: "/citizen/settings/change-password",
  SETTINGS: "/citizen/settings",
  EDIT_PROFILE: "/citizen/settings/edit-profile",
  MY_APPLICATIONS: "/my-applications",
  PREVIOUS_LOCATION: "/previous-location",
  CURRENT_LOCATION: "/current-location",
  PERSONAL_INFO: "/personal-info",
  FAMILY_INFO: "/family-info",
  REVIEW: "/review",
  SUCCESS: "/success",
  TRACK_STATUS: "/track-status",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_LOCATION_MAP: "admin/locations/map",
  ADMIN_RESET_PASSWORD: "/admin/reset-password",
  CITIZEN_DASHBOARD: "/citizen/dashboard",
  FORGOT_PASSWORD: "auth/forgot-password",
  BANK_INFORMATION: "/citizen/bank-information",
  BIOMETRIC_DATA: "/citizen/settings/biometric-data",
};

export const routes = [
  { path: ROUTES.LAYOUT, element: <Layout /> },
  { index: true, path: ROUTES.LAYOUT, element: <HomePage /> },
  { path: ROUTES.SIGNIN, element: <SignInPage /> },
  { path: ROUTES.SIGNUP, element: <SignUpPage /> },
  {
    path: ROUTES.VERIFICATION_QUESTIONS,
    element: <VerificationQuestionsPage />,
  },
  {
    path: ROUTES.PREVIOUS_LOCATION,
    element: (
      <ProtectedRoutes>
        <PreviousLocationMapPage />
      </ProtectedRoutes>
    ),
  },
  {
    path: ROUTES.PASSWORD_DISPLAY,
    element: <PasswordDisplayPage />,
  },

  {
    path: ROUTES.MY_APPLICATIONS,
    element: (
      <ProtectedRoutes>
        <MyApplications />
      </ProtectedRoutes>
    ),
  },
  {
    path: ROUTES.CHANGE_PASSWORD,
    element: (
      <ProtectedRoutes>
        <ChangePasswordPage />
      </ProtectedRoutes>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <ProtectedRoutes>
        <SettingsPage />
      </ProtectedRoutes>
    ),
  },
  {
    path: ROUTES.BIOMETRIC_DATA,
    element: (
      <ProtectedRoutes>
        <BiometricDataPage />
      </ProtectedRoutes>
    ),
  },
  {
    path: ROUTES.EDIT_PROFILE,
    element: (
      <ProtectedRoutes>
        <EditProfilePage />
      </ProtectedRoutes>
    ),
  },

  {
    path: ROUTES.CURRENT_LOCATION,
    element: (
      <ProtectedRoutes>
        <CurrentLocationMapPage />
      </ProtectedRoutes>
    ),
  },

  {
    path: ROUTES.TRACK_STATUS,
    element: <TrackStatusPage />,
  },
  {
    path: ROUTES.CITIZEN_DASHBOARD,
    element: (
      <ProtectedRoutes>
        <CitizenDashboard />
      </ProtectedRoutes>
    ),
  },
  {
    path: ROUTES.ADMIN_LOGIN,
    element: <AdminLoginPage />,
  },
  {
    path: ROUTES.ADMIN_DASHBOARD,
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTES.ADMIN_RESET_PASSWORD,
    element: <AdminResetPasswordPage />,
  },
  {
    path: ROUTES.BANK_INFORMATION,
    element: (
      <ProtectedRoutes>
        <BankInformationPage />
      </ProtectedRoutes>
    ),
  },

  {
    path: ROUTES.ADMIN_DASHBOARD,
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: adminRoutes.map((route) => ({
      index: route.path === "",
      path: route.path || undefined,
      element: route.permission ? (
        <PermissionGuard permission={route.permission}>
          {route.element}
        </PermissionGuard>
      ) : (
        route.element
      ),
    })),
  },

  {
    path: ROUTES.ADMIN_LOCATION_MAP,
    element: <AdminLocationMapPage />,
  },

  { path: "*", element: <NotFoundPage /> },
];
