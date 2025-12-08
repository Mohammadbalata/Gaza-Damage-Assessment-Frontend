import { IRoutes } from "../interfaces/IRoutes";
import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import VerificationQuestionsPage from "../pages/VerificationQuestionsPage";
import PreviousLocationMapPage from "../pages/PreviousLocationMapPage";
import PasswordDisplayPage from "../pages/PasswordDisplayPage";
import DamageAssessmentDialog from "../pages/DamageAssessmentDialog";
import CurrentLocationMapPage from "../pages/CurrentLocationMapPage";
// import PersonalInfoPage from "../pages/PersonalInfoPage";
import FamilyInfoPage from "../pages/FamilyInfoPage";
import ReviewPage from "../pages/ReviewPage";
// import SuccessPage from "../pages/SuccessPage";
import TrackStatusPage from "../pages/TrackStatusPage";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import AdminUsersPage from "../pages/AdminDashboard/AdminUsersPage";
import AdminApplicationsPage from "../pages/AdminDashboard/AdminApplicationsPage";
import AdminCitizensPage from "../pages/AdminDashboard/AdminCitizensPage";
import AdminLocationsPage from "../pages/AdminDashboard/AdminLocationsPage";
import AdminLocationMapPage from "../pages/AdminDashboard/AdminLocationMapPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import { useAuth } from "../contexts/AdminAuthContext";
import { Navigate } from "react-router-dom";
import SupervisorDashboard from "../pages/AdminDashboard/SupervisorDashboard";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoutes from "./ProtectedRoutes";

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
    case "supervisor":
      return <SupervisorDashboard />;
    case "admin":
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
  PREVIOUS_LOCATION: "/previous-location",
  PASSWORD_DISPLAY: "/password-display",
  DAMAGE_ASSESSMENT_DIALOG: "/damage-assessment-dialog",
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
    path: ROUTES.DAMAGE_ASSESSMENT_DIALOG,

    element: (
      <ProtectedRoutes>
        <DamageAssessmentDialog />
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
  // {
  //   path: ROUTES.PERSONAL_INFO,
  //   element: (
  //     <ProtectedRoutes>
  //       <PersonalInfoPage />
  //     </ProtectedRoutes>
  //   ),
  // },
  {
    path: ROUTES.FAMILY_INFO,
    element: (
      <ProtectedRoutes>
        <FamilyInfoPage />
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
  // {
  //   path: ROUTES.SUCCESS,
  //   element: (
  //     <ProtectedRoutes>
  //       <SuccessPage />
  //     </ProtectedRoutes>
  //   ),
  // },
  {
    path: ROUTES.TRACK_STATUS,
    element: (
      <ProtectedRoutes>
        <TrackStatusPage />
      </ProtectedRoutes>
    ),
  },
  {
    path: ROUTES.ADMIN_LOGIN,
    element: (
      <ProtectedRoutes>
        <DamageAssessmentDialog />
      </ProtectedRoutes>
    ),
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
  { path: "*", element: <NotFoundPage /> },
];
