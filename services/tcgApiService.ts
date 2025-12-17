// services/tcgApiService.ts

export interface TcgCard {
    id: string;
    name: string;
    supertype: string;
    subtypes: string[];
    images: {
        small: string;
        large: string;
    };
    tcgplayer?: {
        url: string;
        prices: {
            holofoil?: { market: number };
            normal?: { market: number };
            reverseHolofoil?: { market: number };
        };
    };
    set: {
        name: string;
        series: string;
    };
    rarity: string;
    number: string;
}

const API_URL = 'https://api.pokemontcg.io/v2/cards';

export const tcgApiService = {
    async getRandomCards(count: number = 10): Promise<TcgCard[]> {
        // Random page choice to get different cards (approx 15000 cards total, page size 10 -> 1500 pages)
        // We'll pick a random page between 1 and 100 to ensure high quality modern cards usually
        const page = Math.floor(Math.random() * 50) + 1;

        try {
            const response = await fetch(`${API_URL}?page=${page}&pageSize=${count}`, {
                method: 'GET',
                headers: {
                    'X-Api-Key': '' // Optional: Add key if rate limit is hit
                }
            });
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching external TCG cards:', error);
            return [];
        }
    }
};
