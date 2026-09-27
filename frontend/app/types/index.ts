export type UserType = "patient" | "professional" | "admin";

export type AppointmentStatus = "confirmed" | "pending" | "cancelled" | "completed";

export type PaymentStatus = "paid" | "pending";

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  type: UserType;
  specialization?: string;
  crm?: string;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  value: number;
  notes?: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  professionalId: string;
  value: number;
  status: PaymentStatus;
  paymentMethod: string;
  date: string;
  createdAt: Date;
}

export interface AvailableSlot {
  time: string;
  available: boolean;
}

export interface Professional {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  avatar?: string;
}
