// pages/AdminDashboardPage.tsx - Simplified
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminDashboardPage: React.FC = () => {
    const { isAdmin } = useAuth();

    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-black mb-8">Panel de Administración</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card border-2 border-brand-black p-6">
                    <h3 className="text-xl font-bold mb-2">Productos</h3>
                    <p className="text-gray-600 dark:text-gray-400">Gestión de cartas</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card border-2 border-brand-black p-6">
                    <h3 className="text-xl font-bold mb-2">Órdenes</h3>
                    <p className="text-gray-600 dark:text-gray-400">Gestión de pedidos</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card border-2 border-brand-black p-6">
                    <h3 className="text-xl font-bold mb-2">Usuarios</h3>
                    <p className="text-gray-600 dark:text-gray-400">Gestión de clientes</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
