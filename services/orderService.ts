// services/orderService.ts
import { apiRequest } from './apiConfig';
import type { Order, CreateOrderDto, AdminStats } from '../types';

export const orderService = {
    async getOrders(): Promise<Order[]> {
        return apiRequest<Order[]>('/ordenes');
    },

    async getOrderById(id: string): Promise<Order> {
        return apiRequest<Order>(`/ordenes/${id}`);
    },

    async createOrder(orderData: CreateOrderDto): Promise<Order> {
        return apiRequest<Order>('/ordenes', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    // Admin endpoints
    async getAllOrders(estado?: string): Promise<Order[]> {
        const query = estado ? `?estado=${estado}` : '';
        return apiRequest<Order[]>(`/admin/ordenes${query}`);
    },

    async updateOrderStatus(id: string, estado: string): Promise<Order> {
        return apiRequest<Order>(`/admin/ordenes/${id}/estado`, {
            method: 'PATCH',
            body: JSON.stringify({ estado }),
        });
    },

    async getAdminStats(): Promise<AdminStats> {
        return apiRequest<AdminStats>('/admin/stats');
    },

    // Helper methods
    getEstadosOrden(): string[] {
        return ['Pendiente', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado'];
    },

    formatPrice(price: number): string {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(price);
    },

    formatDate(timestamp: number): string {
        return new Date(timestamp).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    },
};
