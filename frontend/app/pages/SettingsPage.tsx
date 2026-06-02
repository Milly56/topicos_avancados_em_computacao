import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Settings } from "lucide-react";

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-semibold">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências do sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>Configure como você deseja receber notificações</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Notificações por E-mail</Label>
              <p className="text-sm text-gray-600">
                Receba atualizações sobre agendamentos por e-mail
              </p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">Notificações por SMS</Label>
              <p className="text-sm text-gray-600">
                Receba lembretes de consultas por mensagem de texto
              </p>
            </div>
            <Switch id="sms-notifications" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing">E-mails Promocionais</Label>
              <p className="text-sm text-gray-600">
                Receba novidades e ofertas especiais
              </p>
            </div>
            <Switch id="marketing" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
          <CardDescription>Personalize sua experiência no sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-confirm">Auto-confirmação de Agendamentos</Label>
              <p className="text-sm text-gray-600">
                Confirmar automaticamente novos agendamentos
              </p>
            </div>
            <Switch id="auto-confirm" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="calendar-sync">Sincronizar com Calendário</Label>
              <p className="text-sm text-gray-600">
                Adicionar agendamentos ao seu calendário pessoal
              </p>
            </div>
            <Switch id="calendar-sync" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacidade e Segurança</CardTitle>
          <CardDescription>Controle suas configurações de privacidade</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="profile-visibility">Perfil Visível</Label>
              <p className="text-sm text-gray-600">
                Permitir que outros usuários vejam seu perfil
              </p>
            </div>
            <Switch id="profile-visibility" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-sharing">Compartilhar Dados Anônimos</Label>
              <p className="text-sm text-gray-600">
                Ajudar a melhorar o sistema compartilhando dados de uso
              </p>
            </div>
            <Switch id="data-sharing" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
