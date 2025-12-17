// pages/OddiePage.tsx
import React, { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import type { Producto } from '../types';
import { useCart } from '../context/CartContext';

const OddiePage: React.FC = () => {
    const [rareProducts, setRareProducts] = useState<Producto[]>([]);
    const { addToCart } = useCart();

    useEffect(() => {
        productService.getProducts().then(all => {
            // Filter by high rarity
            const rares = all.filter(p => p.rareza.includes('Secret') || p.rareza.includes('Ultra'));
            setRareProducts(rares);
        });
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-black mb-2 text-brand-black dark:text-brand-white">Zona Oddie (Ultra Raras)</h1>
            <p className="text-xl text-purple-600 font-bold mb-8">¡Las joyas de la corona!</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rareProducts.map(p => (
                    <ProductCard key={p.id} producto={p} onAddToCart={(id) => addToCart(id)} />
                ))}
            </div>
        </div>
    );
};
export default OddiePage;
