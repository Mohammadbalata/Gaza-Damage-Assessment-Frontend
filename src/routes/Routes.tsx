import { IRoutes } from "../interfaces/IRoutes";
import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import VerificationQuestionsPage from "../pages/VerificationQuestionsPage";
import PreviousLocationMapPage from "../pages/PreviousLocationMapPage";
import PasswordDisplayPage from "../pages/PasswordDisplayPage";
import CurrentLocationMapPage from "../pages/CurrentLocationMapPage";
import TrackStatusPage from "../pages/TrackStatusPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import CitizenDashboard from "../pages/CitizenDashboard";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoutes from "./ProtectedRoutes";
import ChangePasswordPage from "../pages/Settings/ChangePasswordPage";
import MyApplications from "../pages/MyApplications";
import CitizenForgotPasswordPage from "../pages/Citizen/CitizenForgotPasswordPage";
import CitizenResetPasswordPage from "../pages/Citizen/CitizenResetPasswordPage";
import BankInformationPage from "../pages/BankInformationPage";
import EditProfilePage from "../pages/Settings/EditProfilePage";
import SettingsPage from "../pages/SettingsPage";
import BiometricDataPage from "../pages/Settings/BiometricDataPage";
import MyComplaintsPage from "../pages/Citizen/MyComplaintsPage";
import ComplaintDetailsPage from "../pages/Citizen/ComplaintDetailsPage";
import LandingPage from "../pages/LandingPage/LandingPage";
import {
  CentralDatabasePage,
  PublicServicesPage,
  EmergencyManagementPage,
  SupportNetworkPage,
} from "../pages/LandingPage/placeholders";
import ViewLocationMapPage from "../pages/ViewLocationMapPage";
import ServiceCenterPage from "../pages/Settings/ServiceCenterPage";
import SignInPasswordPage from "../pages/SignInPasswordPage";

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
  { path: ROUTES.SIGNUP, element: <SignUpPage /> },
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

  { path: "*", element: <NotFoundPage /> },
];
