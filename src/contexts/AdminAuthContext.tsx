import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

type Role = "admin" | "supervisor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminAuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);
    // Simple mock authentication - password is just 'password' for all demo accounts
    let success = true;
    await axios
      .post(`${import.meta.env.VITE_API_URL}/auth/signin`, credentials)
      .then((response) => {
        setUser(response.data.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        localStorage.setItem("access_token", response.data.data.access_token);
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

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        login,
        logout,
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
