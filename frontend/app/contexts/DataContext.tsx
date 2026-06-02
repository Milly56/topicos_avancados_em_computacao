"use client";

import React, { createContext, useContext, useState } from "react";

type Appointment = {
  id: string;
  date: string; // ISO date
  time?: string;
  patientId?: string;
  patientName?: string;
  professionalId?: string;
  professionalName?: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  value?: number;
};

type Payment = {
  id: string;
  date: string;
  value: number;
  status: "paid" | "pending" | "failed";
  professionalId?: string;
  patientId?: string;
  paymentMethod?: string;
};

type DataContextValue = {
  appointments: Appointment[];
  patients: Array<{ id: string; name: string }>;
  professionals: Array<{ id: string; name: string; specialization?: string }>;
  payments: Payment[];
  createAppointment: (a: Partial<Appointment>) => Promise<Appointment>;
  cancelAppointment: (id: string) => Promise<void>;
  getPatientAppointments: (patientId: string) => Appointment[];
  getProfessionalAppointments: (professionalId: string) => Appointment[];
  getProfessionalPayments: (professionalId: string) => Payment[];
  getPatientPayments: (patientId: string) => Payment[];
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(() => [
    {
      id: "a1",
      date: new Date().toISOString(),
      time: "10:00",
      patientId: "p1",
      patientName: "Paciente Teste",
      professionalId: "pr1",
      professionalName: "Dr. Silva",
      status: "confirmed",
      value: 120,
    },
  ]);

  const [payments, setPayments] = useState<Payment[]>(() => [
    { id: "pay1", date: new Date().toISOString(), value: 120, status: "paid", professionalId: "pr1", patientId: "p1" },
  ]);
  const [patients] = useState(() => [{ id: "p1", name: "Paciente Teste" }]);
  const [professionals] = useState(() => [
    { id: "pr1", name: "Dr. Silva", specialization: "Clínica Geral" },
    { id: "pr2", name: "Dra. Pereira", specialization: "Cardiologia" },
  ] as Array<{ id: string; name: string; specialization?: string }>);

  async function createAppointment(a: Partial<Appointment>) {
    const item: Appointment = {
      id: String(Date.now()),
      date: a.date || new Date().toISOString(),
      time: a.time,
      patientId: a.patientId,
      patientName: a.patientName,
      professionalId: a.professionalId,
      professionalName: a.professionalName,
      status: a.status || "pending",
      value: a.value,
    };
    setAppointments((s) => [item, ...s]);
    return item;
  }

  async function cancelAppointment(id: string) {
    setAppointments((s) => s.map((x) => (x.id === id ? { ...x, status: "cancelled" } : x)));
  }

  function getPatientAppointments(patientId: string) {
    if (!patientId) return appointments;
    return appointments.filter((a) => a.patientId === patientId);
  }

  function getProfessionalAppointments(professionalId: string) {
    if (!professionalId) return appointments;
    return appointments.filter((a) => a.professionalId === professionalId);
  }

  function getProfessionalPayments(professionalId: string) {
    if (!professionalId) return payments;
    return payments.filter((p) => p.professionalId === professionalId);
  }

  function getPatientPayments(patientId: string) {
    if (!patientId) return payments;
    return payments.filter((p) => p.patientId === patientId);
  }

  function updateAppointmentStatus(id: string, status: Appointment["status"]) {
    setAppointments((s) => s.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  return (
    <DataContext.Provider
      value={{
        appointments,
        patients,
        professionals,
        payments,
        createAppointment,
        cancelAppointment,
        getPatientAppointments,
        getProfessionalAppointments,
        getProfessionalPayments,
        getPatientPayments,
        updateAppointmentStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

export default DataProvider;
