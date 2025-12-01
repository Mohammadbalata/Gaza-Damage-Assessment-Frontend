import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { api, AdminUser } from "../services/api";

type Role = "admin" | "supervisor";

export interface User extends AdminUser {}

interface AdminAuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (...roles: Role[]) => boolean;
  error: string | null;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("access_token");
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistAuth = (payload: { user: User; access_token: string }) => {
    setUser(payload.user);
    setToken(payload.access_token);
    localStorage.setItem("user", JSON.stringify(payload.user));
    localStorage.setItem("access_token", payload.access_token);
  };

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    let success = true;
    await axios
      .post(`${import.meta.env.VITE_API_URL}/auth/signin`, credentials)
      .then((response) => {
        const data = response.data?.data;
        if (data?.user && data?.access_token) {
          persistAuth({
            user: data.user,
            access_token: data.access_token,
          });
        } else {
          throw new Error("Malformed authentication response");
        }
      })
      .catch((e) => {
        console.log(e);
        setError(e.response?.data?.message || "Login failed");
        success = false;
      })
      .finally(() => {
        setLoading(false);
      });

    return success;
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
    localStorage.removeItem("access_token");
    setUser(null);
    setToken(null);
  };

  const hasRole = useCallback(
    (...roles: Role[]) => {
      if (!user) return false;
      return roles.includes(user.role as Role);
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
