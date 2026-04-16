import { Navigate } from "react-router-dom";
import { ROUTES } from "./Routes";

const ProtectedRoutes = ({ children }: any) => {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to={`${ROUTES.SIGNIN}`} />;
};

export default ProtectedRoutes;
