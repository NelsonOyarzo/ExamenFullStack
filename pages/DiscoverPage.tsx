// pages/DiscoverPage.tsx
import React, { useEffect, useState } from 'react';
import { tcgApiService, TcgCard } from '../services/tcgApiService';

const DiscoverPage: React.FC = () => {
    const [externalCards, setExternalCards] = useState<TcgCard[]>([]);
    const [loading, setLoading] = useState(true);

    const loadCards = async () => {
        setLoading(true);
        const cards = await tcgApiService.getRandomCards(12);
        setExternalCards(cards);
        setLoading(false);
    };

    useEffect(() => {
        loadCards();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pokemon-blue mx-auto mb-4"></div>
                <p className="text-xl font-bold text-gray-600">Buscando cartas raras en el mundo...</p>
            </div>
        );
    }

    if (externalCards.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="text-6xl mb-4">😿</div>
                <h2 className="text-2xl font-bold mb-2">No pudimos conectar con el servidor de Pokémon</h2>
                <p className="text-gray-600 mb-6">El API externo está tardando demasiado o no responde.</p>
                <button
                    onClick={loadCards}
                    className="bg-pokemon-blue hover:bg-pokemon-red text-white font-bold py-3 px-6 rounded-lg shadow-hard hover:shadow-none transition-all"
                >
                    Reintentar Conexión
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-black text-brand-black dark:text-brand-white">
                        Explorador Global <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full align-middle ml-2">API Externa</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Explora cartas del TCG oficial. Estas cartas no están en nuestra tienda local, pero puedes ver sus precios de mercado.
                    </p>
                </div>
                <button
                    onClick={loadCards}
                    className="bg-pokemon-blue hover:bg-pokemon-red text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center gap-2"
                >
                    🔄 Recargar Nuevas
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {externalCards.map(card => (
                    <div key={card.id} className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                            <img
                                src={card.images.large}
                                alt={card.name}
                                className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                            />
                            {/* Overlay info */}
                            <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded font-bold">
                                    {card.rarity || 'Common'}
                                </span>
                                {card.tcgplayer?.prices?.holofoil?.market && (
                                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold">
                                        Ref: ${card.tcgplayer.prices.holofoil.market} USD
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="font-bold text-lg text-brand-black dark:text-brand-white line-clamp-1 mb-1">
                                {card.name}
                            </h3>
                            <p className="text-xs text-gray-500 mb-4">
                                {card.set.series} - {card.set.name}
                            </p>

                            <a
                                href={card.tcgplayer?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center py-2 border-2 border-pokemon-blue text-pokemon-blue dark:text-pokemon-yellow dark:border-pokemon-yellow font-bold rounded-lg hover:bg-pokemon-blue hover:text-white dark:hover:bg-pokemon-yellow dark:hover:text-black transition-colors"
                            >
                                Ver en TCGPlayer ↗
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscoverPage;
