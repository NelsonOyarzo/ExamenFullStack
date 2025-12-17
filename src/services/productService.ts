// services/productService.ts
import { apiRequest } from './apiConfig';
import type { Producto, ProductFilters, CreateProductDto, UpdateProductDto } from '../types';

export const productService = {
    async getProducts(filters?: ProductFilters): Promise<Producto[]> {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });
        }
        const query = params.toString();
        return apiRequest<Producto[]>(`/productos${query ? `?${query}` : ''}`);
    },

    async getProductById(id: number): Promise<Producto> {
        return apiRequest<Producto>(`/productos/${id}`);
    },

    async createProduct(product: CreateProductDto): Promise<Producto> {
        return apiRequest<Producto>('/productos', {
            method: 'POST',
            body: JSON.stringify(product),
        });
    },

    async updateProduct(id: number, data: UpdateProductDto): Promise<Producto> {
        return apiRequest<Producto>(`/productos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    async updateStock(id: number, stock: number): Promise<Producto> {
        return apiRequest<Producto>(`/productos/${id}/stock`, {
            method: 'PATCH',
            body: JSON.stringify({ stock }),
        });
    },

    async deleteProduct(id: number): Promise<void> {
        return apiRequest<void>(`/productos/${id}`, {
            method: 'DELETE',
        });
    },

    // Helper methods
    getRarezas(): string[] {
        return [
            'Common',
            'Uncommon',
            'Rare',
            'Rare Holo',
            'Rare Holo V',
            'Rare Holo VMAX',
            'Rare Holo VSTAR',
            'Ultra Rare',
            'Secret Rare',
            'Rainbow Rare',
        ];
    },

    getTipos(): string[] {
        return [
            'Grass',
            'Fire',
            'Water',
            'Lightning',
            'Electric',
            'Psychic',
            'Fighting',
            'Darkness',
            'Metal',
            'Dragon',
            'Fairy',
            'Colorless',
        ];
    },

    getEstados(): string[] {
        return ['Nuevo', 'Usado - Mint', 'Usado - Near Mint', 'Usado - Lightly Played'];
    },

    getIdiomas(): string[] {
        return ['Español', 'Inglés', 'Japonés'];
    },
};
