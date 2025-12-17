// pages/OrderConfirmationPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const OrderConfirmationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            orderService.getOrderById(id)
                .then(setOrder)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="p-8 text-center">Cargando recibo...</div>;

    if (!order) return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Orden no encontrada</h1>
            <Link to="/" className="text-pokemon-blue underline">Volver al inicio</Link>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-hard border-4 border-green-500 p-8 text-center mb-8">
                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h1 className="text-4xl font-black mb-2">¡Gracias por tu compra!</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">Tu orden ha sido recibida con éxito.</p>
                <div className="mt-4 inline-block bg-gray-100 px-4 py-2 rounded font-mono text-sm">
                    Orden ID: {order.id}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 dark:bg-gray-900 status-card p-6 rounded-lg border">
                    <h3 className="font-bold mb-4 border-b pb-2">Detalles de Envío</h3>
                    <p>{order.direccionEnvio.calle}</p>
                    <p>{order.direccionEnvio.comuna}, {order.direccionEnvio.ciudad}</p>
                    <p>{order.direccionEnvio.region}</p>
                    <div className="mt-4 pt-4 border-t">
                        <span className="text-sm text-gray-500">Estado Actual:</span>
                        <p className="font-bold text-pokemon-blue">{order.estado}</p>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 status-card p-6 rounded-lg border">
                    <h3 className="font-bold mb-4 border-b pb-2">Resumen de Costos</h3>
                    {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm mb-2">
                            <span>{item.cantidad}x {item.nombreProducto}</span>
                            <span>{orderService.formatPrice(item.precioUnitario * item.cantidad)}</span>
                        </div>
                    ))}
                    <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                        <span>Total Pagado</span>
                        <span>{orderService.formatPrice(order.total)}</span>
                    </div>
                </div>
            </div>

            <div className="text-center mt-12">
                <Link to="/catalogo" className="bg-brand-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
                    Seguir Comprando
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
