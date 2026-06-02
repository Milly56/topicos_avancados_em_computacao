"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; name: string; email: string; type: "patient" | "professional"; phone?: string } | null;

type AuthContextValue = {
  user: User;
  login: (email: string) => Promise<{ success: boolean; needsRegistration?: boolean }>;
  register: (data: any) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "clinica_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }, [user]);

  async function login(email: string) {
    // Lightweight stub: treat emails containing "existing" as existing users
    if (!email) return { success: false, needsRegistration: true };

    if (email.includes("existing")) {
      const u = { id: "1", name: "Usuário Teste", email, type: "patient" as const };
      setUser(u);
      return { success: true };
    }

    return { success: false, needsRegistration: true };
  }

  async function register(data: any) {
    const u = { id: String(Date.now()), name: data.name || "Novo Usuário", email: data.email || "", type: data.type || "patient" } as any;
    setUser(u);
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
