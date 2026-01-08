import React from "react";
import AuthComp from "../AuthComp";
import ForgotPasswordForm from "../../components/Shared/ForgotPasswordForm";
import { API } from "../../constants/ApiRoutes";
import { ROUTES } from "../../routes/Routes";

/**
 * Admin Forgot Password Page
 * صفحة نسيت كلمة المرور للمسؤول
 *
 * Uses shared ForgotPasswordForm with admin-specific configuration
 */
const AdminForgotPasswordPage: React.FC = () => {
  return (
    <AuthComp title="forgotPassword">
      <ForgotPasswordForm
        apiEndpoint={API.admin.auth.forgotPassword}
        loginRedirectPath={ROUTES.ADMIN_LOGIN}
      />
    </AuthComp>
  );
};

export default AdminForgotPasswordPage;
