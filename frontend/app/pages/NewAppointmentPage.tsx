"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Calendar } from "../components/ui/calendar";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { toast } from "sonner";
import { ArrowLeft, Clock, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AVAILABLE_TIMES = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const APPOINTMENT_VALUE = 200;

export function NewAppointmentPage() {
  const { user } = useAuth();
  const { professionals, createAppointment } = useData();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleProfessionalSelect = (profId: string) => {
    setSelectedProfessional(profId);
    setStep(2);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setStep(3);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (!selectedProfessional || !selectedDate || !selectedTime || !user) {
      toast.error("Por favor, complete todos os passos");
      return;
    }

    const professional = professionals.find((p) => p.id === selectedProfessional);

    if (!professional) {
      toast.error("Profissional não encontrado");
      return;
    }

    createAppointment({
      patientId: user.id,
      patientName: user.name,
      professionalId: professional.id,
      professionalName: professional.name,
      date: selectedDate.toISOString(),
      time: selectedTime,
      status: "pending",
      value: APPOINTMENT_VALUE,
    });

    toast.success("Agendamento realizado com sucesso!");
    router.push("/dashboard");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}> 
          <ArrowLeft className="size-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold">Novo Agendamento</h1>
          <p className="text-gray-600">Escolha um profissional, data e horário</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full ${
              s <= step ? "bg-blue-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Escolha um Profissional</CardTitle>
            <CardDescription>Selecione o profissional que deseja consultar</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {professionals.map((prof) => (
              <button
                key={prof.id}
                onClick={() => handleProfessionalSelect(prof.id)}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <Avatar className="size-12">
                  <AvatarFallback>{getInitials(prof.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{prof.name}</p>
                  <p className="text-sm text-gray-600">{prof.specialization}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Escolha a Data</CardTitle>
            <CardDescription>Selecione o dia da sua consulta</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date: Date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
              className="rounded-md border"
              locale={ptBR}
            />
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Escolha o Horário</CardTitle>
              <CardDescription>Selecione o horário disponível</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AVAILABLE_TIMES.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`p-4 border rounded-lg font-medium transition-all ${
                      selectedTime === time
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-50"
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
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Agendamento</CardTitle>
                <CardDescription>Confirme os dados da sua consulta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profissional:</span>
                    <span className="font-medium">
                      {professionals.find((p) => p.id === selectedProfessional)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Especialidade:</span>
                    <span className="font-medium">
                      {professionals.find((p) => p.id === selectedProfessional)?.specialization}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-medium">
                      {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horário:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-gray-600">Valor:</span>
                    <span className="font-semibold text-lg">
                      R$ {APPOINTMENT_VALUE.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Voltar
                  </Button>
                  <Button onClick={handleConfirm} className="flex-1">
                    Confirmar Agendamento
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
