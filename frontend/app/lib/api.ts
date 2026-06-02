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
};