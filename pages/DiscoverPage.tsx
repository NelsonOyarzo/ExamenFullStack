// pages/DiscoverPage.tsx
import React, { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import type { Producto } from '../types';
import { useCart } from '../context/CartContext';

const DiscoverPage: React.FC = () => {
    const [randomProducts, setRandomProducts] = useState<Producto[]>([]);
    const { addToCart } = useCart();

    useEffect(() => {
        productService.getProducts().then(all => {
            // Shuffle and pick 6
            const shuffled = [...all].sort(() => 0.5 - Math.random());
            setRandomProducts(shuffled.slice(0, 6));
        });
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-black mb-8 text-brand-black dark:text-brand-white">Descubrir</h1>
            <p className="mb-8 text-gray-600">Explora cartas aleatorias de nuestra colección.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {randomProducts.map(p => (
                    <ProductCard key={p.id} producto={p} onAddToCart={(id) => addToCart(id)} />
                ))}
            </div>
        </div>
    );
};
export default DiscoverPage;
