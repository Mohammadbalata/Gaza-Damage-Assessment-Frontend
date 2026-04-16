import React from "react";
import AuthComp from "./AuthComp";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import { API } from "../../../shared/constants/ApiRoutes";
import { ROUTES } from "../../../app/router/Routes";

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
