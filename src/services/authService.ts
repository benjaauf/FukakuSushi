const API_BASE_URL = 'http://localhost:3000';

export interface LoginResponse {
  mensaje: string;
  nombre: string;
  email: string;
  rut?: string;
  rol?: string;
  tipo: 'cliente' | 'trabajador';
}

export interface LoginError {
  error: string;
}

export const authService = {
  async loginCliente(email: string, contraseña: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/clientes/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, contraseña }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error en el inicio de sesión');
    }

    return data;
  },

  async loginTrabajador(email: string, contraseña: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/trabajadores/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, contraseña }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error en el inicio de sesión');
    }

    return data;
  },

  // Función para determinar automáticamente si es cliente o trabajador
  async login(email: string, contraseña: string): Promise<LoginResponse> {
    try {
      // Primero intentar como cliente
      return await this.loginCliente(email, contraseña);
    } catch (error) {
      // Si falla como cliente, intentar como trabajador
      try {
        return await this.loginTrabajador(email, contraseña);
      } catch (trabajadorError) {
        // Si ambos fallan, lanzar el error del cliente
        throw error;
      }
    }
  }
}; 