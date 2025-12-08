import { Navigate } from "react-router-dom";
import { useUserAuth } from "../contexts/UserAuthContext";
import { ROUTES } from "./Routes.tsx";

export default function UserProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useUserAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGNIN} replace />;
  }

  return <>{children}</>;
}
