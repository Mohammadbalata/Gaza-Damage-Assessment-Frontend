import { IRoutes } from "../../shared/types/IRoutes";
import Layout from "../../shared/components/Layout";
import HomePage from "../../features/system-pages/pages/HomePage";
import VerificationQuestionsPage from "../../features/auth/pages/VerificationQuestionsPage";
import PreviousLocationMapPage from "../../features/location/pages/PreviousLocationMapPage";
import PasswordDisplayPage from "../../features/auth/pages/PasswordDisplayPage";
import CurrentLocationMapPage from "../../features/location/pages/CurrentLocationMapPage";
import TrackStatusPage from "../../features/system-pages/pages/TrackStatusPage";
import SignInPage from "../../features/auth/pages/SignInPage";
import CitizenDashboard from "../../features/profile/pages/CitizenDashboard";
import NotFoundPage from "../../features/settings/pages/NotFoundPage";
import ProtectedRoutes from "./ProtectedRoutes";
import ChangePasswordPage from "../../features/auth/pages/ChangePasswordPage";
import MyApplications from "../../features/applications/pages/MyApplications";
import CitizenForgotPasswordPage from "../../features/auth/pages/CitizenForgotPasswordPage";
import CitizenResetPasswordPage from "../../features/auth/pages/CitizenResetPasswordPage";
import BankInformationPage from "../../features/profile/pages/BankInformationPage";
import EditProfilePage from "../../features/profile/pages/EditProfilePage";
import SettingsPage from "../../features/settings/pages/SettingsPage";
import BiometricDataPage from "../../features/profile/pages/BiometricDataPage";
import MyComplaintsPage from "../../features/applications/pages/MyComplaintsPage";
import ComplaintDetailsPage from "../../features/applications/pages/ComplaintDetailsPage";
import LandingPage from "../../features/system-pages/pages/LandingPage";
import DamageAssessmentPage from "../../features/damage-assessment/pages/DamageAssessmentPage";
import CentralDatabasePage from "../../features/central-database/pages/CentralDatabasePage";
import {
  PublicServicesPage,
  EmergencyManagementPage,
  SupportNetworkPage,
} from "../../features/system-pages/components/LandingPage/placeholders";
import ViewLocationMapPage from "../../features/location/pages/ViewLocationMapPage";
import ServiceCenterPage from "../../features/profile/pages/ServiceCenterPage";
import SignInPasswordPage from "../../features/auth/pages/SignInPasswordPage";
import ResetPassword from "../../features/auth/pages/ResetPassword";

export const ROUTES: IRoutes = {
  LAYOUT: "/",
  HOME: "/home",
  DEPARTMENT_SECTION: "/departments",
  SIGNIN: "/auth/signIn",
  SIGNIN_PASSWORD: "/auth/signin-password",
  SIGNUP: "/auth/signUp",
  Service_Center: "/service-center",
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
  RESET_PASSWORD: "/reset-password",
  REVIEW: "/review",
  SUCCESS: "/success",
  TRACK_STATUS: "/track-status",
  ADMIN_LOGIN: "https://admin.sawabuildgaza.com/dashboard/login",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_LOCATION_MAP: "locations/map",
  ADMIN_RESET_PASSWORD: "/admin/reset-password",
  ADMIN_FORGOT_PASSWORD: "/admin/forgot-password",
  CITIZEN_DASHBOARD: "/citizen/dashboard",
  CITIZEN_FORGOT_PASSWORD: "/citizen/forgot-password",
  CITIZEN_RESET_PASSWORD: "/citizen/reset-password",
  BANK_INFORMATION: "/citizen/bank-information",
  BIOMETRIC_DATA: "/citizen/settings/biometric-data",
  MY_COMPLAINTS: "/citizen/my-complaints",
  COMPLAINT_DETAILS: "/citizen/complaints/:id",
  // Landing Page Features
  CENTRAL_DATABASE: "/central-database",
  PUBLIC_SERVICES: "/public-services",
  EMERGENCY_MANAGEMENT: "/emergency-management",
  SUPPORT_NETWORK: "/support-network",
  DAMAGE_ASSESSMENT: "/citizen/damage-assessment",
};

export const routes = [
  {
    path: ROUTES.LAYOUT,
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      {
        path: ROUTES.HOME,
        element: (
          <ProtectedRoutes>
            <HomePage />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  { path: ROUTES.ADMIN_LOCATION_MAP, element: <ViewLocationMapPage /> },

  { path: ROUTES.SIGNIN, element: <SignInPage /> },
  { path: ROUTES.SIGNIN_PASSWORD, element: <SignInPasswordPage /> },
  // { path: ROUTES.SIGNUP, element: <SignUpPage /> },
  {
    path: ROUTES.VERIFICATION_QUESTIONS,
    element: <VerificationQuestionsPage />,
  },
  {
    path: ROUTES.PREVIOUS_LOCATION,
    element: (
      <div>
        <PreviousLocationMapPage />
      </div>
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
    path: ROUTES.RESET_PASSWORD,
    element: <ResetPassword />,
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
    path: ROUTES.Service_Center,
    element: (
      <ProtectedRoutes>
        <ServiceCenterPage />
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

  // Citizen Password Routes
  {
    path: ROUTES.CITIZEN_FORGOT_PASSWORD,
    element: <CitizenForgotPasswordPage />,
  },
  {
    path: ROUTES.CITIZEN_RESET_PASSWORD,
    element: <CitizenResetPasswordPage />,
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
    path: ROUTES.MY_COMPLAINTS,
    element: (
      <ProtectedRoutes>
        <MyComplaintsPage />
      </ProtectedRoutes>
    ),
  },
  {
    path: ROUTES.COMPLAINT_DETAILS,
    element: (
      <ProtectedRoutes>
        <ComplaintDetailsPage />
      </ProtectedRoutes>
    ),
  },
  { path: ROUTES.CENTRAL_DATABASE, element: <CentralDatabasePage /> },
  { path: ROUTES.PUBLIC_SERVICES, element: <PublicServicesPage /> },
  { path: ROUTES.EMERGENCY_MANAGEMENT, element: <EmergencyManagementPage /> },
  { path: ROUTES.SUPPORT_NETWORK, element: <SupportNetworkPage /> },
  {
    path: ROUTES.DAMAGE_ASSESSMENT,
    element: (
      <ProtectedRoutes>
        <DamageAssessmentPage />
      </ProtectedRoutes>
    ),
  },

  { path: "*", element: <NotFoundPage /> },
];
