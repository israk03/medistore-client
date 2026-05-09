"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { User } from "@/types/auth.types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Always start as null — same on server and client
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Read localStorage only after mount — client only
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("medistore_token");
      const storedUser = localStorage.getItem("medistore_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem("medistore_token");
      localStorage.removeItem("medistore_user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((user: User, token: string) => {
    localStorage.setItem("medistore_token", token);
    localStorage.setItem("medistore_user", JSON.stringify(user));
    setUser(user);
    setToken(token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("medistore_token");
    localStorage.removeItem("medistore_user");
    localStorage.removeItem("medistore_cart");
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      loading,
      isAuthenticated: !!token,
    }),
    [user, token, login, logout, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}