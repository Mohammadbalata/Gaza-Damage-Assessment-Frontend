import { createContext, useContext, useState, ReactNode } from "react";

interface IUser {
  id: string;
  name: string;
  role: "user";
}

interface IUserAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  login: (user: IUser) => void;
  logout: () => void;
}

const UserAuthContext = createContext<IUserAuthContext | null>(null);

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  const login = (userData: IUser) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const ctx = useContext(UserAuthContext);
  if (!ctx) {
    throw new Error("useUserAuth must be used within UserAuthProvider");
  }
  return ctx;
};
