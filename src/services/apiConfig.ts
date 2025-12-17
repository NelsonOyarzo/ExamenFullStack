// services/apiConfig.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('pokestore_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('pokestore_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('pokestore_token');
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

export default API_BASE_URL;
