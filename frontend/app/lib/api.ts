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

export const api = {
  async login(email: string, password: string): Promise<LoginResponse> {
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
