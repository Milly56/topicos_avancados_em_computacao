"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor, insira seu e-mail");
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email);

      if (result.success) {
        toast.success("Login realizado com sucesso!");
        router.push("/dashboard");
      } else if (result.needsRegistration) {
        router.push(`/register?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-blue-100">
            <Mail className="size-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Bem-vindo ao ClinicaFlow</CardTitle>
          <CardDescription>
            Entre com seu e-mail para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Não possui conta? Entre com seu e-mail para criar uma.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
