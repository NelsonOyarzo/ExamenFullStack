// components/ThemeToggle.tsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-brand-black dark:text-brand-white"
            title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
        >
            {theme === 'light' ? (
                <MoonIcon className="w-6 h-6" />
            ) : (
                <SunIcon className="w-6 h-6 text-yellow-500" />
            )}
        </button>
    );
};

export default ThemeToggle;
