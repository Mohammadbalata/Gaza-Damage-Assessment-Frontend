import { IRoutes } from "../interfaces/IRoutes";
import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import VerificationQuestionsPage from "../pages/VerificationQuestionsPage";
import PreviousLocationMapPage from "../pages/PreviousLocationMapPage";
import PasswordDisplayPage from "../pages/PasswordDisplayPage";
import CurrentLocationMapPage from "../pages/CurrentLocationMapPage";
import ReviewPage from "../pages/ReviewPage";
import SuccessPage from "../pages/SuccessPage";
import TrackStatusPage from "../pages/TrackStatusPage";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import AdminUsersPage from "../pages/AdminDashboard/AdminUsersPage";
import AdminApplicationsPage from "../pages/AdminDashboard/AdminApplicationsPage";
import AdminCitizensPage from "../pages/AdminDashboard/AdminCitizensPage";
import AdminLocationsPage from "../pages/AdminDashboard/AdminLocationsPage";
import AdminLocationMapPage from "../pages/AdminDashboard/AdminLocationMapPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import CitizenDashboard from "../pages/CitizenDashboard";
import { useAuth } from "../contexts/AdminAuthContext";
import { Navigate } from "react-router-dom";
import SupervisorDashboard from "../pages/AdminDashboard/SupervisorDashboard";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminLoginPage from "../pages/AdminDashboard/AdminLoginPage";
import ResetPasswordPage from "../pages/Settings/ResetPasswordPage";
import MyApplications from "../pages/MyApplications";
import { UserRole } from "../types/entities";
import AdminBankingPage from "../pages/AdminDashboard/AdminBankingPage";
// import PersonalInfoPage from "../pages/PersonalInfoPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={ROUTES.ADMIN_LOGIN} />
  );
}

function RoleBasedRoute() {
  const { user } = useAuth();

  if (!user) return <Navigate to={ROUTES.ADMIN_LOGIN} />;

  switch (user.role) {
    case UserRole.SUPERVISOR:
      return <SupervisorDashboard />;
    case UserRole.ADMIN:
      return <AdminDashboard />;
    default:
      return <Navigate to={ROUTES.ADMIN_LOGIN} />;
  }
}

export const ROUTES: IRoutes = {
  LAYOUT: "/",
  SIGNIN: "auth/signIn",
  SIGNUP: "auth/signUp",
  VERIFICATION_QUESTIONS: "/verification-questions",
  PASSWORD_DISPLAY: "/password-display",
  CHANGE_PASSWORD: "/settings/change-password",
  MAY_APPLICATIONS: "/my-applications",
  // DAMAGE_ASSESSMENT_DIALOG: "/damage-assessment-dialog",
  PREVIOUS_LOCATION: "/previous-location",
  CURRENT_LOCATION: "/current-location",
  PERSONAL_INFO: "/personal-info",
  FAMILY_INFO: "/family-info",
  REVIEW: "/review",
  SUCCESS: "/success",
  TRACK_STATUS: "/track-status",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_APPLICATIONS: "/admin/applications",
  ADMIN_CITIZENS: "/admin/citizens",
  ADMIN_LOCATIONS: "/admin/locations",
  ADMIN_LOCATION_MAP: "/admin/locations/map",
  CITIZEN_DASHBOARD: "/citizen/dashboard",
  ADMIN_BANKING:"admin/banking"
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
    path: ROUTES.MAY_APPLICATIONS,
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
        <ResetPasswordPage />
      </ProtectedRoutes>
    ),
  },
  // MyApplications

  // {
  //   path: ROUTES.DAMAGE_ASSESSMENT_DIALOG,

  //   element: (
  //     <ProtectedRoutes>
  //       <DamageAssessmentDialog />
  //     </ProtectedRoutes>
  //   ),
  // },

  {
    path: ROUTES.CURRENT_LOCATION,
    element: (
      <ProtectedRoutes>
        <CurrentLocationMapPage />
      </ProtectedRoutes>
    ),
  },

  {
    path: ROUTES.REVIEW,
    element: (
      <ProtectedRoutes>
        <ReviewPage />
      </ProtectedRoutes>
    ),
  },
  {
    path: ROUTES.SUCCESS,
    element: (
      <ProtectedRoutes>
        <SuccessPage />
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
        <RoleBasedRoute />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN_USERS,
    element: (
      <ProtectedRoute>
        <AdminUsersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN_APPLICATIONS,
    element: (
      <ProtectedRoute>
        <AdminApplicationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN_CITIZENS,
    element: (
      <ProtectedRoute>
        <AdminCitizensPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN_LOCATIONS,
    element: (
      <ProtectedRoute>
        <AdminLocationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN_LOCATION_MAP,
    element: (
      <ProtectedRoute>
        <AdminLocationMapPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN_BANKING,
    element: (
      <ProtectedRoute>
        <AdminBankingPage />
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <NotFoundPage /> },
];
