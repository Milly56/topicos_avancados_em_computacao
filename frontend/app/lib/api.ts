const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Paciente {
  id: string;
  email: string;
  nome: string;
  telefone: string;
  idade: number;
}

export interface Profissional {
  id: string;
  email: string;
  nome: string;
  especialidade: string;
  telefone: string;
}

export interface Agendamento {
  id: number;
  pacienteId: string;
  profissionalId: string;
  data: string;
  horario: string;
  paciente?: Paciente;
  profissional?: Profissional;
}

export interface CreateAgendamentoDto {
  pacienteId: string;
  profissionalId: string;
  data: string;
  horario: string;
}

export const api = {
  async findPacienteByEmail(email: string): Promise<Paciente | null> {
    const response = await fetch(
      `${API_URL}/pacientes/email/${encodeURIComponent(email)}`
    );
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Erro ao buscar paciente');
    return response.json();
  },

  async createPaciente(data: {
    email: string;
    nome: string;
    telefone: string;
    idade: number;
  }): Promise<Paciente> {
    const response = await fetch(`${API_URL}/pacientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erro ao criar paciente');
    }
    return response.json();
  },

  async findProfissionalByEmail(email: string): Promise<Profissional | null> {
    const response = await fetch(
      `${API_URL}/profissionais/email/${encodeURIComponent(email)}`
    );
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Erro ao buscar profissional');
    return response.json();
  },

  async createProfissional(data: {
    email: string;
    nome: string;
    especialidade: string;
    telefone: string;
  }): Promise<Profissional> {
    const response = await fetch(`${API_URL}/profissionais`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erro ao criar profissional');
    }
    return response.json();
  },

  async listProfissionais(): Promise<Profissional[]> {
    const response = await fetch(`${API_URL}/profissionais`);
    if (!response.ok) throw new Error('Erro ao listar profissionais');
    return response.json();
  },

  async listAgendamentos(): Promise<Agendamento[]> {
    const response = await fetch(`${API_URL}/agendamentos`);
    if (!response.ok) throw new Error('Erro ao listar agendamentos');
    return response.json();
  },

  async createAgendamento(data: CreateAgendamentoDto): Promise<Agendamento> {
    const response = await fetch(`${API_URL}/agendamentos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Erro ao criar agendamento');
    }
    return response.json();
  },

  async cancelAgendamento(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/agendamentos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao cancelar agendamento');
  },
};