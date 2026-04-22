import { Navigate } from "react-router-dom";
import { ROUTES } from "./Routes";
import { getToken } from "../../shared/utils/storage";

const ProtectedRoutes = ({ children }: any) => {
  const token = getToken();
  return token ? <>{children}</> : <Navigate to={`${ROUTES.SIGNIN}`} />;
};

export default ProtectedRoutes;
