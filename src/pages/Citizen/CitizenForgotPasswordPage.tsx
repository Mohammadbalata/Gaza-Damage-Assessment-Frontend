import React from "react";
import AuthComp from "../AuthComp";
import ForgotPasswordForm from "../../components/Shared/ForgotPasswordForm";
import { API } from "../../constants/ApiRoutes";
import { ROUTES } from "../../routes/Routes";

const CitizenForgotPasswordPage: React.FC = () => {
  return (
    <AuthComp title="forgotPassword">
      <ForgotPasswordForm
        apiEndpoint={API.citizen.auth.forgotPassword}
        loginRedirectPath={`${ROUTES.SIGNIN}`}
      />
    </AuthComp>
  );
};

export default CitizenForgotPasswordPage;
