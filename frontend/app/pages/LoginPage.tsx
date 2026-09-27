"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

type UserRole = "PACIENTE" | "PROFISSIONAL";
type Step = "email" | "register";

export function LoginPage() {
  const { findOrLogin, register } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [role, setRole] = useState<UserRole>("PACIENTE");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Campos de cadastro
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [idade, setIdade] = useState("");
  const [especialidade, setEspecialidade] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const result = await findOrLogin(email, role);
      if (result.success) {
        toast.success("Bem-vindo de volta!");
        router.push("/dashboard");
      } else if (result.needsRegistration) {
        setStep("register");
      }
    } catch {
      toast.error("Erro ao tentar entrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(email, role, { nome, telefone, idade, especialidade });
      toast.success("Cadastro realizado com sucesso!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Clínica</CardTitle>
          <CardDescription>
            {step === "email"
              ? "Entre com seu e-mail para continuar"
              : "Complete seu cadastro para continuar"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Você é:</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={role === "PACIENTE" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setRole("PACIENTE")}
                  >
                    Paciente
                  </Button>
                  <Button
                    type="button"
                    variant={role === "PROFISSIONAL" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setRole("PROFISSIONAL")}
                  >
                    Profissional
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Aguarde..." : "Continuar"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <p className="text-sm text-gray-500">
                Não encontramos uma conta para <strong>{email}</strong>. Preencha seus dados para se cadastrar.
              </p>

              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </div>

              {role === "PACIENTE" ? (
                <div className="space-y-2">
                  <Label htmlFor="idade">Idade</Label>
                  <Input
                    id="idade"
                    type="number"
                    placeholder="Ex: 30"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="especialidade">Especialidade</Label>
                  <Input
                    id="especialidade"
                    placeholder="Ex: Cardiologia"
                    value={especialidade}
                    onChange={(e) => setEspecialidade(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep("email")}
                >
                  Voltar
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}