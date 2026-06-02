"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

type User = { id: string; email: string; role: "PACIENTE" | "PROFISSIONAL" | "ADMIN"; token?: string } | null;

type AuthContextValue = {
  user: User;
  login: (email: string, password: string) => Promise<{ success: boolean; needsRegistration?: boolean }>;
  register: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "clinica_user";
const TOKEN_KEY = "clinica_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      if (raw) {
        const userData = JSON.parse(raw);
        setUser({ ...userData, token });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: user.id, email: user.email, role: user.role }));
        if (user.token) localStorage.setItem(TOKEN_KEY, user.token);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (e) {
      // ignore
    }
  }, [user]);

  async function login(email: string, password: string) {
    try {
      const response = await api.login(email, password);
      setUser({
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
        token: response.access_token,
      });
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, needsRegistration: false };
    }
  }

  async function register(email: string, password: string, role: string) {
    try {
      const roleEnum = (role === "professional" ? "PROFISSIONAL" : "PACIENTE") as "PACIENTE" | "PROFISSIONAL" | "ADMIN";
      const response = await api.register(email, password, roleEnum);
      setUser({
        id: response.id,
        email: response.email,
        role: response.role,
      });
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }

  function logout() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthProvider;
