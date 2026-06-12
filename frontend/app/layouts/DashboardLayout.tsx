"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const patientMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Agendamentos", path: "/appointments" },
    { icon: CreditCard, label: "Pagamentos", path: "/payments" },
    { icon: User, label: "Perfil", path: "/profile" },
    { icon: Settings, label: "Configurações", path: "/settings" },
  ];

  const professionalMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Agendamentos", path: "/appointments" },
    { icon: Users, label: "Pacientes", path: "/patients" },
    { icon: CreditCard, label: "Financeiro", path: "/payments" },
    { icon: User, label: "Perfil", path: "/profile" },
    { icon: Settings, label: "Configurações", path: "/settings" },
  ];

  const menuItems = user?.role === "PACIENTE" ? patientMenuItems : professionalMenuItems;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
            <h1 className="font-semibold text-lg">Agendamentos Médicos</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{user?.nome}</p>
              <p className="text-xs text-gray-500">
                {user?.role === "PACIENTE" ? "Paciente" : "Profissional"}
              </p>
            </div>
            <Avatar>
              <AvatarFallback>
                {user?.nome ? getInitials(user.nome) : "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200">
        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <item.icon className="size-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="size-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside
            className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex-1 px-3 py-6 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <item.icon className="size-5" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="p-3 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="size-5" />
                Sair
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}