// pages/CheckoutPage.tsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { useNavigate } from 'react-router-dom';
import type { DireccionEnvio } from '../types';

const CheckoutPage: React.FC = () => {
    const { cart, refreshCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        calle: '',
        comuna: '',
        ciudad: '',
        region: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/checkout');
            return;
        }

        if (cart.items.length === 0) {
            navigate('/carrito');
            return;
        }

        // Prefill address if user has one
        if (user?.direccion) {
            setFormData({
                calle: user.direccion.calle || '',
                comuna: user.direccion.comuna || '',
                ciudad: user.direccion.ciudad || '',
                region: user.direccion.region || ''
            });
        }
    }, [user, cart, isAuthenticated, navigate]);

    const handleWebpayPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Save address to localstorage to use it on return
            localStorage.setItem('pendingOrderAddress', JSON.stringify({
                calle: formData.calle,
                comuna: formData.comuna,
                ciudad: formData.ciudad,
                region: formData.region
            }));

            // 2. Init Webpay Transaction
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/webpay/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: cart.total })
            });
            const data = await response.json();

            if (!data.url || !data.token) throw new Error('Error al iniciar Webpay');

            // 3. Auto-submit form to Transbank
            const form = document.createElement('form');
            form.action = data.url;
            form.method = 'POST';

            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = 'token_ws';
            tokenInput.value = data.token;

            form.appendChild(tokenInput);
            document.body.appendChild(form);
            form.submit();

        } catch (error: any) {
            alert(error.message || 'Error al procesar el pago');
            setLoading(false);
        }
    };

    const formatPrice = (p: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(p);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-black mb-8 text-brand-black dark:text-brand-white">Finalizar Compra</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Shipping Form */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-card border-2 border-brand-black dark:border-brand-white">
                    <h2 className="text-2xl font-bold mb-6">Dirección de Envío</h2>
                    <form onSubmit={handleWebpayPayment} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Calle y Número *</label>
                            <input
                                required
                                className="w-full p-3 border-2 border-gray-300 rounded focus:border-pokemon-blue outline-none"
                                placeholder="Ej: Av. Pajaritos 1234"
                                value={formData.calle}
                                onChange={e => setFormData({ ...formData, calle: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Comuna *</label>
                                <input
                                    required
                                    className="w-full p-3 border-2 border-gray-300 rounded focus:border-pokemon-blue outline-none"
                                    placeholder="Ej: Maipú"
                                    value={formData.comuna}
                                    onChange={e => setFormData({ ...formData, comuna: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Ciudad *</label>
                                <input
                                    required
                                    className="w-full p-3 border-2 border-gray-300 rounded focus:border-pokemon-blue outline-none"
                                    placeholder="Ej: Santiago"
                                    value={formData.ciudad}
                                    onChange={e => setFormData({ ...formData, ciudad: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Región *</label>
                            <input
                                required
                                className="w-full p-3 border-2 border-gray-300 rounded focus:border-pokemon-blue outline-none"
                                placeholder="Ej: Metropolitana"
                                value={formData.region}
                                onChange={e => setFormData({ ...formData, region: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 py-4 bg-pokemon-blue text-white font-black text-xl rounded-lg shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Redirigiendo a Webpay...' : `Pagar con Webpay ${formatPrice(cart.total)}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg h-fit border-2 border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                        {cart.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <div>
                                    <span className="font-bold">{item.cantidad}x </span>
                                    {item.producto?.nombre}
                                </div>
                                <div className="font-mono">
                                    {formatPrice((item.producto?.precio || 0) * item.cantidad)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatPrice(cart.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Envío</span>
                            <span>{cart.envio === 0 ? 'Gratis' : formatPrice(cart.envio)}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-black mt-4 pt-4 border-t border-dashed border-gray-300">
                            <span>Total</span>
                            <span>{formatPrice(cart.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
