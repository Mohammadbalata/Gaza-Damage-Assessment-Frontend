import { useNavigate } from "react-router-dom";
import { ROUTES } from "./Routes";

const ProtectedRoutes = ({ children }: any) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // const user = localStorage.getItem('user')
  return token ? <>{children}</> : <>{navigate(`${ROUTES.SIGNIN}`)}</>;
};

export default ProtectedRoutes;
