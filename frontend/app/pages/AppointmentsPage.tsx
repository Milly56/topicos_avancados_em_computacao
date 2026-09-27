"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { api, Agendamento } from "../lib/api";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Calendar, Plus, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export function AppointmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const isPatient = user?.role === "PACIENTE";

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await api.listAgendamentos();
        console.log("user.id:", user?.id);
        console.log("todos agendamentos profissionalId:", all.map(a => a.profissionalId));
        const filtered = isPatient
          ? all.filter((a) => a.pacienteId === user?.id)
          : all.filter((a) => a.profissionalId === user?.id);
        setAgendamentos(
          filtered.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        );
      } catch {
        toast.error("Erro ao carregar agendamentos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function handleCancel(id: number) {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;
    try {
      await api.cancelAgendamento(id);
      setAgendamentos((prev) => prev.filter((a) => a.id !== id));
      toast.success("Agendamento cancelado com sucesso");
    } catch {
      toast.error("Erro ao cancelar agendamento");
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Agendamentos</h1>
            <p className="text-gray-500 mt-1">
              {isPatient ? "Gerencie suas consultas" : "Visualize seus atendimentos"}
            </p>
          </div>
          {isPatient && (
            <Button
              onClick={() => router.push("/appointments/new")}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="size-4" />
              Novo Agendamento
            </Button>
          )}
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50 rounded-t-lg">
            <CardTitle className="text-gray-900">Todos os Agendamentos</CardTitle>
            <CardDescription className="text-gray-500">
              {loading ? "Carregando..." : `${agendamentos.length} agendamento(s) no total`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Carregando agendamentos...</div>
            ) : agendamentos.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="size-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  {isPatient
                    ? "Você ainda não tem consultas agendadas"
                    : "Nenhum agendamento encontrado"}
                </p>
                {isPatient && (
                  <Button
                    variant="outline"
                    className="mt-4 border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => router.push("/appointments/new")}
                  >
                    Agendar Consulta
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-gray-700 font-semibold">
                        {isPatient ? "Profissional" : "Paciente"}
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold">Data</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Horário</TableHead>
                      {isPatient && (
                        <TableHead className="text-gray-700 font-semibold text-right">
                          Ações
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agendamentos.map((agendamento, idx) => (
                      <TableRow
                        key={agendamento.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <TableCell className="font-medium text-gray-900">
                          {isPatient
                            ? agendamento.profissional?.nome ?? agendamento.profissionalId
                            : agendamento.paciente?.nome ?? agendamento.pacienteId}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {format(new Date(agendamento.data), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-gray-700">{agendamento.horario}</TableCell>
                        {isPatient && (
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancel(agendamento.id)}
                              className="gap-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                            >
                              <XCircle className="size-3" />
                              Cancelar
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}