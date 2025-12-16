// pages/CartPage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage: React.FC = () => {
    const { cart, loading, updateQuantity, removeFromCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/checkout');
        } else {
            navigate('/checkout');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pokemon-blue mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando carrito...</p>
            </div>
        );
    }

    if (cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="text-8xl mb-4">🛒</div>
                <h2 className="text-3xl font-bold mb-4 text-brand-black dark:text-brand-white">
                    Tu carrito está vacío
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    ¡Agrega algunas cartas increíbles a tu colección!
                </p>
                <Link
                    to="/catalogo"
                    className="inline-block px-6 py-3 bg-pokemon-blue hover:bg-pokemon-red text-white font-semibold rounded-lg shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                    Ver Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-black text-brand-black dark:text-brand-white mb-8">
                Carrito de Compras 🛒
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map(item => item.producto && (
                        <div
                            key={item.productoId}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-card border-2 border-brand-black dark:border-brand-white p-4 flex gap-4"
                        >
                            <img
                                src={item.producto.imagen}
                                alt={item.producto.nombre}
                                className="w-24 h-32 object-contain rounded"
                            />
                            <div className="flex-1">
                                <Link
                                    to={`/producto/${item.producto.id}`}
                                    className="font-bold text-lg text-brand-black dark:text-brand-white hover:text-pokemon-blue"
                                >
                                    {item.producto.nombre}
                                </Link>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.producto.set} • {item.producto.rareza}
                                </p>
                                <p className="text-xl font-bold text-pokemon-red dark:text-pokemon-yellow mt-2">
                                    ${item.producto.precio.toLocaleString('es-CL')}
                                </p>
                            </div>
                            <div className="flex flex-col justify-between items-end">
                                <button
                                    onClick={() => removeFromCart(item.productoId)}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item.productoId, Math.max(1, item.cantidad - 1))}
                                        className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-bold text-brand-black dark:text-brand-white">
                                        {item.cantidad}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.productoId, item.cantidad + 1)}
                                        className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                                        disabled={item.cantidad >= item.producto.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card border-2 border-brand-black dark:border-brand-white p-6 sticky top-24">
                        <h2 className="text-2xl font-bold mb-4 text-brand-black dark:text-brand-white">
                            Resumen del Pedido
                        </h2>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Subtotal ({cart.items.reduce((sum, item) => sum + item.cantidad, 0)} items)</span>
                                <span className="font-semibold">${cart.subtotal.toLocaleString('es-CL')}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Envío</span>
                                <span className="font-semibold">
                                    {cart.envio === 0 ? 'GRATIS' : `$${cart.envio.toLocaleString('es-CL')}`}
                                </span>
                            </div>
                            {cart.subtotal < 50000 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Envío gratis en compras sobre $50.000
                                </p>
                            )}
                            <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-3">
                                <div className="flex justify-between text-xl font-bold text-brand-black dark:text-brand-white">
                                    <span>Total</span>
                                    <span className="text-pokemon-red dark:text-pokemon-yellow">
                                        ${cart.total.toLocaleString('es-CL')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full px-6 py-4 bg-pokemon-blue hover:bg-pokemon-red text-white font-black text-lg rounded-lg shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                            Proceder al Pago
                        </button>
                        <Link
                            to="/catalogo"
                            className="block text-center mt-4 text-pokemon-blue dark:text-pokemon-yellow hover:underline"
                        >
                            ← Seguir Comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
