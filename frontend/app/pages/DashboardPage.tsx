import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { PatientDashboard } from "./PatientDashboard";
import { ProfessionalDashboard } from "./ProfessionalDashboard";

export function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return user.type === "patient" ? <PatientDashboard /> : <ProfessionalDashboard />;
}
