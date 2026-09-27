"use client";

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function PaymentsPage() {
  const { user } = useAuth();
  const { getPatientPayments, getProfessionalPayments } = useData();

  const isPatient = user?.role === "PACIENTE";
  const payments = isPatient
    ? getPatientPayments(user?.id || "")
    : getProfessionalPayments(user?.id || "");

  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((acc, p) => acc + p.value, 0);

  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((acc, p) => acc + p.value, 0);

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyTotal = payments
    .filter((p) => {
      const paymentDate = new Date(p.date);
      return (
        paymentDate.getMonth() === thisMonth &&
        paymentDate.getFullYear() === thisYear &&
        p.status === "paid"
      );
    })
    .reduce((acc, p) => acc + p.value, 0);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary"; label: string }> = {
      paid: { variant: "default", label: "Pago" },
      pending: { variant: "secondary", label: "Pendente" },
    };

    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">
            {isPatient ? "Pagamentos" : "Financeiro"}
          </h1>
          <p className="text-gray-600">
            {isPatient
              ? "Visualize seu histórico de pagamentos"
              : "Acompanhe seus ganhos e receitas"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {isPatient ? "Total Pago" : "Total Recebido"}
              </CardTitle>
              <DollarSign className="size-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">R$ {totalPaid.toFixed(2)}</div>
              <p className="text-xs text-gray-600 mt-1">
                {payments.filter((p) => p.status === "paid").length} pagamento(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {isPatient ? "Pendentes" : "A Receber"}
              </CardTitle>
              <CreditCard className="size-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">R$ {totalPending.toFixed(2)}</div>
              <p className="text-xs text-gray-600 mt-1">
                {payments.filter((p) => p.status === "pending").length} pagamento(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {isPatient ? "Gasto do Mês" : "Ganhos do Mês"}
              </CardTitle>
              <TrendingUp className="size-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">R$ {monthlyTotal.toFixed(2)}</div>
              <p className="text-xs text-gray-600 mt-1">
                {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico Financeiro</CardTitle>
            <CardDescription>
              {sortedPayments.length} transação(ões) no total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedPayments.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="size-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma transação encontrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>{isPatient ? "Profissional" : "Paciente"}</TableHead>
                      <TableHead>Forma de Pagamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {format(new Date(payment.date), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {isPatient ? payment.professionalId : payment.patientId}
                        </TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right font-semibold">
                          R$ {payment.value.toFixed(2)}
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
    </DashboardLayout>
  );
}