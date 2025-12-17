// components/Header.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b-4 border-brand-black dark:border-brand-white shadow-lg">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-12 h-12 bg-pokemon-red rounded-full flex items-center justify-center shadow-hard group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                            <span className="text-2xl">🎴</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-brand-black dark:text-brand-white">
                                Poké<span className="text-pokemon-red dark:text-pokemon-yellow">Store</span>
                            </h1>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Chile TCG</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/"
                            className="font-semibold text-brand-black dark:text-brand-white hover:text-pokemon-blue dark:hover:text-pokemon-yellow transition-colors"
                        >
                            Inicio
                        </Link>
                        <Link
                            to="/catalogo"
                            className="font-semibold text-brand-black dark:text-brand-white hover:text-pokemon-blue dark:hover:text-pokemon-yellow transition-colors"
                        >
                            Catálogo
                        </Link>
                        <Link
                            to="/contacto"
                            className="font-semibold text-brand-black dark:text-brand-white hover:text-pokemon-blue dark:hover:text-pokemon-yellow transition-colors"
                        >
                            Contacto
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        {/* Cart */}
                        <Link
                            to="/carrito"
                            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6 text-brand-black dark:text-brand-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-pokemon-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pop-in">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <div className="w-8 h-8 bg-pokemon-blue rounded-full flex items-center justify-center text-white font-bold">
                                        {user?.nombre.charAt(0).toUpperCase()}
                                    </div>
                                    <svg className="w-4 h-4 text-brand-black dark:text-brand-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-hard border-2 border-brand-black dark:border-brand-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <div className="p-3 border-b-2 border-gray-200 dark:border-gray-700">
                                        <p className="font-semibold text-brand-black dark:text-brand-white">{user?.nombre}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{user?.correo}</p>
                                    </div>
                                    <div className="py-2">
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-brand-black dark:text-brand-white"
                                            >
                                                Panel Admin
                                            </Link>
                                        )}
                                        <Link
                                            to="/dashboard"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-brand-black dark:text-brand-white"
                                        >
                                            Mi Cuenta
                                        </Link>
                                        <Link
                                            to="/ordenes"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-brand-black dark:text-brand-white"
                                        >
                                            Mis Pedidos
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-pokemon-blue hover:bg-pokemon-red text-white font-semibold rounded-lg shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                            >
                                Ingresar
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                        >
                            <svg className="w-6 h-6 text-brand-black dark:text-brand-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t-2 border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                        <Link to="/" className="block py-2 font-semibold text-brand-black dark:text-brand-white hover:text-pokemon-blue">
                            Inicio
                        </Link>
                        <Link to="/catalogo" className="block py-2 font-semibold text-brand-black dark:text-brand-white hover:text-pokemon-blue">
                            Catálogo
                        </Link>
                        <Link to="/contacto" className="block py-2 font-semibold text-brand-black dark:text-brand-white hover:text-pokemon-blue">
                            Contacto
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
