// pages/UserDashboardPage.tsx - Simplified
import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserDashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-black mb-8">Mi Cuenta</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card border-2 border-brand-black dark:border-brand-white p-6">
                <h2 className="text-2xl font-bold mb-4">Información Personal</h2>
                <div className="space-y-2">
                    <p><strong>Nombre:</strong> {user?.nombre}</p>
                    <p><strong>Correo:</strong> {user?.correo}</p>
                    <p><strong>RUN:</strong> {user?.run}</p>
                    <p><strong>Rol:</strong> {user?.rol}</p>
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage;
