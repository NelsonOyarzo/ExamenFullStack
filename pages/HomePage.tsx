// pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import type { Producto } from '../types';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Producto[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await productService.getProducts({ ordenar: 'precio-desc' });
      setFeaturedProducts(products.slice(0, 6));
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  };

  const handleAddToCart = async (productoId: number) => {
    try {
      await addToCart(productoId, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pokemon-blue via-pokemon-red to-pokemon-yellow py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 animate-pop-in drop-shadow-lg">
            ¡Bienvenido a PokéStore Chile! 🎴
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 animate-slide-up drop-shadow-md">
            Las mejores cartas Pokémon TCG con envío a todo Chile
          </p>
          <Link
            to="/catalogo"
            className="inline-block px-8 py-4 bg-white text-pokemon-red font-black text-lg rounded-lg shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Ver Catálogo Completo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-card border-2 border-brand-black dark:border-brand-white">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2 text-brand-black dark:text-brand-white">Envío a Todo Chile</h3>
              <p className="text-gray-600 dark:text-gray-400">Despacho rápido y seguro a todas las regiones</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-card border-2 border-brand-black dark:border-brand-white">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2 text-brand-black dark:text-brand-white">Cartas Auténticas</h3>
              <p className="text-gray-600 dark:text-gray-400">100% originales y verificadas</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-card border-2 border-brand-black dark:border-brand-white">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-bold mb-2 text-brand-black dark:text-brand-white">Pago Seguro</h3>
              <p className="text-gray-600 dark:text-gray-400">Múltiples métodos de pago disponibles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-black text-brand-black dark:text-brand-white mb-8 text-center">
            Cartas Destacadas ⭐
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProducts.map(producto => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/catalogo"
              className="inline-block px-6 py-3 bg-pokemon-blue hover:bg-pokemon-red text-white font-semibold rounded-lg shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Ver Todas las Cartas →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-pokemon-blue text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">¿Nuevo en Pokémon TCG?</h2>
          <p className="text-xl mb-8">Descubre el emocionante mundo de las cartas coleccionables</p>
          <Link
            to="/contacto"
            className="inline-block px-8 py-4 bg-white text-pokemon-blue font-black rounded-lg shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Contáctanos
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
