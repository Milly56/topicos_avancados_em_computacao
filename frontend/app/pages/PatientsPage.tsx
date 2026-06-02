"use client";

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Users, Search } from "lucide-react";

export function PatientsPage() {
  const { user } = useAuth();
  const { getProfessionalAppointments } = useData();
  const [searchTerm, setSearchTerm] = useState("");

  const appointments = getProfessionalAppointments(user?.id || "");

  const uniquePatients = Array.from(
    new Map(
      appointments.map((apt) => [
        apt.patientId,
        {
          id: apt.patientId,
          name: apt.patientName,
          lastVisit: apt.date,
          totalAppointments: appointments.filter((a) => a.patientId === apt.patientId).length,
          status: apt.status,
        },
      ])
    ).values()
  );

  const filteredPatients = uniquePatients.filter((patient) =>
    (patient.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Pacientes</h1>
          <p className="text-gray-600">Gerencie seus pacientes e histórico de atendimentos</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
              <Users className="size-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{uniquePatients.length}</div>
              <p className="text-xs text-gray-600 mt-1">Pacientes únicos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos Realizados</CardTitle>
              <Users className="size-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {appointments.filter((a) => a.status === "completed").length}
              </div>
              <p className="text-xs text-gray-600 mt-1">Consultas finalizadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
              <Users className="size-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {
                  uniquePatients.filter((p) => {
                    const lastVisit = new Date(p.lastVisit);
                    const now = new Date();
                    const diffDays = Math.floor(
                      (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return diffDays <= 90;
                  }).length
                }
              </div>
              <p className="text-xs text-gray-600 mt-1">Últimos 90 dias</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Pacientes</CardTitle>
            <CardDescription>Busque e visualize informações dos pacientes</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="size-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="size-12">
                      <AvatarFallback>{getInitials(patient.name || "")}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{patient.name}</p>
                      <p className="text-sm text-gray-600">
                        Última consulta:{" "}
                        {new Date(patient.lastVisit).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {patient.totalAppointments} consulta(s)
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}