"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

import { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;

  login: (
    user: User,
    token: string
  ) => void;

  logout: () => void;

  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext =
  createContext<AuthContextValue | null>(null);

function getInitialAuth() {
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
    };
  }

  try {
    const storedToken =
      localStorage.getItem("medistore_token");

    const storedUser =
      localStorage.getItem("medistore_user");

    return {
      token: storedToken,
      user: storedUser
        ? JSON.parse(storedUser)
        : null,
    };
  } catch {
    localStorage.removeItem("medistore_token");
    localStorage.removeItem("medistore_user");

    return {
      user: null,
      token: null,
    };
  }
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialAuth = getInitialAuth();

  const [user, setUser] = useState<User | null>(
    initialAuth.user
  );

  const [token, setToken] = useState<string | null>(
    initialAuth.token
  );

  const [loading] = useState(false);

  // Login
  const login = useCallback(
    (user: User, token: string) => {
      localStorage.setItem(
        "medistore_token",
        token
      );

      localStorage.setItem(
        "medistore_user",
        JSON.stringify(user)
      );

      setUser(user);
      setToken(token);
    },
    []
  );

  // Logout
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

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}