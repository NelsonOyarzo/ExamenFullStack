// pages/UserDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import type { DireccionEnvio } from '../types';

const UserDashboardPage: React.FC = () => {
    const { user, login } = useAuth(); // We might need to refresh user in context, but authService.updateProfile returns new user
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        calle: '',
        comuna: '',
        ciudad: '',
        region: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre || '',
                telefono: user.telefono || '',
                calle: user.direccion?.calle || '',
                comuna: user.direccion?.comuna || '',
                ciudad: user.direccion?.ciudad || '',
                region: user.direccion?.region || ''
            });
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const direccion: DireccionEnvio = {
                calle: formData.calle,
                numero: '', // Simplified for demo
                comuna: formData.comuna,
                ciudad: formData.ciudad,
                region: formData.region
            };

            await authService.updateProfile({
                nombre: formData.nombre,
                telefono: formData.telefono,
                direccion
            });

            // Force reload to get fresh data or we would need to update context
            window.location.reload();
            // setMessage('Perfil actualizado correctamente');
            // setIsEditing(false);
        } catch (error) {
            setMessage('Error al actualizar perfil');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-black text-brand-black dark:text-brand-white mb-8">Mi Cuenta</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-hard border-2 border-brand-black dark:border-brand-white p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-brand-black dark:text-brand-white">Información Personal</h2>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-pokemon-blue font-bold hover:underline"
                        >
                            {isEditing ? 'Cancelar' : 'Editar Perfil'}
                        </button>
                    </div>

                    {message && <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{message}</div>}

                    {isEditing ? (
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Nombre Completo</label>
                                <input
                                    className="w-full p-2 border-2 border-gray-300 rounded focus:border-pokemon-blue outline-none"
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Teléfono</label>
                                <input
                                    className="w-full p-2 border-2 border-gray-300 rounded focus:border-pokemon-blue outline-none"
                                    value={formData.telefono}
                                    onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                />
                            </div>

                            <h3 className="font-bold border-b pb-2 mt-4">Dirección de Envío Predeterminada</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold mb-1">Calle y Número</label>
                                    <input
                                        className="w-full p-2 border-2 border-gray-300 rounded focus:border-pokemon-blue outline-none"
                                        value={formData.calle}
                                        onChange={e => setFormData({ ...formData, calle: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Comuna</label>
                                    <input
                                        className="w-full p-2 border-2 border-gray-300 rounded focus:border-pokemon-blue outline-none"
                                        value={formData.comuna}
                                        onChange={e => setFormData({ ...formData, comuna: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Ciudad</label>
                                    <input
                                        className="w-full p-2 border-2 border-gray-300 rounded focus:border-pokemon-blue outline-none"
                                        value={formData.ciudad}
                                        onChange={e => setFormData({ ...formData, ciudad: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-3 bg-pokemon-blue text-white font-bold rounded hover:bg-blue-600 transition-colors">
                                Guardar Cambios
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-bold">Nombre:</span>
                                <span>{user?.nombre}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-bold">Correo:</span>
                                <span>{user?.correo}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-bold">RUN:</span>
                                <span>{user?.run}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-bold">Teléfono:</span>
                                <span>{user?.telefono || 'No registrado'}</span>
                            </div>
                            <div className="pt-2">
                                <span className="block font-bold mb-1">Dirección Registrada:</span>
                                <span className="block text-sm">
                                    {user?.direccion ? `${user.direccion.calle}, ${user.direccion.comuna}, ${user.direccion.ciudad}` : 'No registrada'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Orders Summary (Placeholder for now, or link to history) */}
                <div className="bg-pokemon-red/10 rounded-lg p-8 border-2 border-pokemon-red">
                    <h2 className="text-2xl font-bold text-pokemon-red mb-4">Mis Pedidos</h2>
                    <p className="mb-4">Revisa el estado de tus compras anteriores.</p>
                    <a href="#/ordenes" className="inline-block px-6 py-2 bg-pokemon-red text-white font-bold rounded hover:bg-red-700">
                        Ver Mis Pedidos
                    </a>
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPage;
