const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: 'PACIENTE' | 'PROFISSIONAL' | 'ADMIN';
  };
}

export interface RegisterResponse {
  id: string;
  email: string;
  role: 'PACIENTE' | 'PROFISSIONAL' | 'ADMIN';
}

// Modo mock desativado - usando APIs reais
const MOCK_MODE = false;

const mockUsers: Map<string, { password: string; role: 'PACIENTE' | 'PROFISSIONAL' | 'ADMIN' }> = new Map();

export const api = {
  async login(email: string, password: string): Promise<LoginResponse> {
    if (MOCK_MODE) {
      // Mock login - simula comportamento do backend
      if (!mockUsers.has(email)) {
        throw new Error('Email não encontrado');
      }
      const user = mockUsers.get(email);
      if (user?.password !== password) {
        throw new Error('Senha incorreta');
      }
      return {
        access_token: `mock_token_${Date.now()}`,
        user: {
          id: `user_${Date.now()}`,
          email,
          role: user.role,
        },
      };
    }

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao fazer login');
    }

    return response.json();
  },

  async register(email: string, password: string, role: 'PACIENTE' | 'PROFISSIONAL' | 'ADMIN'): Promise<RegisterResponse> {
    if (MOCK_MODE) {
      // Mock register - simula comportamento do backend
      if (mockUsers.has(email)) {
        throw new Error('Email já cadastrado');
      }
      mockUsers.set(email, { password, role });
      return {
        id: `user_${Date.now()}`,
        email,
        role,
      };
    }

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao registrar');
    }

    return response.json();
  },
};
