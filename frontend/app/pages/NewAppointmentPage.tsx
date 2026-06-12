"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { api, Profissional } from "../lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { toast } from "sonner";
import { ArrowLeft, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AVAILABLE_TIMES = [
  "08:00", "09:00", "10:00", "11:00",
  "14:00", "15:00", "16:00", "17:00",
];

export function NewAppointmentPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loadingProfs, setLoadingProfs] = useState(true);
  const [selectedProfissional, setSelectedProfissional] = useState<Profissional | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.listProfissionais()
      .then(setProfissionais)
      .catch(() => toast.error("Erro ao carregar profissionais"))
      .finally(() => setLoadingProfs(false));
  }, []);

  function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }

  async function handleConfirm() {
    if (!selectedProfissional || !selectedDate || !selectedTime || !user) {
      toast.error("Por favor, complete todos os passos");
      return;
    }

    setSubmitting(true);
    try {
      await api.createAgendamento({
        pacienteId: user.id,
        profissionalId: selectedProfissional.id,
        data: selectedDate.toISOString(),
        horario: selectedTime,
      });
      toast.success("Agendamento realizado com sucesso!");
      router.push("/appointments");
    } catch (err: any) {
      console.error("Erro ao criar agendamento:", err);
      toast.error(err?.message || "Erro ao criar agendamento");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/appointments")}>
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Novo Agendamento</h1>
          <p className="text-gray-500">Escolha um profissional, data e horário</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full transition-colors ${
              s <= step ? "bg-blue-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50">
            <CardTitle className="text-gray-900">Escolha um Profissional</CardTitle>
            <CardDescription className="text-gray-500">
              Selecione o profissional que deseja consultar
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 p-6">
            {loadingProfs ? (
              <p className="text-gray-500 col-span-2 text-center py-8">Carregando profissionais...</p>
            ) : profissionais.length === 0 ? (
              <p className="text-gray-500 col-span-2 text-center py-8">Nenhum profissional disponível</p>
            ) : (
              profissionais.map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => { setSelectedProfissional(prof); setStep(2); }}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                >
                  <Avatar className="size-12 bg-blue-100">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {getInitials(prof.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{prof.nome}</p>
                    <p className="text-sm text-gray-500">{prof.especialidade}</p>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50">
            <CardTitle className="text-gray-900">Escolha a Data</CardTitle>
            <CardDescription className="text-gray-500">
              Selecione o dia da sua consulta
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => { setSelectedDate(date); if (date) setStep(3); }}
              disabled={(date: Date) =>
                date < new Date() || date.getDay() === 0 || date.getDay() === 6
              }
              className="rounded-md border border-gray-200"
              formatters={{
                formatCaption: (month) =>
                  format(month, "MMMM yyyy", { locale: ptBR }),
                formatWeekdayName: (day) =>
                  format(day, "EEE", { locale: ptBR }),
              }}
            />
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 bg-gray-50">
              <CardTitle className="text-gray-900">Escolha o Horário</CardTitle>
              <CardDescription className="text-gray-500">
                Selecione o horário disponível
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AVAILABLE_TIMES.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-4 border rounded-lg font-medium transition-all ${
                      selectedTime === time
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    <Clock className="size-4 mx-auto mb-1" />
                    {time}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedTime && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100 bg-gray-50">
                <CardTitle className="text-gray-900">Resumo do Agendamento</CardTitle>
                <CardDescription className="text-gray-500">
                  Confirme os dados da sua consulta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Profissional:</span>
                    <span className="font-medium text-gray-900">{selectedProfissional?.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Especialidade:</span>
                    <span className="font-medium text-gray-900">{selectedProfissional?.especialidade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Data:</span>
                    <span className="font-medium text-gray-900">
                      {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Horário:</span>
                    <span className="font-medium text-gray-900">{selectedTime}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {submitting ? "Confirmando..." : "Confirmar Agendamento"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}