"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Calendar, DollarSign, Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function PatientDashboard() {
  const { user } = useAuth();
  const { getPatientAppointments, getPatientPayments } = useData();
  const router = useRouter();

  const appointments = getPatientAppointments(user?.id || "");
  const payments = getPatientPayments(user?.id || "");

  const nextAppointment = appointments
    .filter((apt) => apt.status !== "cancelled" && apt.status !== "completed")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const pendingPayments = payments.filter((p) => p.status === "pending");
  const totalPending = pendingPayments.reduce((acc, p) => acc + p.value, 0);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      confirmed: { variant: "default", label: "Confirmado" },
      pending: { variant: "secondary", label: "Pendente" },
      cancelled: { variant: "destructive", label: "Cancelado" },
      completed: { variant: "outline", label: "Concluído" },
    };

    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo(a), {user?.nome}</p> {/* corrigido: name → nome */}
        </div>
        <Button onClick={() => router.push("/appointments/new")} className="gap-2">
          <Plus className="size-4" />
          Novo Agendamento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Próxima Consulta</CardTitle>
            <Calendar className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {nextAppointment ? (
              <>
                <div className="text-2xl font-semibold">
                  {format(new Date(nextAppointment.date), "dd/MM", { locale: ptBR })}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {nextAppointment.time} - {nextAppointment.professionalName}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Nenhuma consulta agendada</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
            <Clock className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{appointments.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              {appointments.filter((a) => a.status === "completed").length} concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <DollarSign className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              R$ {totalPending.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {pendingPayments.length} pagamento(s)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Agendamentos</CardTitle>
          <CardDescription>Suas últimas consultas agendadas</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="size-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Você ainda não tem consultas agendadas</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/appointments/new")}
              >
                Agendar Primeira Consulta
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profissional</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.slice(0, 5).map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {appointment.professionalName}
                      </TableCell>
                      <TableCell>
                        {format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status || "pending")}</TableCell>
                      <TableCell className="text-right">
                        R$ {(appointment.value ?? 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}