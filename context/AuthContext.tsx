// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (correo: string, contrasena: string) => Promise<void>;
    logout: () => void;
    register: (data: any) => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (authService.isAuthenticated()) {
                try {
                    const profile = await authService.getProfile();
                    setUser(profile);
                    authService.setCurrentUser(profile);
                } catch (error) {
                    console.error('Error loading profile:', error);
                    authService.logout();
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (correo: string, contrasena: string) => {
        try {
            const response = await authService.login(correo, contrasena);
            setUser(response.user as User);
            authService.setCurrentUser(response.user as User);
        } catch (error: any) {
            throw new Error(error.message || 'Error al iniciar sesión');
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const register = async (data: any) => {
        try {
            await authService.register(data);
        } catch (error: any) {
            throw new Error(error.message || 'Error al registrar');
        }
    };

    const updateProfile = async (data: any) => {
        try {
            const updated = await authService.updateProfile(data);
            setUser(updated);
            authService.setCurrentUser(updated);
        } catch (error: any) {
            throw new Error(error.message || 'Error al actualizar perfil');
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                register,
                updateProfile,
                isAuthenticated: !!user,
                isAdmin: user?.rol === 'Administrador',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
