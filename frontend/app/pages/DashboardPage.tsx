"use client";

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { DashboardLayout } from "../layouts/DashboardLayout"; 
import { PatientDashboard } from "./PatientDashboard";
import { ProfessionalDashboard } from "./ProfessionalDashboard";

export function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardLayout>
      {user.role === "PACIENTE" ? <PatientDashboard /> : <ProfessionalDashboard />}
    </DashboardLayout>
  );
}