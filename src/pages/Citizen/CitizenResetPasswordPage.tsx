import React from "react";
import AuthComp from "../AuthComp";
import ResetPasswordForm from "../../components/Shared/ResetPasswordForm";
import { API } from "../../constants/ApiRoutes";
import { ROUTES } from "../../routes/Routes";

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
