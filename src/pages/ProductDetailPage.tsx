// pages/ProductDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import StockBadge from '../components/StockBadge';
import type { Producto } from '../types';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [producto, setProducto] = useState<Producto | null>(null);
    const [loading, setLoading] = useState(true);
    const [cantidad, setCantidad] = useState(1);
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) loadProducto(Number(id));
    }, [id]);

    const loadProducto = async (productId: number) => {
        try {
            const data = await productService.getProductById(productId);
            setProducto(data);
        } catch (error) {
            console.error('Error loading product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!producto) return;
        try {
            await addToCart(producto.id, cantidad);
            showToast(`${cantidad}x ${producto.nombre} agregado(s)`, 'success');
            // navigate('/carrito'); // Removed redirect for better UX with toast
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pokemon-blue mx-auto"></div>
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold">Producto no encontrado</h2>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img src={producto.imagen} alt={producto.nombre} className="w-full rounded-lg shadow-card" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-brand-black dark:text-brand-white mb-4">{producto.nombre}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{producto.set} • {producto.numeroSet}</p>
                    <StockBadge stock={producto.stock} className="mb-4" />
                    <p className="text-4xl font-bold text-pokemon-red dark:text-pokemon-yellow mb-6">
                        ${producto.precio.toLocaleString('es-CL')}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">{producto.descripcion}</p>
                    {producto.stock > 0 && (
                        <div className="flex gap-4 mb-6">
                            <input
                                type="number"
                                min="1"
                                max={producto.stock}
                                value={cantidad}
                                onChange={(e) => setCantidad(Number(e.target.value))}
                                className="w-20 px-4 py-2 border-2 border-brand-black rounded-lg"
                            />
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 px-6 py-3 bg-pokemon-blue hover:bg-pokemon-red text-white font-bold rounded-lg shadow-hard hover:shadow-none transition-all"
                            >
                                Agregar al Carrito
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
