// services/cartService.ts
import { apiRequest } from './apiConfig';
import type { Cart } from '../types';

export const cartService = {
    async getCart(): Promise<Cart> {
        return apiRequest<Cart>('/carrito');
    },

    async addItem(productoId: number, cantidad: number = 1): Promise<{ ok: boolean; mensaje: string }> {
        return apiRequest<{ ok: boolean; mensaje: string }>('/carrito/items', {
            method: 'POST',
            body: JSON.stringify({ productoId, cantidad }),
        });
    },

    async updateItem(productoId: number, cantidad: number): Promise<{ ok: boolean; mensaje: string }> {
        return apiRequest<{ ok: boolean; mensaje: string }>(`/carrito/items/${productoId}`, {
            method: 'PUT',
            body: JSON.stringify({ cantidad }),
        });
    },

    async removeItem(productoId: number): Promise<{ ok: boolean; mensaje: string }> {
        return apiRequest<{ ok: boolean; mensaje: string }>(`/carrito/items/${productoId}`, {
            method: 'DELETE',
        });
    },

    async clearCart(): Promise<{ ok: boolean; mensaje: string }> {
        return apiRequest<{ ok: boolean; mensaje: string }>('/carrito', {
            method: 'DELETE',
        });
    },

    // LocalStorage backup for offline cart
    getLocalCart(): Cart {
        const cartStr = localStorage.getItem('pokestore_cart');
        return cartStr ? JSON.parse(cartStr) : { items: [], subtotal: 0, envio: 0, total: 0 };
    },

    setLocalCart(cart: Cart): void {
        localStorage.setItem('pokestore_cart', JSON.stringify(cart));
    },

    clearLocalCart(): void {
        localStorage.removeItem('pokestore_cart');
    },

    getCartItemCount(): number {
        const cart = this.getLocalCart();
        return cart.items.reduce((sum, item) => sum + item.cantidad, 0);
    },
};
