"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { UserPlus, Stethoscope, Heart } from "lucide-react";

type UserType = "professional" | "patient";

interface TypeConfig {
  value: UserType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const userTypes: TypeConfig[] = [
  {
    value: "professional",
    label: "Profissional",
    description: "Médico ou especialista",
    icon: <Stethoscope className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    value: "patient",
    label: "Paciente",
    description: "Agendar consultas",
    icon: <Heart className="w-5 h-5" />,
    color: "bg-green-100 text-green-600",
  },
];

export function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    type: "patient" as UserType,
    // Campos paciente
    nome: "",
    cpf: "",
    phone: "",
    idade: "",
    // Campos profissional
    nomeProfissional: "",
    specialization: "",
    crm: "",
    phoneProfissional: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  function set(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error("Por favor, preencha o e-mail");
      return;
    }

    if (formData.type === "patient") {
      if (!formData.nome || !formData.cpf || !formData.phone || !formData.idade) {
        toast.error("Preencha todos os campos do paciente");
        return;
      }
      const idadeNum = parseInt(formData.idade, 10);
      if (isNaN(idadeNum) || idadeNum <= 0 || idadeNum > 130) {
        toast.error("Informe uma idade válida");
        return;
      }
    }

    if (formData.type === "professional") {
      if (!formData.nomeProfissional || !formData.specialization || !formData.crm) {
        toast.error("Preencha todos os campos do profissional");
        return;
      }
    }

    setIsLoading(true);

    try {
      const roleMap: Record<UserType, "PACIENTE" | "PROFISSIONAL"> = {
        patient: "PACIENTE",
        professional: "PROFISSIONAL",
      };

      const role = roleMap[formData.type];

      const payload: Record<string, any> =
        formData.type === "patient"
          ? {
              nome: formData.nome,
              cpf: formData.cpf,
              telefone: formData.phone,
              idade: parseInt(formData.idade, 10),
            }
          : {
              nome: formData.nomeProfissional,
              especialidade: formData.specialization,
              telefone: formData.phoneProfissional || formData.crm,
              crm: formData.crm,
            };

      await register(formData.email, role, payload); // corrigido: removido password
      toast.success("Cadastro realizado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-blue-100">
            <UserPlus className="size-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Criar Conta</CardTitle>
          <CardDescription className="text-gray-600">
            Escolha seu tipo de usuário para começar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Seleção de tipo */}
            <div className="space-y-2">
              <Label className="font-semibold text-gray-900">Tipo de Conta *</Label>
              <div className="grid gap-2">
                {userTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition ${
                      formData.type === type.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={() => set("type", type.value)}
                      className="mr-3 accent-blue-600"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded ${type.color}`}>{type.icon}</div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* E-mail */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900">E-mail *</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => set("email", e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* ── Campos do Paciente ── */}
            {formData.type === "patient" && (
              <div className="space-y-3 pt-2 border-t">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Dados do Paciente
                </p>

                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-gray-900">Nome Completo *</Label>
                  <Input
                    id="nome"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={(e) => set("nome", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-gray-900">CPF *</Label>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => set("cpf", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-900">Telefone *</Label>
                    <Input
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idade" className="text-gray-900">Idade *</Label>
                    <Input
                      id="idade"
                      type="number"
                      placeholder="Ex: 30"
                      min={1}
                      max={130}
                      value={formData.idade}
                      onChange={(e) => set("idade", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Campos do Profissional ── */}
            {formData.type === "professional" && (
              <div className="space-y-3 pt-2 border-t">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Dados do Profissional
                </p>

                <div className="space-y-2">
                  <Label htmlFor="nomeProfissional" className="text-gray-900">Nome Completo *</Label>
                  <Input
                    id="nomeProfissional"
                    placeholder="Dr(a). Seu Nome"
                    value={formData.nomeProfissional}
                    onChange={(e) => set("nomeProfissional", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-gray-900">Especialização *</Label>
                  <Input
                    id="specialization"
                    placeholder="Ex: Cardiologia"
                    value={formData.specialization}
                    onChange={(e) => set("specialization", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="crm" className="text-gray-900">CRM *</Label>
                    <Input
                      id="crm"
                      placeholder="123456"
                      value={formData.crm}
                      onChange={(e) => set("crm", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneProfissional" className="text-gray-900">Telefone</Label>
                    <Input
                      id="phoneProfissional"
                      placeholder="(00) 00000-0000"
                      value={formData.phoneProfissional}
                      onChange={(e) => set("phoneProfissional", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/login")}
              disabled={isLoading}
            >
              Voltar ao Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}