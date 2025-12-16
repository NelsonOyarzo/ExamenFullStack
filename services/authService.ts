// services/authService.ts
import { apiRequest, setAuthToken, removeAuthToken } from './apiConfig';
import type { AuthResponse, User } from '../types';

export const authService = {
  async register(data: {
    nombre: string;
    run: string;
    correo: string;
    contrasena: string;
    telefono?: string;
  }): Promise<User> {
    return apiRequest<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(correo: string, contrasena: string): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo, contrasena }),
    });
    setAuthToken(response.token);
    return response;
  },

  async getProfile(): Promise<User> {
    return apiRequest<User>('/auth/profile');
  },

  async updateProfile(data: {
    nombre?: string;
    telefono?: string;
    direccion?: any;
  }): Promise<User> {
    return apiRequest<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  logout(): void {
    removeAuthToken();
    localStorage.removeItem('pokestore_user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('pokestore_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser(user: User): void {
    localStorage.setItem('pokestore_user', JSON.stringify(user));
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('pokestore_token');
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.rol === 'Administrador';
  },
};
