import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AdminAuthContext";

export const PermissionGuard = ({ permission, children }:any) => {
  const { hasPermission } = useAuth();

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};
