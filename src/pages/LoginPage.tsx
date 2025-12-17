// pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { formatRut } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        correo: '',
        contrasena: '',
        nombre: '',
        run: '',
        telefono: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.correo, formData.contrasena);
                showToast(`Bienvenido, ${formData.correo}`, 'success');
                const redirect = searchParams.get('redirect') || '/';
                navigate(redirect);
            } else {
                await register(formData);
                setIsLogin(true);
                setError('');
                showToast('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
            }
        } catch (err: any) {
            const msg = err.message || 'Error en la operación';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pokemon-blue via-pokemon-red to-pokemon-yellow flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-hard border-4 border-brand-black dark:border-brand-white p-8">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🎴</div>
                    <h1 className="text-3xl font-black text-brand-black dark:text-brand-white">
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {isLogin ? 'Bienvenido de vuelta' : 'Únete a PokéStore Chile'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-brand-black dark:text-brand-white">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-brand-black dark:border-brand-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue dark:bg-gray-700 dark:text-white"
                                    placeholder="Juan Pérez"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-brand-black dark:text-brand-white">
                                    RUN (RUT) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.run}
                                    onChange={(e) => setFormData({ ...formData, run: formatRut(e.target.value) })}
                                    className="w-full px-4 py-2 border-2 border-brand-black dark:border-brand-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue dark:bg-gray-700 dark:text-white"
                                    placeholder="12.345.678-9"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-brand-black dark:text-brand-white">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                    className="w-full px-4 py-2 border-2 border-brand-black dark:border-brand-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue dark:bg-gray-700 dark:text-white"
                                    placeholder="+56 9 1234 5678"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-brand-black dark:text-brand-white">
                            Correo Electrónico *
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.correo}
                            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-brand-black dark:border-brand-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue dark:bg-gray-700 dark:text-white"
                            placeholder="usuario@pokestore.cl"
                        />
                        {!isLogin && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Debe ser @pokestore.cl o @duocuc.cl
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-brand-black dark:text-brand-white">
                            Contraseña *
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.contrasena}
                            onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-brand-black dark:border-brand-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue dark:bg-gray-700 dark:text-white"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 bg-pokemon-blue hover:bg-pokemon-red text-white font-black rounded-lg shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                        className="text-pokemon-blue dark:text-pokemon-yellow hover:underline font-semibold"
                    >
                        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
                        ← Volver al inicio
                    </Link>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm">
                    <p className="font-semibold text-brand-black dark:text-brand-white mb-2">Credenciales de prueba:</p>
                    <p className="text-gray-600 dark:text-gray-400">
                        <strong>Admin:</strong> admin@pokestore.cl / admin123
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
