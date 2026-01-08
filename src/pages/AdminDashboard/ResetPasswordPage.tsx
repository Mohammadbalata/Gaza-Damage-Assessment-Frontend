import React from "react";
import AuthComp from "../AuthComp";
import ResetPasswordForm from "../../components/Shared/ResetPasswordForm";
import { API } from "../../constants/ApiRoutes";
import { ROUTES } from "../../routes/Routes";

/**
 * Admin Reset Password Page
 * صفحة إعادة تعيين كلمة المرور للمسؤول
 *
 * Uses shared ResetPasswordForm with admin-specific configuration
 */
const AdminResetPasswordPage: React.FC = () => {
  return (
    <AuthComp title="resetPassword">
      <ResetPasswordForm
        apiEndpoint={API.admin.auth.resetPassword}
        loginRedirectPath={ROUTES.ADMIN_LOGIN}
      />
    </AuthComp>
  );
};

export default AdminResetPasswordPage;
