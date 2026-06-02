import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Calendar, Plus, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export function AppointmentsPage() {
  const { user } = useAuth();
  const { getPatientAppointments, getProfessionalAppointments, cancelAppointment } = useData();
  const router = useRouter();

  const isPatient = user?.type === "patient";
  const appointments = isPatient
    ? getPatientAppointments(user?.id || "")
    : getProfessionalAppointments(user?.id || "");

  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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

  const handleCancel = (id: string) => {
    if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
      cancelAppointment(id);
      toast.success("Agendamento cancelado com sucesso");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Agendamentos</h1>
          <p className="text-gray-600">
            {isPatient ? "Gerencie suas consultas" : "Visualize seus atendimentos"}
          </p>
        </div>
        {isPatient && (
          <Button onClick={() => router.push("/appointments/new")} className="gap-2">
            <Plus className="size-4" />
            Novo Agendamento
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Agendamentos</CardTitle>
          <CardDescription>
            {sortedAppointments.length} agendamento(s) no total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="size-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {isPatient
                  ? "Você ainda não tem consultas agendadas"
                  : "Nenhum agendamento encontrado"}
              </p>
              {isPatient && (
                <Button
                  variant="outline"
                  className="mt-4"
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
                  <TableRow>
                    <TableHead>{isPatient ? "Profissional" : "Paciente"}</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    {isPatient && <TableHead className="text-right">Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {isPatient ? appointment.professionalName : appointment.patientName}
                      </TableCell>
                      <TableCell>
                        {format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="text-right">
                        R$ {appointment.value.toFixed(2)}
                      </TableCell>
                      {isPatient && (
                        <TableCell className="text-right">
                          {(appointment.status === "pending" || appointment.status === "confirmed") && (
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
  );
}
