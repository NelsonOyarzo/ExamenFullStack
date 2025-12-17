// components/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { Producto } from '../types';
import { useToast } from '../context/ToastContext';

interface ProductCardProps {
    producto: Producto;
    onAddToCart?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ producto, onAddToCart }) => {
    const { showToast } = useToast();
    const getRarezaColor = (rareza: string) => {
        if (rareza.includes('Secret')) return 'bg-rare-gold text-brand-black';
        if (rareza.includes('Ultra')) return 'bg-rare-silver text-brand-black';
        if (rareza.includes('VMAX') || rareza.includes('VSTAR')) return 'bg-purple-600 text-white';
        if (rareza.includes('Rare')) return 'bg-blue-600 text-white';
        return 'bg-gray-600 text-white';
    };

    const getStockStatus = () => {
        if (producto.stock === 0) return { text: 'Agotado', color: 'text-red-600' };
        if (producto.stock <= 3) return { text: `Solo ${producto.stock} disponibles`, color: 'text-yellow-600' };
        return { text: 'En Stock', color: 'text-green-600' };
    };

    const stockStatus = getStockStatus();

    return (
        <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border-2 border-brand-black dark:border-brand-white">
            <Link to={`/producto/${producto.id}`}>
                <div className="aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                        src={producto.imagen || '/placeholder-card.png'}
                        alt={producto.nombre}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                    />
                </div>
            </Link>

            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <Link to={`/producto/${producto.id}`} className="flex-1">
                        <h3 className="font-bold text-lg text-brand-black dark:text-brand-white line-clamp-2 group-hover:text-pokemon-blue dark:group-hover:text-pokemon-yellow transition-colors">
                            {producto.nombre}
                        </h3>
                    </Link>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getRarezaColor(producto.rareza)}`}>
                        {producto.rareza.split(' ')[0]}
                    </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {producto.set} • {producto.numeroSet}
                </p>

                <div className="flex items-center justify-between mt-3">
                    <div>
                        <p className="text-2xl font-bold text-pokemon-red dark:text-pokemon-yellow">
                            ${producto.precio.toLocaleString('es-CL')}
                        </p>
                        <p className={`text-xs font-medium ${stockStatus.color}`}>
                            {stockStatus.text}
                        </p>
                    </div>

                    {producto.stock > 0 && onAddToCart && (
                        <button
                            onClick={() => {
                                onAddToCart(producto.id);
                                showToast(`¡${producto.nombre} agregado!`, 'success');
                            }}
                            className="px-4 py-2 bg-pokemon-blue hover:bg-pokemon-red text-white font-semibold rounded-lg transition-colors duration-200 shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                        >
                            Agregar
                        </button>
                    )}
                </div>
            </div>

            {producto.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-xl px-4 py-2 bg-red-600 rounded-lg">
                        AGOTADO
                    </span>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
