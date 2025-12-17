// pages/AboutPage.tsx
import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-4xl font-black mb-8 text-brand-black dark:text-brand-white">Sobre Nosotros</h1>
            <div className="prose dark:prose-invert">
                <p>
                    Bienvenido a <strong>PokéStore Chile</strong>, tu destino número uno para cartas Pokémon TCG en el país.
                </p>
                <p>
                    Fundada por fanáticos para fanáticos, nos dedicamos a traer las expansiones más recientes y las cartas más buscadas del mercado. Comprometidos con la autenticidad y el buen servicio.
                </p>
                <h3>Nuestra Misión</h3>
                <p>
                    Conectar a coleccionistas y jugadores con las cartas que necesitan para completar sus mazos y colecciones.
                </p>
            </div>
        </div>
    );
};
export default AboutPage;
