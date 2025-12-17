// context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';
import type { Cart } from '../types';

interface CartContextType {
    cart: Cart;
    loading: boolean;
    refreshCart: () => Promise<void>;
    addToCart: (productoId: number, cantidad?: number) => Promise<void>;
    updateQuantity: (productoId: number, cantidad: number) => Promise<void>;
    removeFromCart: (productoId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, envio: 0, total: 0 });
    const [loading, setLoading] = useState(false);

    const refreshCart = async () => {
        if (!authService.isAuthenticated()) {
            const localCart = cartService.getLocalCart();
            setCart(localCart);
            return;
        }

        try {
            setLoading(true);
            const data = await cartService.getCart();
            setCart(data);
            cartService.setLocalCart(data);
        } catch (error) {
            console.error('Error loading cart:', error);
            const localCart = cartService.getLocalCart();
            setCart(localCart);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productoId: number, cantidad: number = 1) => {
        try {
            setLoading(true);
            await cartService.addItem(productoId, cantidad);
            await refreshCart();
        } catch (error: any) {
            throw new Error(error.message || 'Error al agregar al carrito');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productoId: number, cantidad: number) => {
        try {
            setLoading(true);
            await cartService.updateItem(productoId, cantidad);
            await refreshCart();
        } catch (error: any) {
            throw new Error(error.message || 'Error al actualizar cantidad');
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productoId: number) => {
        try {
            setLoading(true);
            await cartService.removeItem(productoId);
            await refreshCart();
        } catch (error: any) {
            throw new Error(error.message || 'Error al eliminar del carrito');
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            setLoading(true);
            await cartService.clearCart();
            await refreshCart();
        } catch (error: any) {
            throw new Error(error.message || 'Error al vaciar carrito');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshCart();
    }, []);

    const itemCount = cart.items.reduce((sum, item) => sum + item.cantidad, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                refreshCart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};
