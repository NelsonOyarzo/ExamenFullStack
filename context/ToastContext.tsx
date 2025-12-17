// context/ToastContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<{ message: string; type: ToastType; visible: boolean } | null>(null);

    const showToast = (message: string, type: ToastType = 'info') => {
        setToast({ message, type, visible: true });
        // Auto hide after 3 seconds
        setTimeout(() => {
            setToast(prev => prev ? { ...prev, visible: false } : null);
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 transform transition-all duration-300 ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className={`flex items-center space-x-2 px-6 py-4 rounded-lg shadow-lg border-2 ${toast.type === 'success' ? 'bg-green-100 border-green-500 text-green-800' :
                            toast.type === 'error' ? 'bg-red-100 border-red-500 text-red-800' :
                                'bg-blue-100 border-blue-500 text-blue-800'
                        }`}>
                        {toast.type === 'success' && <CheckCircleIcon className="w-6 h-6" />}
                        {toast.type === 'error' && <XCircleIcon className="w-6 h-6" />}
                        {toast.type === 'info' && <InformationCircleIcon className="w-6 h-6" />}
                        <span className="font-bold">{toast.message}</span>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
