// services/userService.ts
import { apiRequest } from './apiConfig';
import type { User } from '../types';

export const userService = {
    async getUsers(): Promise<User[]> {
        return apiRequest<User[]>('/users');
    },

    async getUserById(id: number): Promise<User> {
        return apiRequest<User>(`/users/${id}`);
    },

    async createUser(user: Omit<User, 'id'> & { contrasena: string }): Promise<User> {
        return apiRequest<User>('/users', {
            method: 'POST',
            body: JSON.stringify(user),
        });
    },

    async updateUser(id: number, user: Partial<User>): Promise<User> {
        return apiRequest<User>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(user),
        });
    },

    async deleteUser(id: number): Promise<void> {
        return apiRequest<void>(`/users/${id}`, {
            method: 'DELETE',
        });
    }
};
