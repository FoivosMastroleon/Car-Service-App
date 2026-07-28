import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { login, register } from "@/api/auth";
import type { LoginFields, RegisterFields } from "@/schemas/auth";
import type { User } from "@/types";

type AuthContextProps = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loginUser: (fields: LoginFields) => Promise<void>;
  registerUser: (fields: RegisterFields) => Promise<void>;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const saveAuth = (newUser: User, newToken: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const loginUser = async (fields: LoginFields) => {
    const res = await login(fields);
    saveAuth(res.user, res.token);
  };

  const registerUser = async (fields: RegisterFields) => {
    const res = await register(fields);
    saveAuth(res.user, res.token);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
