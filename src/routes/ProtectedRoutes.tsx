import { Navigate } from "react-router-dom";
import { ROUTES } from "./Routes";
import { useEffect } from "react";

const ProtectedRoutes = ({ children }: any) => {
    const token = localStorage.getItem("token");
    useEffect(() => {
        
    },[token])
  return token ? <>{children}</> : <Navigate to={`/${ROUTES.SIGNIN}`} />;
};

export default ProtectedRoutes;
