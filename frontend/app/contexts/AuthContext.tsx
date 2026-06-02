"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

type UserRole = "PACIENTE" | "PROFISSIONAL";

type User = {
  id: string;
  email: string;
  role: UserRole;
  nome: string;
} | null;

type AuthContextValue = {
  user: User;
  // Tenta encontrar pelo email — se achar entra, se não retorna needsRegistration: true
  findOrLogin: (
    email: string,
    role: UserRole
  ) => Promise<{ success: boolean; needsRegistration: boolean }>;
  // Cria paciente ou profissional e já entra
  register: (
    email: string,
    role: UserRole,
    payload: Record<string, any>
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "clinica_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  // Restaura sessão
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignora
    }
  }, []);

  // Persiste sessão
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignora
    }
  }, [user]);

  async function findOrLogin(email: string, role: UserRole) {
    try {
      // GET /pacientes/email/:email  ou  GET /profissionais/email/:email
      const profile =
        role === "PACIENTE"
          ? await api.findPacienteByEmail(email)
          : await api.findProfissionalByEmail(email);

      if (!profile) {
        return { success: false, needsRegistration: true };
      }

      setUser({ id: profile.id, email: profile.email, role, nome: profile.nome });
      return { success: true, needsRegistration: false };
    } catch {
      return { success: false, needsRegistration: true };
    }
  }

  async function register(
    email: string,
    role: UserRole,
    payload: Record<string, any>
  ) {
    if (role === "PACIENTE") {
      const idade = Number(payload.idade);
      if (!payload.nome || !payload.telefone || isNaN(idade) || idade <= 0) {
        throw new Error("Dados de paciente incompletos ou inválidos");
      }

      // POST /pacientes → { id, email, nome, telefone, idade }
      const paciente = await api.createPaciente({
        email,
        nome: payload.nome as string,
        telefone: payload.telefone as string,
        idade,
      });

      setUser({ id: paciente.id, email, role, nome: paciente.nome });
    } else {
      if (!payload.nome || !payload.especialidade || !payload.telefone) {
        throw new Error("Dados de profissional incompletos");
      }

      // POST /profissionais → { id, email, nome, especialidade, telefone }
      const profissional = await api.createProfissional({
        email,
        nome: payload.nome as string,
        especialidade: payload.especialidade as string,
        telefone: payload.telefone as string,
      });

      setUser({ id: profissional.id, email, role, nome: profissional.nome });
    }
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, findOrLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthProvider;