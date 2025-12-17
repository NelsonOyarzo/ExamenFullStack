// pages/OrderHistoryPage.tsx
import React, { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import { Link } from 'react-router-dom';

const OrderHistoryPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        orderService.getOrders()
            .then(setOrders)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-center" >Cargando historial...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-black mb-8 text-brand-black dark:text-brand-white">Mis Pedidos</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-xl mb-4">Aún no has realizado ninguna compra.</p>
                    <Link to="/catalogo" className="text-pokemon-blue font-bold hover:underline">Ir a la tienda</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-card border-l-4 border-pokemon-blue flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <div className="text-sm text-gray-500">Orden #{order.id.slice(0, 8)}</div>
                                <div className="font-bold text-lg">{orderService.formatDate(order.fechaCreacion)}</div>
                                <div className="text-sm">{order.items.length} productos</div>
                            </div>

                            <div className="text-center md:text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-2 ${order.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                        order.estado === 'Entregado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {order.estado}
                                </span>
                                <div className="font-black text-xl">{orderService.formatPrice(order.total)}</div>
                            </div>

                            <div>
                                <Link
                                    to={`/orden/${order.id}`}
                                    className="px-4 py-2 border-2 border-brand-black rounded font-bold hover:bg-brand-black hover:text-white transition-colors"
                                >
                                    Ver Detalles
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;
