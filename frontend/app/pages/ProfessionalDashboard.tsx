"use client";

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Calendar, DollarSign, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

export function ProfessionalDashboard() {
  const { user } = useAuth();
  const { getProfessionalAppointments, getProfessionalPayments, updateAppointmentStatus } = useData();

  const appointments = getProfessionalAppointments(user?.id || "");
  const payments = getProfessionalPayments(user?.id || "");

  const todayAppointments = appointments.filter((apt) =>
    isToday(new Date(apt.date)) && apt.status !== "cancelled"
  );

  const uniquePatients = new Set(appointments.map((apt) => apt.patientId));

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyEarnings = payments
    .filter((p) => {
      const paymentDate = new Date(p.date);
      return (
        paymentDate.getMonth() === thisMonth &&
        paymentDate.getFullYear() === thisYear &&
        p.status === "paid"
      );
    })
    .reduce((acc, p) => acc + p.value, 0);

  const upcomingAppointments = appointments
    .filter((apt) => apt.status === "confirmed" || apt.status === "pending")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

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

  const handleConfirm = (id: string) => {
    updateAppointmentStatus(id, "confirmed");
  };

  const handleCancel = (id: string) => {
    updateAppointmentStatus(id, "cancelled");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo(a), {user?.name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
            <Calendar className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{todayAppointments.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              {todayAppointments.filter((a) => a.status === "confirmed").length} confirmadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Atendidos</CardTitle>
            <Users className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{uniquePatients.size}</div>
            <p className="text-xs text-gray-600 mt-1">Total de pacientes únicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ganhos do Mês</CardTitle>
            <DollarSign className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">R$ {monthlyEarnings.toFixed(2)}</div>
            <p className="text-xs text-gray-600 mt-1">
              {payments.filter((p) => p.status === "paid").length} pagamentos recebidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Próximos Atendimentos</CardTitle>
            <Clock className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{upcomingAppointments.length}</div>
            <p className="text-xs text-gray-600 mt-1">Agendamentos confirmados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Atendimentos</CardTitle>
          <CardDescription>Gerencie suas consultas agendadas</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="size-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum atendimento agendado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {appointment.patientName}
                      </TableCell>
                      <TableCell>
                        {format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status || "pending")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {appointment.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleConfirm(appointment.id)}
                                className="gap-1"
                              >
                                <CheckCircle className="size-3" />
                                Confirmar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancel(appointment.id)}
                                className="gap-1 text-red-600 hover:text-red-700"
                              >
                                <XCircle className="size-3" />
                                Cancelar
                              </Button>
                            </>
                          )}
                          {appointment.status === "confirmed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancel(appointment.id)}
                              className="gap-1 text-red-600 hover:text-red-700"
                            >
                              <XCircle className="size-3" />
                              Cancelar
                            </Button>
                          )}
                        </div>
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

export default ProfessionalDashboard;
