import React from "react";
import AuthComp from "./AuthComp";
import ResetPasswordForm from "../../auth/components/ResetPasswordForm";
import { API } from "../../../shared/constants/ApiRoutes";
import { ROUTES } from "../../../app/router/Routes";

const CitizenResetPasswordPage: React.FC = () => {
  return (
    <AuthComp title="resetPassword">
      <ResetPasswordForm
        apiEndpoint={API.citizen.auth.resetPassword}
        loginRedirectPath={`/${ROUTES.SIGNIN}`}
      />
    </AuthComp>
  );
};

export default CitizenResetPasswordPage;
