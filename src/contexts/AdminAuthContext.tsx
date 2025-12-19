import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/Routes";
import { api } from "../services/api";
import { AdminUser,UserRole } from "../types/entities";



interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
  error: string | null;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistAuth = (payload: { user: AdminUser; access_token: string }) => {
    setUser(payload.user);
    setToken(payload.access_token);
    localStorage.setItem("user", JSON.stringify(payload.user));
    localStorage.setItem("token", payload.access_token);
  };

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Use shared API client so baseURL and interceptors are applied correctly
      const response = await api.post("/auth/signin", credentials);
      const data = response.data?.data ?? response.data;

      if (data?.user && data?.access_token) {
        persistAuth({
          user: data.user,
          access_token: data.access_token,
        });
        return true;
      }

      throw new Error("Malformed authentication response");
    } catch (err) {
      const error = err as AxiosError<any>;
      console.error("Admin login failed", error);

      // Prefer backend-provided message if available
      const backendMessage =
        (error.response?.data as any)?.message ||
        (error.response?.data as any)?.error;

      if (error.response?.status === 401) {
        setError(backendMessage || "Invalid email or password");
      } else if (error.response?.status === 404) {
        setError(
          backendMessage ||
            "Authentication service is not available. Please try again later."
        );
      } else {
        setError(backendMessage || "Login failed");
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.get("/auth/profile");
      const profile = response.data?.data ?? response.data;
      if (profile) {
        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      }
    } catch (error) {
      console.error("Failed to refresh profile", error);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    if (user?.role !== UserRole.ADMIN || UserRole.SUPERVISOR) {
      navigate(`${ROUTES.SIGNIN}`);
      console.log("into if logout");
    }
  };

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!user) return false;
      return roles.includes(user.role as UserRole);
    },
    [user]
  );

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        refreshProfile,
        hasRole,
        isAuthenticated: !!user,
        error,
        loading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AdminAuthProvider");
  }
  return context;
};
