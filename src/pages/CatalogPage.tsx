// pages/CatalogPage.tsx
import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import type { Producto, ProductFilters } from '../types';

const CatalogPage: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ProductFilters>({});
    const { addToCart } = useCart();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        loadProductos();
    }, [filters]);

    const loadProductos = async () => {
        try {
            setLoading(true);
            const data = await productService.getProducts(filters);
            setProductos(data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productoId: number) => {
        try {
            await addToCart(productoId, 1);
            setMessage({ type: 'success', text: '¡Carta agregada al carrito!' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({});
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-black text-brand-black dark:text-brand-white mb-2">
                    Catálogo de Cartas
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Encuentra las mejores cartas Pokémon TCG
                </p>
            </div>

            {/* Message */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} animate-slide-up`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card border-2 border-brand-black dark:border-brand-white p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-4 text-brand-black dark:text-brand-white">Filtros</h2>

                        {/* Search */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2 text-brand-black dark:text-brand-white">
                                Buscar
                            </label>
                            <input
                                type="text"
                                placeholder="Nombre de carta..."
                                value={filters.buscar || ''}
                                onChange={(e) => handleFilterChange('buscar', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-brand-black dark:border-brand-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Rareza */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2 text-brand-black dark:text-brand-white">
                                Rareza
                            </label>
                            <select
                                value={filters.rareza || ''}
                                onChange={(e) => handleFilterChange('rareza', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-brand-black dark:border-brand-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Todas</option>
                                {productService.getRarezas().map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tipo */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2 text-brand-black dark:text-brand-white">
                                Tipo
                            </label>
                            <select
                                value={filters.tipo || ''}
                                onChange={(e) => handleFilterChange('tipo', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-brand-black dark:border-brand-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Todos</option>
                                {productService.getTipos().map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        {/* Ordenar */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2 text-brand-black dark:text-brand-white">
                                Ordenar por
                            </label>
                            <select
                                value={filters.ordenar || ''}
                                onChange={(e) => handleFilterChange('ordenar', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-brand-black dark:border-brand-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Predeterminado</option>
                                <option value="precio-asc">Precio: Menor a Mayor</option>
                                <option value="precio-desc">Precio: Mayor a Menor</option>
                                <option value="nombre">Nombre A-Z</option>
                                <option value="stock">Stock Disponible</option>
                            </select>
                        </div>

                        <button
                            onClick={clearFilters}
                            className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-brand-black dark:text-brand-white font-semibold rounded-lg transition-colors"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 animate-pulse"></div>
                            ))}
                        </div>
                    ) : productos.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                No se encontraron cartas con estos filtros
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                {productos.length} carta{productos.length !== 1 ? 's' : ''} encontrada{productos.length !== 1 ? 's' : ''}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {productos.map(producto => (
                                    <ProductCard
                                        key={producto.id}
                                        producto={producto}
                                        onAddToCart={handleAddToCart}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CatalogPage;
