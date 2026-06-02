"use client";

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Mail, Phone, User, CreditCard } from "lucide-react";

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-semibold">Perfil</h1>
        <p className="text-gray-600">Informações da sua conta</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-20">
              <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="mt-1">
                <Badge variant={user.type === "patient" ? "default" : "secondary"}>
                  {user.type === "patient" ? "Paciente" : "Profissional"}
                </Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Mail className="size-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">E-mail</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Phone className="size-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <CreditCard className="size-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">CPF</p>
                <p className="font-medium">{user.cpf}</p>
              </div>
            </div>

            {user.type === "professional" && user.specialization && (
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <User className="size-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Especialização</p>
                  <p className="font-medium">{user.specialization}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>Detalhes adicionais sobre sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo de Conta:</span>
              <span className="font-medium">
                {user.type === "patient" ? "Paciente" : "Profissional de Saúde"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Data de Cadastro:</span>
              <span className="font-medium">
                {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ID da Conta:</span>
              <span className="font-medium font-mono text-xs">{user.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
